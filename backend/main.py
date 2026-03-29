from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
from typing import List
import pandas as pd
import os

# 🔥 FORCE SYSTEM PATH (THIS IS THE REAL FIX)
os.environ["PATH"] += os.pathsep + r"C:\Users\Manoj\Downloads\ffmpeg-2026-03-26-git-fd9f1e9c52-essentials_build\bin"

# -------------------------------
# 🔥 FIX FFMPEG (FINAL)
# -------------------------------
from pydub import AudioSegment

FFMPEG_PATH = r"C:\Users\Manoj\Downloads\ffmpeg-2026-03-26-git-fd9f1e9c52-essentials_build\bin\ffmpeg.exe"
FFPROBE_PATH = r"C:\Users\Manoj\Downloads\ffmpeg-2026-03-26-git-fd9f1e9c52-essentials_build\bin\ffprobe.exe"

AudioSegment.converter = FFMPEG_PATH
AudioSegment.ffmpeg = FFMPEG_PATH
AudioSegment.ffprobe = FFPROBE_PATH

# -------------------------------
# Routers
# -------------------------------
from routes.chat import router as chat_router
from routes.report import router as report_router
from routes.auth import router as auth_router

# DB
from utils.db import reports_collection

# Voice features
from utils.voice_features import extract_features

app = FastAPI()
app.include_router(auth_router)

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

# Routers
app.include_router(chat_router)
app.include_router(report_router)

# -------------------------------
# Load Model
# -------------------------------
model = joblib.load("models/best_model.pkl")
scaler = joblib.load("models/scaler.pkl")
feature_names = joblib.load("models/feature_names.pkl")

# -------------------------------
# Schema
# -------------------------------
class InputData(BaseModel):
    features: List[float] = Field(...)

# -------------------------------
# Root
# -------------------------------
@app.get("/")
def home():
    return {"message": "MedGenix API Running 🚀"}

# -------------------------------
# COMMON PREDICTION
# -------------------------------
def run_prediction(features):
    df = pd.DataFrame([features], columns=feature_names)
    scaled = scaler.transform(df)

    pred = model.predict(scaled)[0]
    probs = model.predict_proba(scaled)[0]

    confidence = round(float(probs[1]) * 100, 2)
    result = "Parkinson's Detected" if pred == 1 else "Healthy"

    if confidence >= 80:
        risk = "HIGH"
    elif confidence >= 60:
        risk = "MODERATE"
    else:
        risk = "LOW"

    return {
        "success": True,
        "result": result,
        "confidence": confidence,
        "risk": risk,
        "features": features # 🔥 CRITICAL ADDITION: Send features back for Gemini to use!
    }

# -------------------------------
# MANUAL PREDICT
# -------------------------------
@app.post("/predict")
def predict(data: InputData):
    return run_prediction(data.features)

# -------------------------------
# 🎤 VOICE PREDICT (FINAL FIXED)
# -------------------------------
@app.post("/voice-predict")
async def voice_predict(file: UploadFile = File(...)):
    try:
        input_path = "temp_input.webm"
        output_path = "converted.wav"

        # Save uploaded file
        with open(input_path, "wb") as f:
            f.write(await file.read())

        print("✅ Saved file:", os.path.exists(input_path))
        print("FFmpeg:", AudioSegment.ffmpeg)
        print("FFprobe:", AudioSegment.ffprobe)

        # 🔥 Convert webm → wav
        audio = AudioSegment.from_file(input_path, format="webm")
        audio.export(output_path, format="wav")

        print("✅ Converted file:", os.path.exists(output_path))

        # Extract features
        features = extract_features(output_path)

        # Cleanup
        if os.path.exists(input_path):
            os.remove(input_path)
        if os.path.exists(output_path):
            os.remove(output_path)

        return run_prediction(features)

    except Exception as e:
        print("❌ VOICE ERROR:", e)
        return {"success": False, "error": str(e)}