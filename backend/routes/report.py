from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from datetime import datetime
from io import BytesIO

from utils.db import reports_collection

router = APIRouter()

class ReportRequest(BaseModel):
    result: str
    confidence: float
    risk: str = None


@router.post("/report")
def generate_report(data: ReportRequest):
    try:
        buffer = BytesIO()

        doc = SimpleDocTemplate(buffer)
        styles = getSampleStyleSheet()
        content = []

        # Risk logic
        if data.risk:
            risk = data.risk
        else:
            if data.confidence >= 80:
                risk = "HIGH"
            elif data.confidence >= 60:
                risk = "MODERATE"
            else:
                risk = "LOW"

        # Content
        content.append(Paragraph("MedGenix AI Clinical Report", styles["Title"]))
        content.append(Spacer(1, 15))

        content.append(Paragraph("Patient Details", styles["Heading2"]))
        content.append(Paragraph(
            f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            styles["Normal"]
        ))
        content.append(Spacer(1, 10))

        content.append(Paragraph("AI Prediction Summary", styles["Heading2"]))
        content.append(Paragraph(f"Result: <b>{data.result}</b>", styles["Normal"]))
        content.append(Paragraph(f"Confidence: {data.confidence}%", styles["Normal"]))
        content.append(Paragraph(f"Risk Level: <b>{risk}</b>", styles["Normal"]))
        content.append(Spacer(1, 15))

        content.append(Paragraph("Model Analysis", styles["Heading2"]))
        content.append(Paragraph(
            "The prediction is based on voice biomarkers like pitch variation and instability.",
            styles["Normal"]
        ))

        # Build PDF
        doc.build(content)
        buffer.seek(0)

        # ✅ FIXED MongoDB check
        if reports_collection is not None:
            try:
                reports_collection.insert_one({
                    "result": data.result,
                    "confidence": data.confidence,
                    "risk": risk,
                    "created_at": datetime.utcnow()
                })
            except Exception as db_error:
                print("⚠ DB Insert Failed:", db_error)

        return StreamingResponse(
            buffer,
            media_type="application/pdf",
            headers={
                "Content-Disposition": "attachment; filename=MedGenix_Report.pdf"
            }
        )

    except Exception as e:
        print("❌ REPORT ERROR:", e)
        return {"error": str(e)}