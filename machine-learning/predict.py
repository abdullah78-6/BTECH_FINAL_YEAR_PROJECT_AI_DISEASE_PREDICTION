"""
Prediction service logic. This module does not define FastAPI routes.
Symptoms are encoded using the exact feature order saved during training.
"""
from __future__ import annotations

import difflib
import json
import re
from pathlib import Path

import joblib
import numpy as np
import pandas as pd

BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "model"
METRICS_FILE = MODEL_DIR / "metrics.json"
META_FILE = MODEL_DIR / "meta.json"

_model_cache: dict = {}
_meta_cache: dict = {}


def clear_cache():
    _model_cache.clear()
    _meta_cache.clear()


def _normalize(value) -> str:
    return re.sub(r"[^a-z0-9]+", "_", str(value).strip().lower()).strip("_")


def get_meta() -> dict:
    if not _meta_cache:
        if not META_FILE.exists():
            raise FileNotFoundError("No trained model found. Run: python train.py")
        try:
            _meta_cache.update(json.loads(META_FILE.read_text(encoding="utf-8")))
        except (json.JSONDecodeError, OSError) as exc:
            raise RuntimeError(f"Could not read model metadata: {exc}") from exc
    if not _meta_cache.get("symptoms"):
        raise RuntimeError("Model metadata has no symptom features. Retrain the models.")
    return _meta_cache


def get_symptoms() -> list[str]:
    return get_meta()["symptoms"]


def get_metrics() -> dict:
    if not METRICS_FILE.exists():
        return {"models": {}, "best": None}
    try:
        return json.loads(METRICS_FILE.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return {"models": {}, "best": None}


def _load(name: str):
    if name not in _model_cache:
        path = MODEL_DIR / f"{name}.joblib"
        if not path.exists():
            raise FileNotFoundError(
                f"Model '{name}' is not trained. Run python train.py --model {name}"
            )
        _model_cache[name] = joblib.load(path)
    return _model_cache[name]


def _model_probabilities(model, X: pd.DataFrame):
    if not hasattr(model, "predict_proba"):
        raise RuntimeError("Selected model does not support probability predictions.")
    probabilities = np.asarray(model.predict_proba(X)[0], dtype=float)
    classes = np.asarray(model.classes_)
    return classes, probabilities


def _proba(model_name: str | None, X: pd.DataFrame):
    metrics = get_metrics()
    name = model_name or metrics.get("best")
    if not name:
        raise FileNotFoundError("No trained model is registered. Run python train.py.")

    if name != "ensemble":
        model = _load(name)
        classes, probabilities = _model_probabilities(model, X)
        return name, classes, probabilities

    trained_names = [
        model for model in metrics.get("models", {})
        if (MODEL_DIR / f"{model}.joblib").exists()
    ]
    if not trained_names:
        raise FileNotFoundError("No trained models are available for the ensemble.")

    # Align each model's probability vector by disease label before averaging.
    all_classes = sorted({
        str(label)
        for model_name in trained_names
        for label in _load(model_name).classes_
    })
    sums = np.zeros(len(all_classes), dtype=float)
    used = 0
    for model_name in trained_names:
        classes, probabilities = _model_probabilities(_load(model_name), X)
        mapping = {str(label): float(prob) for label, prob in zip(classes, probabilities)}
        sums += np.array([mapping.get(label, 0.0) for label in all_classes])
        used += 1

    if used == 0:
        raise RuntimeError("No compatible models could be loaded for the ensemble.")
    return "ensemble", np.asarray(all_classes), sums / used


def predict(symptoms: list[str], model_name: str | None = None, top_k: int = 3) -> dict:
    if not isinstance(symptoms, list) or not symptoms:
        raise ValueError("Please provide at least one symptom.")

    all_symptoms = get_symptoms()
    matched, unknown, corrected = [], [], {}

    for raw in symptoms:
        if not isinstance(raw, str) or not raw.strip():
            continue
        key = _normalize(raw)
        if key in all_symptoms:
            hit = key
        else:
            close = difflib.get_close_matches(key, all_symptoms, n=1, cutoff=0.88)
            hit = close[0] if close else None
            if hit:
                corrected[raw] = hit
        if hit and hit not in matched:
            matched.append(hit)
        elif not hit:
            unknown.append(raw)

    if not matched:
        raise ValueError(
            "None of the supplied symptoms matched the training features. "
            "Call GET /symptoms and use one of the returned symptom names."
        )

    row = {symptom: 0 for symptom in all_symptoms}
    for symptom in matched:
        row[symptom] = 1
    X = pd.DataFrame([[row[s] for s in all_symptoms]], columns=all_symptoms)

    if not isinstance(top_k, int) or top_k < 1:
        raise ValueError("top_k must be a positive integer.")

    used_model, classes, probabilities = _proba(model_name, X)
    order = np.argsort(-probabilities)[:min(top_k, len(probabilities))]
    ranked = [(str(classes[i]), float(probabilities[i])) for i in order]

    note_parts = []
    if len(matched) < 3:
        note_parts.append(
            "Only a few symptoms were supplied; the result may be unreliable."
        )
    if ranked and ranked[0][1] < 0.40:
        note_parts.append(
            "The model's highest score is low. This is not a medical diagnosis."
        )

    return {
        "model": used_model,
        "prediction": ranked[0][0],
        "confidence": round(ranked[0][1], 4),
        "top_predictions": [
            {"disease": disease, "probability": round(probability, 4)}
            for disease, probability in ranked
        ],
        "matched_symptoms": matched,
        "unknown_symptoms": unknown,
        "corrected_symptoms": corrected,
        "note": " ".join(note_parts) if note_parts else None,
        "disclaimer": (
            "For educational use only. Model scores are not clinically validated "
            "and must not be used as a diagnosis."
        ),
    }


if __name__ == "__main__":
    print(json.dumps(predict(["itching", "skin rash"]), indent=2))
