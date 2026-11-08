
"""
HEART DISEASE MODEL TRAINING

Dataset: Dataset/dataset_heart.csv

Input features:
1. age
2. sex
3. chest pain type
4. resting blood pressure
5. serum cholestoral

Target: heart disease

Assumed target mapping:
1 = No Heart Disease
2 = Heart Disease

Verify this mapping against your dataset documentation.
"""

from pathlib import Path
import json

import joblib
import pandas as pd

from sklearn.ensemble import RandomForestClassifier, ExtraTreesClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    confusion_matrix
)


# ==========================================
# PATHS
# ==========================================

BASE_DIR = Path(__file__).resolve().parent

DATASET_PATH = BASE_DIR / "Dataset" / "dataset_heart.csv"
MODEL_DIR = BASE_DIR / "model"

MODEL_DIR.mkdir(parents=True, exist_ok=True)

MODEL_PATH = MODEL_DIR / "heart_model.joblib"
META_PATH = MODEL_DIR / "heart_meta.json"
METRICS_PATH = MODEL_DIR / "heart_metrics.json"


# ==========================================
# CONFIGURATION
# ==========================================

RANDOM_STATE = 42

FEATURES = [
    "age",
    "sex",
    "chest pain type",
    "resting blood pressure",
    "serum cholestoral"
]

TARGET = "heart disease"

CLASS_LABELS = {
    1: "No Heart Disease",
    2: "Heart Disease"
}


# ==========================================
# LOAD DATASET
# ==========================================

def load_data():

    if not DATASET_PATH.exists():
        raise FileNotFoundError(
            f"Heart dataset not found: {DATASET_PATH}"
        )

    print("\nLoading Heart Disease Dataset...")

    df = pd.read_csv(DATASET_PATH)

    df.columns = df.columns.astype(str).str.strip()

    required_columns = FEATURES + [TARGET]

    missing_columns = [
        col for col in required_columns
        if col not in df.columns
    ]

    if missing_columns:
        raise ValueError(
            f"Missing columns: {missing_columns}\n"
            f"Available columns: {df.columns.tolist()}"
        )

    df = df[required_columns].copy()

    # Convert all required columns into numeric values.
    for column in required_columns:
        df[column] = pd.to_numeric(
            df[column],
            errors="coerce"
        )

    # Remove incomplete records.
    df = df.dropna()

    if df.empty:
        raise ValueError("No valid records found in the dataset.")

    X = df[FEATURES].copy()
    y = df[TARGET].astype(int)

    # Validate target values.
    if not set(y.unique()).issubset(CLASS_LABELS.keys()):
        raise ValueError(
            f"Unexpected target values: {sorted(y.unique())}. "
            "Expected 1 and 2."
        )

    if y.nunique() != 2:
        raise ValueError(
            "The dataset must contain both target classes."
        )

    if y.value_counts().min() < 2:
        raise ValueError(
            "Each target class needs at least two records."
        )

    print("\nDataset loaded successfully.")

    print("Total records:", len(df))
    print("Total features:", len(FEATURES))

    print("\nFeature names:")
    print(FEATURES)

    print("\nTarget distribution:")
    print(y.value_counts().sort_index())

    return X, y


# ==========================================
# BUILD MODELS
# ==========================================

def build_models():

    return {
        "random_forest": RandomForestClassifier(
            n_estimators=300,
            random_state=RANDOM_STATE,
            class_weight="balanced",
            n_jobs=-1
        ),

        "extra_trees": ExtraTreesClassifier(
            n_estimators=300,
            random_state=RANDOM_STATE,
            class_weight="balanced",
            n_jobs=-1
        )
    }


# ==========================================
# TRAIN AND EVALUATE
# ==========================================

def train_all():

    X, y = load_data()

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=RANDOM_STATE,
        stratify=y
    )

    models = build_models()

    results = {}

    print("\n========== MODEL TRAINING ==========")

    for name, model in models.items():

        print(f"\nTraining {name.upper()}...")

        model.fit(X_train, y_train)

        predictions = model.predict(X_test)

        accuracy = accuracy_score(
            y_test,
            predictions
        )

        precision = precision_score(
            y_test,
            predictions,
            average="weighted",
            zero_division=0
        )

        recall = recall_score(
            y_test,
            predictions,
            average="weighted",
            zero_division=0
        )

        f1 = f1_score(
            y_test,
            predictions,
            average="weighted",
            zero_division=0
        )

        results[name] = {
            "accuracy": round(float(accuracy), 4),
            "precision": round(float(precision), 4),
            "recall": round(float(recall), 4),
            "f1_score": round(float(f1), 4)
        }

        print("\nAccuracy:", round(accuracy * 100, 2), "%")
        print("Precision:", round(precision, 4))
        print("Recall:", round(recall, 4))
        print("F1 Score:", round(f1, 4))

        print("\nClassification Report:")
        print(
            classification_report(
                y_test,
                predictions,
                zero_division=0
            )
        )

        print("Confusion Matrix:")
        print(confusion_matrix(y_test, predictions))

    # ======================================
    # SELECT BEST MODEL
    # ======================================

    best_model_name = max(
        results,
        key=lambda name: results[name]["accuracy"]
    )

    print("\nBest Model:", best_model_name)

    # Train the selected model on the complete dataset.
    final_model = build_models()[best_model_name]

    final_model.fit(X, y)

    # Save trained model.
    joblib.dump(
        final_model,
        MODEL_PATH,
        compress=3
    )

    # ======================================
    # SAVE METADATA
    # ======================================

    metadata = {
        "features": FEATURES,
        "target": TARGET,
        "classes": [1, 2],
        "class_labels": {
            str(key): value
            for key, value in CLASS_LABELS.items()
        },
        "best_model": best_model_name,
        "total_records": int(len(X))
    }

    META_PATH.write_text(
        json.dumps(metadata, indent=4),
        encoding="utf-8"
    )

    # ======================================
    # SAVE METRICS
    # ======================================

    metrics = {
        "models": results,
        "best_model": best_model_name,
        "dataset": "dataset_heart.csv",
        "total_records": int(len(X)),
        "features": FEATURES,
        "note": (
            "Metrics are from a single stratified holdout split. "
            "Model percentages are not clinically validated "
            "medical probabilities."
        )
    }

    METRICS_PATH.write_text(
        json.dumps(metrics, indent=4),
        encoding="utf-8"
    )

    print("\n========== FINAL RESULTS ==========")

    for name, score in results.items():

        print(
            name,
            "Accuracy:",
            score["accuracy"] * 100,
            "%"
        )

    print("\nBest model:", best_model_name)

    print("\nSaved files:")
    print(MODEL_PATH)
    print(META_PATH)
    print(METRICS_PATH)

    print("\nHeart model training completed!")


# ==========================================
# MAIN
# ==========================================

if __name__ == "__main__":
    train_all()
