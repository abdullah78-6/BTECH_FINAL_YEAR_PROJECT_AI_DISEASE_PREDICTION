"""
FastAPI endpoints for the supervised symptom-to-disease classification project.

Run from this directory:
    uvicorn app:app --reload --port 8000
API docs:
    http://127.0.0.1:8000/docs
"""
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator

import predict as predictor
import train as trainer

app = FastAPI(title="AI Disease Prediction API", version="3.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


class PredictRequest(BaseModel):
    symptoms: list[str] = Field(min_length=1)
    model_name: Optional[str] = None
    top_k: int = Field(default=3, ge=1, le=20)

    @field_validator("symptoms")
    @classmethod
    def clean_symptoms(cls, values):
        cleaned = [value.strip() for value in values if isinstance(value, str) and value.strip()]
        if not cleaned:
            raise ValueError("Please provide at least one non-empty symptom.")
        return cleaned


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/models")
def list_models():
    metrics = predictor.get_metrics()
    return {
        "available": list(trainer.build_models().keys()) + ["ensemble"],
        "trained": metrics.get("models", {}),
        "best": metrics.get("best"),
    }


@app.get("/symptoms")
def symptoms():
    try:
        return {"symptoms": predictor.get_symptoms()}
    except (FileNotFoundError, RuntimeError) as exc:
        raise HTTPException(status_code=404, detail=str(exc))


@app.post("/predict")
def predict_disease(request: PredictRequest):
    # Log exact received values while debugging frontend-to-API mapping.
    print("[PREDICT API] Received symptoms:", request.symptoms)
    try:
        result = predictor.predict(
            request.symptoms,
            request.model_name,
            request.top_k
        )
        print("[PREDICT API] Matched symptoms:", result["matched_symptoms"])
        return result
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/train/{model_name}")
def train_single(model_name: str):
    try:
        data = trainer.load_data(verbose=True)
        result = trainer.train_one(model_name, data)
        predictor.clear_cache()
        return {"model": model_name, "metrics": result}
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/train-all")
def train_all():
    try:
        metrics = trainer.train_all()
        predictor.clear_cache()
        return metrics
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc))
