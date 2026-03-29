from fastapi import APIRouter
from pydantic import BaseModel
import google.generativeai as genai
import os
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

class ChatRequest(BaseModel):
    prompt: str

@router.post("/chat")
def chat_endpoint(data: ChatRequest):
    try:
        # Manually inject the Medical Persona context into every prompt
        # This is more robust than relying on system_instruction if SDK versions vary
        medical_context = (
            "You are Dr. MedGenix, an expert neurologist and AI clinical assistant. "
            "Your role is to explain Parkinson's disease screening reports to patients "
            "in a clear, highly professional, and empathetic manner. "
            "Simplify complex acoustic biomarker terms (like Jitter, Shimmer, PPE, MDVP:Fo). "
            "Provide actionable clinical next steps. Always maintain medical disclaimers. "
            "Use markdown formatting (bolding, bullet points) for readability.\n\n"
            f"Patient Inquiry: {data.prompt}"
        )

        response = model.generate_content(medical_context)

        return {"reply": response.text}
    except Exception as e:
        print(f"❌ Chat Backend Error: {str(e)}")
        # Returning a clear error message helps debug if it fails again
        return {"reply": f"System Alert: Backend encountered an error. Details: {str(e)}"}