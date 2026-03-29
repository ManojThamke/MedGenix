from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
from typing import List
from datetime import datetime

# Routers
from routes.chat import router as chat_router
from routes.report import router as report_router

# DB
from utils.db import reports_collection

app = FastAPI()

# -------------------------------
# CORS
# -------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# Routers
# -------------------------------
app.include_router(chat_router)
app.include_router(report_router)

# -------------------------------
# Load ML Model
# -------------------------------
model = joblib.load("models/best_model.pkl")
scaler = joblib.load("models/scaler.pkl")

# -------------------------------
# Schema
# -------------------------------
class InputData(BaseModel):
    features: List[float]

# -------------------------------
# Routes
# -------------------------------
@app.get("/")
def home():
    return {"message": "MedGenix API Running 🚀"}

@app.post("/predict")
def predict(data: InputData):
    try:
        features = np.array(data.features).reshape(1, -1)

        if len(data.features) != 22:
            return {"error": "Exactly 22 features required"}

        features = scaler.transform(features)

        prediction = model.predict(features)[0]
        prob = model.predict_proba(features)[0][1]

        result = "Parkinson's Detected" if prediction == 1 else "Healthy"
        confidence = round(prob * 100, 2)

        # 🔥 Risk logic
        if confidence >= 80:
            risk = "HIGH"
        elif confidence >= 60:
            risk = "MODERATE"
        else:
            risk = "LOW"

        # 🔥 Save prediction in MongoDB
        reports_collection.insert_one({
            "result": result,
            "confidence": confidence,
            "risk": risk,
            "created_at": datetime.utcnow()
        })

        return {
            "result": result,
            "confidence": confidence,
            "risk": risk
        }

    except Exception as e:
        return {"error": str(e)}