"""
Supervised disease-classification training pipeline.

Run from this folder:
    python train.py --data
    python train.py --list
    python train.py --model random_forest
    python train.py
    python train.py --metrics

Important:
- Uses labeled datasets (symptoms = X, disease = y).
- Keeps Testing.csv / Test.csv out of training.
- Removes exact duplicate rows.
- Augments only training rows by hiding some symptoms.
- Reports validation accuracy and partial-symptom metrics.
- These metrics measure dataset performance, NOT medical accuracy.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import time
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.calibration import CalibratedClassifierCV
from sklearn.ensemble import ExtraTreesClassifier, RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, f1_score
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import BernoulliNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.svm import LinearSVC
from sklearn.tree import DecisionTreeClassifier

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "Dataset"
MODEL_DIR = BASE_DIR / "model"
METRICS_FILE = MODEL_DIR / "metrics.json"
META_FILE = MODEL_DIR / "meta.json"

VERSION = 3
RANDOM_STATE = 42
N_AUG = 20
TARGET_NAMES = {"prognosis", "disease", "diagnosis", "label", "target"}
TEST_FILE_STEMS = {"testing", "test"}


def _norm_symptom(value) -> str:
    if pd.isna(value):
        return ""
    return re.sub(r"[^a-z0-9]+", "_", str(value).strip().lower()).strip("_")


def build_models(min_class_count: int = 3, train_rows: int = 5):
    """Create estimators with settings safe for the available training data."""
    svm_cv = max(2, min(3, min_class_count))
    return {
        "logistic_regression": LogisticRegression(max_iter=3000, C=1.0),
        "decision_tree": DecisionTreeClassifier(random_state=RANDOM_STATE),
        "random_forest": RandomForestClassifier(
            n_estimators=300, random_state=RANDOM_STATE, n_jobs=-1,
            class_weight="balanced_subsample"
        ),
        "extra_trees": ExtraTreesClassifier(
            n_estimators=300, random_state=RANDOM_STATE, n_jobs=-1,
            class_weight="balanced"
        ),
        "naive_bayes": BernoulliNB(alpha=1.0),
        "knn": KNeighborsClassifier(
            n_neighbors=max(1, min(5, train_rows)), weights="distance"
        ),
        "linear_svm": CalibratedClassifierCV(
            LinearSVC(C=0.5, class_weight="balanced"), cv=svm_cv
        ),
        "neural_network": MLPClassifier(
            hidden_layer_sizes=(128, 64), max_iter=400,
            random_state=RANDOM_STATE, early_stopping=True
        ),
    }


def _read_file(path: Path):
    """Return (binary symptom dataframe, labels, skip reason)."""
    try:
        df = pd.read_csv(path)
    except Exception as exc:
        return None, None, f"could not read CSV: {exc}"

    df.columns = [str(c).strip() for c in df.columns]
    df = df.loc[:, ~pd.Index(df.columns).str.lower().str.startswith("unnamed")]
    df = df.dropna(how="all")

    target = next((c for c in df.columns if c.lower() in TARGET_NAMES), None)
    if target is None:
        return None, None, "no disease/prognosis target column"

    df = df.dropna(subset=[target]).reset_index(drop=True)
    y = df[target].astype(str).str.strip().str.replace(r"\s+", " ", regex=True)
    features = [c for c in df.columns if c != target]
    if not features:
        return None, None, "no symptom columns"

    # List format: Disease, Symptom_1, Symptom_2, ...
    symptom_columns = [c for c in features if "symptom" in c.lower()]
    if len(symptom_columns) >= 2:
        rows = []
        for values in df[symptom_columns].itertuples(index=False, name=None):
            symptoms = {_norm_symptom(v) for v in values}
            symptoms.discard("")
            rows.append(sorted(symptoms))
        mlb = MultiLabelBinarizer()
        matrix = mlb.fit_transform(rows)
        X = pd.DataFrame(matrix, columns=mlb.classes_, index=df.index)
        if X.empty:
            return None, None, "no usable symptoms in list-format dataset"
        return X.astype(np.int8), y, None

    # Wide format: one 0/1 column per symptom.
    numeric = df[features].apply(pd.to_numeric, errors="coerce")
    if len(features) >= 2 and numeric.notna().mean().mean() >= 0.95:
        numeric = numeric.fillna(0)
        values = set(np.unique(numeric.to_numpy()))
        if values.issubset({0, 1, 0.0, 1.0}):
            numeric.columns = [_norm_symptom(c) for c in features]
            numeric = numeric.loc[:, [c != "" for c in numeric.columns]]
            numeric = numeric.T.groupby(level=0).max().T
            if numeric.shape[1] == 0:
                return None, None, "no usable symptom columns"
            return numeric.astype(np.int8).reset_index(drop=True), y, None

    return None, None, "unsupported format (expected 0/1 columns or Symptom_1, Symptom_2, ...)"


def _dataset_fingerprint(paths: list[Path]) -> str:
    digest = hashlib.sha256()
    for path in paths:
        digest.update(path.name.encode("utf-8"))
        digest.update(path.read_bytes())
    return digest.hexdigest()


def load_data(verbose: bool = False) -> dict:
    if not DATA_DIR.exists():
        raise RuntimeError(f"Dataset folder not found: {DATA_DIR}")

    train_parts, test_parts, report, used_paths = [], [], [], []
    for path in sorted(DATA_DIR.glob("*.csv")):
        X, y, reason = _read_file(path)
        if X is None:
            report.append(f"SKIPPED {path.name}: {reason}")
            continue
        is_test = path.stem.lower() in TEST_FILE_STEMS
        frame = X.copy()
        frame["__label__"] = y.to_numpy()
        (test_parts if is_test else train_parts).append(frame)
        used_paths.append(path)
        report.append(
            f"USED {path.name}: {len(X)} rows, {X.shape[1]} symptoms, "
            f"{y.nunique()} diseases ({'TEST' if is_test else 'TRAIN'})"
        )

    if not train_parts:
        raise RuntimeError("No usable training CSV found.\n" + "\n".join(report))

    # Align symptom columns across different CSV formats/files.
    train_frame = pd.concat(train_parts, ignore_index=True, sort=False).fillna(0)
    symptom_columns = sorted(c for c in train_frame.columns if c != "__label__")
    train_frame = train_frame.reindex(columns=symptom_columns + ["__label__"], fill_value=0)
    train_frame[symptom_columns] = train_frame[symptom_columns].astype(np.int8)

    before = len(train_frame)
    train_frame = train_frame.drop_duplicates().reset_index(drop=True)
    report.append(f"Training rows: {before} -> {len(train_frame)} after exact de-duplication")

    # Remove identical feature rows with conflicting labels: they are ambiguous examples.
    label_counts = train_frame.groupby(symptom_columns, dropna=False)["__label__"].nunique()
    ambiguous_keys = label_counts[label_counts > 1].reset_index()[symptom_columns]
    if len(ambiguous_keys):
        keyed = train_frame.merge(ambiguous_keys.assign(__ambiguous__=1),
                                  on=symptom_columns, how="left")
        removed = int(keyed["__ambiguous__"].notna().sum())
        train_frame = keyed[keyed["__ambiguous__"].isna()].drop(
            columns="__ambiguous__"
        ).reset_index(drop=True)
        report.append(f"Removed {removed} rows with identical symptoms but conflicting disease labels")

    if train_frame.empty:
        raise RuntimeError("No training rows remain after cleaning. Check your datasets.")

    X = train_frame[symptom_columns].astype(np.int8)
    y = train_frame["__label__"].astype(str)

    X_test = y_test = None
    if test_parts:
        test_frame = pd.concat(test_parts, ignore_index=True, sort=False).fillna(0)
        test_y = test_frame["__label__"].astype(str)
        test_X = test_frame.drop(columns="__label__").reindex(
            columns=symptom_columns, fill_value=0
        ).astype(np.int8)
        test_frame = test_X.copy()
        test_frame["__label__"] = test_y.to_numpy()
        test_frame = test_frame.drop_duplicates().reset_index(drop=True)
        X_test = test_frame[symptom_columns].astype(np.int8)
        y_test = test_frame["__label__"].astype(str)

        # Avoid exact train/test duplicates.
        train_hash = pd.util.hash_pandas_object(train_frame, index=False)
        test_hash = pd.util.hash_pandas_object(test_frame, index=False)
        duplicated_hashes = set(test_hash.tolist())
        keep = ~train_hash.isin(duplicated_hashes)
        train_frame = train_frame.loc[keep].reset_index(drop=True)
        X = train_frame[symptom_columns].astype(np.int8)
        y = train_frame["__label__"].astype(str)
        report.append(f"Removed {int((~keep).sum())} exact train/test duplicate rows")

    if len(train_frame) < 2:
        raise RuntimeError("Not enough unique training rows to split. Add more labeled data.")

    class_counts = y.value_counts()
    can_stratify = class_counts.min() >= 2 and y.nunique() > 1
    try:
        X_train, X_val, y_train, y_val = train_test_split(
            X, y, test_size=0.2, random_state=RANDOM_STATE,
            stratify=y if can_stratify else None
        )
    except ValueError:
        X_train, X_val, y_train, y_val = train_test_split(
            X, y, test_size=0.2, random_state=RANDOM_STATE
        )

    fingerprint = _dataset_fingerprint(used_paths)
    if verbose:
        print("\n".join(report))
        print(
            f"Symptoms: {len(symptom_columns)} | Diseases: {y.nunique()} | "
            f"train: {len(X_train)} | validation: {len(X_val)}"
        )
        print("Disease rows (training pool):")
        print(y.value_counts().to_string())

    return {
        "X_train": X_train.reset_index(drop=True),
        "y_train": y_train.reset_index(drop=True),
        "X_val": X_val.reset_index(drop=True),
        "y_val": y_val.reset_index(drop=True),
        "X_test": X_test,
        "y_test": y_test,
        "symptoms": symptom_columns,
        "diseases": sorted(y.unique().tolist()),
        "fingerprint": fingerprint,
        "report": report,
    }


def augment(X: np.ndarray, y: np.ndarray, n_aug: int, rng):
    """Create partial-symptom copies from training rows only."""
    X_parts, y_parts = [X], [y]
    for _ in range(n_aug):
        augmented = X.copy()
        for i in range(len(X)):
            active = np.flatnonzero(X[i])
            if len(active) <= 1:
                continue
            lower = max(1, int(np.ceil(len(active) * 0.3)))
            keep_count = int(rng.integers(lower, len(active) + 1))
            selected = rng.choice(active, size=keep_count, replace=False)
            augmented[i] = 0
            augmented[i, selected] = 1
        X_parts.append(augmented)
        y_parts.append(y)
    return np.vstack(X_parts), np.concatenate(y_parts)


def make_partial_set(X: np.ndarray, y: np.ndarray, rng, per_row=5, lo=2, hi=4):
    xs, ys = [], []
    for i in range(len(X)):
        active = np.flatnonzero(X[i])
        if len(active) == 0:
            continue
        for _ in range(per_row):
            count = min(len(active), int(rng.integers(lo, hi + 1)))
            row = np.zeros(X.shape[1], dtype=np.float32)
            row[rng.choice(active, size=count, replace=False)] = 1
            xs.append(row)
            ys.append(y[i])
    if not xs:
        return np.empty((0, X.shape[1]), dtype=np.float32), np.empty((0,), dtype=y.dtype)
    return np.asarray(xs), np.asarray(ys)


def _fresh_metrics():
    return {"version": VERSION, "models": {}, "best": None}


def _load_metrics():
    if METRICS_FILE.exists():
        try:
            data = json.loads(METRICS_FILE.read_text(encoding="utf-8"))
            if data.get("version") == VERSION:
                return data
        except (json.JSONDecodeError, OSError):
            pass
    return _fresh_metrics()


def _ensure_fresh(data: dict):
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    old_meta = {}
    if META_FILE.exists():
        try:
            old_meta = json.loads(META_FILE.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            old_meta = {}
    changed = (
        old_meta.get("version") != VERSION
        or old_meta.get("symptoms") != data["symptoms"]
        or old_meta.get("fingerprint") != data["fingerprint"]
    )
    if changed:
        for path in MODEL_DIR.glob("*.joblib"):
            path.unlink(missing_ok=True)
        METRICS_FILE.unlink(missing_ok=True)
        print("[info] Dataset/code version changed. Old model files and metrics cleared.")


def _save_meta(data: dict):
    META_FILE.write_text(json.dumps({
        "version": VERSION,
        "symptoms": data["symptoms"],
        "diseases": data["diseases"],
        "fingerprint": data["fingerprint"],
    }, indent=2), encoding="utf-8")


def _update_best(metrics: dict):
    eligible = {
        name: values for name, values in metrics["models"].items()
        if values.get("score") is not None
    }
    metrics["best"] = max(eligible, key=lambda n: eligible[n]["score"]) if eligible else None


def train_one(name: str, data: dict | None = None) -> dict:
    data = data or load_data(verbose=True)
    min_count = int(data["y_train"].value_counts().min())
    if name == "linear_svm" and min_count < 2:
        raise ValueError(
            "linear_svm skipped: at least 2 training rows per disease are needed "
            "for probability calibration. Add more rows or train another model."
        )

    models = build_models(min_class_count=min_count, train_rows=len(data["X_train"]))
    if name not in models:
        raise ValueError(f"Unknown model '{name}'. Choose from: {list(models)}")

    _ensure_fresh(data)
    columns = data["symptoms"]

    def frame(array):
        return pd.DataFrame(array, columns=columns)

    X_train = data["X_train"].to_numpy(dtype=np.float32)
    y_train = data["y_train"].to_numpy()
    X_val = data["X_val"].to_numpy(dtype=np.float32)
    y_val = data["y_val"].to_numpy()

    start = time.time()
    X_aug, y_aug = augment(
        X_train, y_train, N_AUG, np.random.default_rng(RANDOM_STATE)
    )
    model = models[name]
    model.fit(frame(X_aug), y_aug)
    train_seconds = round(time.time() - start, 2)

    val_pred = model.predict(frame(X_val))
    X_partial, y_partial = make_partial_set(
        X_val, y_val, np.random.default_rng(123)
    )
    if len(y_partial):
        partial_proba = model.predict_proba(frame(X_partial))
        classes = model.classes_
        top1 = classes[np.argmax(partial_proba, axis=1)]
        top3 = classes[np.argsort(-partial_proba, axis=1)[:, :min(3, len(classes))]]
        partial_accuracy = float((top1 == y_partial).mean())
        partial_top3 = float((top3 == y_partial[:, None]).any(axis=1).mean())
    else:
        partial_accuracy = None
        partial_top3 = None

    result = {
        "val_accuracy": round(float(accuracy_score(y_val, val_pred)), 4),
        "val_f1_macro": round(float(f1_score(y_val, val_pred, average="macro", zero_division=0)), 4),
        "partial_accuracy": round(partial_accuracy, 4) if partial_accuracy is not None else None,
        "partial_top3": round(partial_top3, 4) if partial_top3 is not None else None,
        "test_accuracy": None,
        "train_seconds": train_seconds,
    }

    if data["X_test"] is not None and len(data["X_test"]):
        test_X = data["X_test"].reindex(columns=columns, fill_value=0)
        test_pred = model.predict(frame(test_X.to_numpy(dtype=np.float32)))
        result["test_accuracy"] = round(
            float(accuracy_score(data["y_test"].to_numpy(), test_pred)), 4
        )

    score_parts = [result["val_accuracy"]]
    if result["partial_accuracy"] is not None:
        score_parts.append(result["partial_accuracy"])
    if result["test_accuracy"] is not None:
        score_parts.append(result["test_accuracy"])
    result["score"] = round(float(np.mean(score_parts)), 4)

    # Final estimator is refitted using train + validation rows.
    X_full = np.vstack([X_train, X_val])
    y_full = np.concatenate([y_train, y_val])
    X_aug, y_aug = augment(
        X_full, y_full, N_AUG, np.random.default_rng(RANDOM_STATE)
    )
    final_models = build_models(
        min_class_count=int(pd.Series(y_full).value_counts().min()),
        train_rows=len(X_full)
    )
    final_model = final_models[name]
    final_model.fit(frame(X_aug), y_aug)
    joblib.dump(final_model, MODEL_DIR / f"{name}.joblib", compress=3)

    _save_meta(data)
    metrics = _load_metrics()
    metrics["version"] = VERSION
    metrics["models"][name] = result
    _update_best(metrics)
    METRICS_FILE.write_text(json.dumps(metrics, indent=2), encoding="utf-8")
    return result


def train_all():
    data = load_data(verbose=True)
    results = {}
    for name in build_models().keys():
        print(f"\n>>> Training {name} ...")
        try:
            result = train_one(name, data)
            results[name] = result
            print(
                f"val={result['val_accuracy']} | partial={result['partial_accuracy']} | "
                f"top3={result['partial_top3']} | test={result['test_accuracy']}"
            )
        except (ValueError, RuntimeError) as exc:
            print(f"[SKIPPED] {name}: {exc}")
    return _load_metrics()


def print_table(metrics: dict):
    print("\n=== MODEL COMPARISON (sorted by score) ===")
    print(f"{'model':<22}{'val':>9}{'partial':>10}{'top3':>9}{'test':>9}{'score':>9}")
    rows = sorted(
        metrics.get("models", {}).items(),
        key=lambda item: item[1].get("score") or 0,
        reverse=True
    )
    for name, values in rows:
        print(
            f"{name:<22}{str(values.get('val_accuracy')):>9}"
            f"{str(values.get('partial_accuracy')):>10}"
            f"{str(values.get('partial_top3')):>9}"
            f"{str(values.get('test_accuracy')):>9}"
            f"{str(values.get('score')):>9}"
        )
    print(f"\nBest model: {metrics.get('best')}")
    print("These scores describe performance on your supplied dataset only.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", help="train one model")
    parser.add_argument("--list", action="store_true")
    parser.add_argument("--metrics", action="store_true")
    parser.add_argument("--data", action="store_true")
    args = parser.parse_args()

    if args.list:
        print("\n".join(build_models().keys()))
    elif args.metrics:
        print_table(_load_metrics())
    elif args.data:
        load_data(verbose=True)
    elif args.model:
        dataset = load_data(verbose=True)
        print(json.dumps(train_one(args.model, dataset), indent=2))
        print_table(_load_metrics())
    else:
        print_table(train_all())
