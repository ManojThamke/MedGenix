from fastapi import APIRouter
from pydantic import BaseModel
import google.generativeai as genai
import os
from typing import List
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("CRITICAL: GEMINI_API_KEY is missing from .env file.")
genai.configure(api_key=api_key)

# Use the stable flash model
model = genai.GenerativeModel("gemini-flash-latest")


# ----------------------------------------
# 1. INTERACTIVE CHAT ENDPOINT (Short & Multi-lingual)
# ----------------------------------------
class ChatRequest(BaseModel):
    prompt: str
    language: str = "English"  # Default to English if not provided by the frontend

@router.post("/chat")
def chat_endpoint(data: ChatRequest):
    try:
        # Aggressively constrained prompt for short, formatted, multilingual answers
        medical_context = (
            "You are Dr. MedGenix, an expert neurologist and AI clinical assistant. "
            "You MUST follow these strict rules:\n"
            "1. LENGTH: Keep your answer incredibly short. Maximum 2 to 3 sentences.\n"
            "2. FORMATTING: Use Markdown. Use **bold** for key terms and bullet points if necessary.\n"
            "3. TONE: Professional, simple, empathetic, and easy to understand for a patient.\n"
            f"4. LANGUAGE: You MUST write your entire response strictly in {data.language}.\n\n"
            "Simplify complex acoustic biomarker terms (like Jitter, Shimmer, PPE, MDVP:Fo). "
            "Provide actionable clinical next steps. Always maintain medical disclaimers.\n\n"
            f"Patient Inquiry: {data.prompt}"
        )

        response = model.generate_content(medical_context)

        return {"reply": response.text.strip()}
    except Exception as e:
        print(f"❌ Chat Backend Error: {str(e)}")
        # Returning a clear error message helps debug if it fails again
        return {"reply": f"System Alert: Backend encountered an error. Details: {str(e)}"}


# ----------------------------------------
# 2. AUTO-EXPLAIN ENDPOINT (Dashboard Insight Card)
# ----------------------------------------
class ExplainRequest(BaseModel):
    result: str
    confidence: float
    risk: str
    features: List[float]

@router.post("/explain")
def explain_prediction(data: ExplainRequest):
    try:
        # Strict constraints for the dashboard auto-explanation
        prompt = (
            f"Voice biomarker ML analysis result: {data.result} with {data.confidence}% confidence, "
            f"{data.risk} risk. Explain in 2-3 plain, simple sentences what this means for the patient. "
            f"Keep it under 80 words. End with one clear clinical recommendation. "
            f"Use **bold** text for emphasis."
        )

        response = model.generate_content(prompt)
        
        return {"explanation": response.text.strip()}
    
    except Exception as e:
        print(f"❌ Explain Backend Error: {str(e)}")
        # Fallback text in case the API rate limits or fails
        return {"explanation": "Analysis complete. Please consult a neurologist for a detailed clinical interpretation."}