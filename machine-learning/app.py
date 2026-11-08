
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import heart_predict
import heart_train

app = FastAPI(
    title="Heart Disease Prediction API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
def home():
    return {
        "status": True,
        "message": "Heart Disease Prediction API is running."
    }


@app.get("/health")
def health():
    return {
        "status": True,
        "message": "API is working."
    }


@app.post("/heart-predict")
def heart_prediction(request: dict):
    try:
        result = heart_predict.predict_heart_disease(request)
        return result

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc)
        )

    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=500,
            detail=str(exc)
        )

    except Exception:
        import traceback
        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail="Heart prediction failed. Check Python terminal."
        )


@app.post("/heart-train")
def train_heart_model():
    try:
        heart_train.train_all()

        heart_predict._model = None
        heart_predict._metadata = None

        return {
            "status": True,
            "message": "Heart disease model trained successfully."
        }

    except Exception as exc:
        import traceback
        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=str(exc)
        )
