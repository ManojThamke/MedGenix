from fastapi import APIRouter
import google.generativeai as genai
import os
from dotenv import load_dotenv
from pydantic import BaseModel

# Load env
load_dotenv()

router = APIRouter()

# Get API key
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

model = genai.GenerativeModel("gemini-flash-latest")

# Request schema
class ChatRequest(BaseModel):
    prompt: str

@router.post("/chat")
def chat(data: ChatRequest):
    try:
        response = model.generate_content(
    f"You are a medical assistant. Answer in context of Parkinson's disease.\nUser: {data.prompt}"
)
        return {"reply": response.text}
    except Exception as e:
        return {"error": str(e)}