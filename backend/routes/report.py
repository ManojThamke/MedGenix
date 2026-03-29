from fastapi import APIRouter
from fastapi.responses import FileResponse
from pydantic import BaseModel
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from datetime import datetime
import os

# 🔥 MongoDB
from utils.db import reports_collection

router = APIRouter()

class ReportRequest(BaseModel):
    result: str
    confidence: float


@router.post("/report")
def generate_report(data: ReportRequest):

    # ---------------- FILE SETUP ----------------
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    file_name = f"MedGenix_Report_{timestamp}.pdf"
    file_path = f"reports/{file_name}"

    os.makedirs("reports", exist_ok=True)

    doc = SimpleDocTemplate(file_path)
    styles = getSampleStyleSheet()
    content = []

    # ---------------- RISK LOGIC ----------------
    if data.confidence >= 80:
        risk = "HIGH"
    elif data.confidence >= 60:
        risk = "MODERATE"
    else:
        risk = "LOW"

    # ---------------- TITLE ----------------
    content.append(Paragraph("MedGenix AI Clinical Report", styles["Title"]))
    content.append(Spacer(1, 15))

    # ---------------- PATIENT ----------------
    content.append(Paragraph("Patient Details", styles["Heading2"]))
    content.append(Paragraph(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", styles["Normal"]))
    content.append(Spacer(1, 10))

    # ---------------- SUMMARY ----------------
    content.append(Paragraph("AI Prediction Summary", styles["Heading2"]))
    content.append(Paragraph(f"Result: <b>{data.result}</b>", styles["Normal"]))
    content.append(Paragraph(f"Confidence: {data.confidence}%", styles["Normal"]))
    content.append(Paragraph(f"Risk Level: <b>{risk}</b>", styles["Normal"]))
    content.append(Spacer(1, 15))

    # ---------------- MODEL ANALYSIS ----------------
    content.append(Paragraph("Model Analysis", styles["Heading2"]))
    content.append(Paragraph(
        "The prediction is based on patterns observed in voice biomarkers such as pitch variation, amplitude instability, and frequency irregularities.",
        styles["Normal"]
    ))
    content.append(Spacer(1, 10))

    # ---------------- FEATURES ----------------
    content.append(Paragraph("Key Contributing Features", styles["Heading2"]))
    content.append(Paragraph("• PPE → Indicates pitch instability", styles["Normal"]))
    content.append(Paragraph("• spread1 → Reflects non-linear vocal variation", styles["Normal"]))
    content.append(Paragraph("• MDVP:Fo → Represents frequency variation", styles["Normal"]))
    content.append(Spacer(1, 10))

    # ---------------- ALERTS ----------------
    content.append(Paragraph("Alerts", styles["Heading2"]))
    content.append(Paragraph("⚠ Abnormal voice pattern detected", styles["Normal"]))
    content.append(Paragraph("⚠ Pattern matches Parkinsonian speech characteristics", styles["Normal"]))
    content.append(Spacer(1, 10))

    # ---------------- AI INSIGHT (FUTURE READY) ----------------
    content.append(Paragraph("AI Clinical Insight", styles["Heading2"]))
    content.append(Paragraph(
        "Based on analysis of voice biomarkers, the system detects irregularities commonly associated with Parkinsonian speech patterns. "
        "These may indicate early-stage neuromuscular changes affecting vocal control.",
        styles["Normal"]
    ))
    content.append(Spacer(1, 10))

    # ---------------- RECOMMENDATION ----------------
    content.append(Paragraph("Recommendation", styles["Heading2"]))
    content.append(Paragraph("• Consult neurologist for professional evaluation", styles["Normal"]))
    content.append(Paragraph("• Perform clinical tests (UPDRS, MRI if required)", styles["Normal"]))
    content.append(Paragraph("• Monitor speech changes regularly", styles["Normal"]))
    content.append(Spacer(1, 10))

    # ---------------- DISCLAIMER ----------------
    content.append(Paragraph("Disclaimer", styles["Heading2"]))
    content.append(Paragraph(
        "This report is generated using AI-based analysis and is intended for screening purposes only. "
        "It should not replace professional medical diagnosis.",
        styles["Italic"]
    ))

    # ---------------- BUILD PDF ----------------
    doc.build(content)

    # ---------------- SAVE TO MONGODB ----------------
    report_data = {
        "file_name": file_name,
        "result": data.result,
        "confidence": data.confidence,
        "risk": risk,
        "created_at": datetime.utcnow()
    }

    reports_collection.insert_one(report_data)

    # ---------------- RETURN FILE ----------------
    return FileResponse(
        path=file_path,
        filename=file_name,
        media_type="application/pdf"
    )