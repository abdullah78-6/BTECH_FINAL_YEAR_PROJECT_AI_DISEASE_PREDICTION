
"""
HEART DISEASE PREDICTION

Uses:
    model/heart_model.joblib
    model/heart_meta.json
"""

from pathlib import Path
import json

import joblib
import numpy as np
import pandas as pd


# ==========================================
# PATHS
# ==========================================

BASE_DIR = Path(__file__).resolve().parent

MODEL_DIR = BASE_DIR / "model"

MODEL_PATH = MODEL_DIR / "heart_model.joblib"
META_PATH = MODEL_DIR / "heart_meta.json"


_model = None
_metadata = None


# ==========================================
# LOAD MODEL
# ==========================================

def load_resources():

    global _model, _metadata

    if _model is None:

        if not MODEL_PATH.exists():
            raise FileNotFoundError(
                "Heart model not found. Run: python heart_train.py"
            )

        if not META_PATH.exists():
            raise FileNotFoundError(
                "Heart metadata not found. Run: python heart_train.py"
            )

        _model = joblib.load(MODEL_PATH)

        _metadata = json.loads(
            META_PATH.read_text(encoding="utf-8")
        )

    return _model, _metadata


# ==========================================
# PREDICT HEART DISEASE
# ==========================================

def predict_heart_disease(heart_data):

    model, metadata = load_resources()

    features = metadata["features"]

    if not isinstance(heart_data, dict):
        raise ValueError(
            "Heart input must be a JSON object."
        )

    # Check missing fields.
    missing_fields = [
        feature
        for feature in features
        if feature not in heart_data
        or heart_data[feature] is None
        or heart_data[feature] == ""
    ]

    if missing_fields:
        raise ValueError(
            f"Missing input fields: {missing_fields}"
        )

    # Convert input values to numbers.
    try:
        row = {
            feature: float(heart_data[feature])
            for feature in features
        }

    except (TypeError, ValueError):
        raise ValueError(
            "All heart input fields must be numeric."
        )

    # Validate finite numbers.
    if not all(
        np.isfinite(value)
        for value in row.values()
    ):
        raise ValueError(
            "Input values must be finite numbers."
        )

    # ======================================
    # VALIDATE INPUT
    # ======================================

    if not 1 <= row["age"] <= 120:
        raise ValueError(
            "Age must be between 1 and 120."
        )

    if row["sex"] not in (0, 1):
        raise ValueError(
            "Sex must be 0 or 1."
        )

    if row["chest pain type"] not in (1, 2, 3, 4):
        raise ValueError(
            "Invalid chest pain type."
        )

    if row["resting blood pressure"] <= 0:
        raise ValueError(
            "Resting blood pressure must be positive."
        )

    if row["serum cholestoral"] < 0:
        raise ValueError(
            "Cholesterol cannot be negative."
        )

    # ======================================
    # CREATE INPUT DATAFRAME
    # ======================================

    input_df = pd.DataFrame(
        [row],
        columns=features
    )

    # ======================================
    # MODEL PREDICTION
    # ======================================

    predicted_class = int(
        model.predict(input_df)[0]
    )

    raw_probabilities = model.predict_proba(
        input_df
    )[0]

    # ======================================
    # GET CLASS PERCENTAGES
    # ======================================

    probabilities = {
        "no_heart_disease": 0.0,
        "heart_disease": 0.0
    }

    for class_value, probability in zip(
        model.classes_,
        raw_probabilities
    ):

        class_value = int(class_value)

        percentage = round(
            float(probability) * 100,
            2
        )

        if class_value == 1:
            probabilities["no_heart_disease"] = percentage

        elif class_value == 2:
            probabilities["heart_disease"] = percentage

    # ======================================
    # RESULT
    # ======================================

    class_labels = metadata["class_labels"]

    prediction_label = class_labels[
        str(predicted_class)
    ]

    return {
        "status": True,

        "prediction": prediction_label,

        "predicted_class": predicted_class,

        "probabilities": probabilities,

        "model": metadata["best_model"].replace(
            "_", " "
        ).title(),

        "disclaimer": (
            "Educational machine-learning prediction only. "
            "Percentages are model scores, not confirmed "
            "clinical probabilities or a medical diagnosis. "
            "Consult a qualified healthcare professional."
        )
    }
