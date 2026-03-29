from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime
from utils.db import reports_collection

router = APIRouter()

class ReportData(BaseModel):
    result: str
    confidence: float
    risk: str

@router.post("/report")
def save_report(data: ReportData):
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    file_name = f"MedGenix_Report_{timestamp}.pdf"
    
    if reports_collection is not None:
        try:
            reports_collection.insert_one({
                "file_name": file_name,
                "result": data.result,
                "confidence": data.confidence,
                "risk": data.risk,
                "created_at": datetime.utcnow()
            })
            return {"success": True, "message": "Saved to DB"}
        except Exception as e:
            return {"success": False, "error": str(e)}
    return {"success": False, "error": "DB not connected"}