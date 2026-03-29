from fastapi import APIRouter, Depends
from pydantic import BaseModel
from datetime import datetime
from utils.db import reports_collection
from routes.auth import get_current_user # Import the JWT verification function

router = APIRouter()

# ---------------- MODELS ----------------
class ReportData(BaseModel):
    result: str
    confidence: float
    risk: str
    method: str = "manual" # Default to manual if not provided, can also be "voice"

# ---------------- SAVE REPORT (SECURED) ----------------
@router.post("/report")
def save_report(data: ReportData, user_email: str = Depends(get_current_user)):
    """
    Saves a generated clinical report to MongoDB, 
    securely tied to the logged-in user's email.
    """
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    file_name = f"MedGenix_Report_{timestamp}.pdf"
    
    if reports_collection is not None:
        try:
            reports_collection.insert_one({
                "user_email": user_email, # Link report to the authenticated user
                "file_name": file_name,
                "result": data.result,
                "confidence": data.confidence,
                "risk": data.risk,
                "method": data.method, # Track if it was voice or manual
                "created_at": datetime.utcnow()
            })
            return {"success": True, "message": "Report saved to user profile"}
        except Exception as e:
            return {"success": False, "error": str(e)}
            
    return {"success": False, "error": "Database connection failed"}

# ---------------- GET USER KPI STATS (SECURED) ----------------
@router.get("/stats")
def get_user_stats(user_email: str = Depends(get_current_user)):
    """
    Fetches real-time dashboard statistics dynamically calculated 
    from the logged-in user's personal report history.
    """
    if reports_collection is None:
        # Failsafe if DB is down
        return {
            "total_predictions": 0, 
            "accuracy": 95.2, 
            "high_risk": 0, 
            "reports_generated": 0
        }
        
    try:
        # Count total predictions made by this specific user
        total_predictions = reports_collection.count_documents({"user_email": user_email})
        
        # Count high risk cases found by this user
        high_risk_cases = reports_collection.count_documents({
            "user_email": user_email, 
            "risk": "HIGH"
        })
        
        # Model Accuracy is a static representation of the Random Forest baseline
        model_accuracy = 95.2 

        return {
            "total_predictions": total_predictions,
            "accuracy": model_accuracy,
            "high_risk": high_risk_cases,
            "reports_generated": total_predictions # 1:1 ratio for generated PDFs
        }
    except Exception as e:
        print(f"DB Stat Fetch Error for {user_email}: {e}")
        return {
            "total_predictions": 0, 
            "accuracy": 95.2, 
            "high_risk": 0, 
            "reports_generated": 0
        }

# ---------------- GET FULL HISTORY (SECURED) ----------------
@router.get("/history")
def get_report_history(user_email: str = Depends(get_current_user)):
    """
    Fetches the full report history for the logged-in user to display on the Reports page.
    """
    if reports_collection is None:
        return []
        
    try:
        # Query MongoDB: match user, sort by 'created_at' descending (-1)
        cursor = reports_collection.find({"user_email": user_email}).sort("created_at", -1)
        
        reports_list = []
        for doc in cursor:
            # Safely parse the result string
            raw_result = doc.get("result", "")
            normalized_result = "detected" if "Detected" in raw_result else "healthy"
            
            reports_list.append({
                "id": str(doc["_id"])[-6:].upper(), # Use last 6 chars of Mongo ID as display ID
                "date": doc["created_at"].strftime("%Y-%m-%d"),
                "time": doc["created_at"].strftime("%H:%M"),
                "result": normalized_result,
                "conf": doc.get("confidence", 0),
                "risk": doc.get("risk", "LOW").lower(),
                "method": doc.get("method", "manual"), # Default to manual if not set
                "file": doc.get("file_name", "Unknown.pdf"),
                
                # We need the raw data to send to the Chat Assistant
                "_raw": {
                    "result": raw_result,
                    "confidence": doc.get("confidence", 0),
                    "risk": doc.get("risk", "LOW")
                }
            })
            
        return reports_list
    except Exception as e:
        print(f"DB History Fetch Error: {e}")
        return []