from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib import colors
from datetime import datetime

# Create PDF
output_path = "MedGenix_Project_Analysis.pdf"
doc = SimpleDocTemplate(output_path, pagesize=letter, topMargin=0.5*inch, bottomMargin=0.5*inch)

# Styles
styles = getSampleStyleSheet()
title_style = ParagraphStyle(
    'CustomTitle',
    parent=styles['Heading1'],
    fontSize=24,
    textColor=colors.HexColor('#2563eb'),
    spaceAfter=20,
    alignment=1
)

heading_style = ParagraphStyle(
    'CustomHeading',
    parent=styles['Heading2'],
    fontSize=14,
    textColor=colors.HexColor('#1e40af'),
    spaceAfter=12,
    spaceBefore=12
)

body_style = ParagraphStyle(
    'CustomBody',
    parent=styles['Normal'],
    fontSize=11,
    spaceAfter=10
)

# Content
story = []

# Title
story.append(Paragraph("MedGenix Project Analysis", title_style))
story.append(Paragraph("AI-Powered Parkinson's Disease Detection System", styles['Heading3']))
story.append(Spacer(1, 0.2*inch))

# What It Does
story.append(Paragraph("What It Does (Simple Explanation)", heading_style))
story.append(Paragraph(
    "MedGenix is an <b>AI disease detection system</b> that analyzes voice recordings to detect if someone has <b>Parkinson's disease</b>. "
    "It combines machine learning with a web interface to make medical predictions easy and accessible.",
    body_style
))
story.append(Spacer(1, 0.15*inch))

# How It Works
story.append(Paragraph("How It Works", heading_style))
story.append(Paragraph("User Records Voice → System Analyzes → AI Predicts → Generates Report", body_style))
story.append(Spacer(1, 0.1*inch))

process_steps = [
    "<b>1. User Input:</b> Upload voice recording (audio file)",
    "<b>2. Voice Processing:</b> Converts audio to required format, extracts 22 voice characteristics (pitch, volume patterns, etc.)",
    "<b>3. AI Model:</b> Pre-trained Random Forest model analyzes the voice features",
    "<b>4. Prediction:</b> Returns result (Healthy/Parkinson's) + confidence score + risk level",
    "<b>5. Report:</b> Generates professional PDF report saved to database"
]

for step in process_steps:
    story.append(Paragraph("• " + step, body_style))

story.append(Spacer(1, 0.2*inch))

# Key Features
story.append(Paragraph("Key Features", heading_style))

features_data = [
    ["Feature", "What It Does"],
    ["Voice Predict", "Upload audio → Get health prediction"],
    ["Manual Input", "Enter 22 voice measurements directly"],
    ["Risk Assessment", "Classifies risk as HIGH (≥80%), MODERATE (60-79%), or LOW (<60%)"],
    ["Medical Chat", "AI chatbot (Google Gemini) answers health questions"],
    ["PDF Reports", "Professional reports with analysis, stored with timestamps"],
    ["Database", "MongoDB stores all predictions & reports for history"],
    ["Dashboard", "User interface to view predictions and previous results"]
]

table = Table(features_data, colWidths=[1.5*inch, 4*inch])
table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2563eb')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
    ('FONTSIZE', (0, 0), (-1, 0), 11),
    ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
    ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
    ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ('FONTSIZE', (0, 1), (-1, -1), 10),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f0f0f0')])
]))

story.append(table)
story.append(Spacer(1, 0.2*inch))

# Tech Stack
story.append(Paragraph("Tech Stack", heading_style))

tech_items = [
    "<b>Backend:</b> FastAPI (Python) + ML model (scikit-learn)",
    "<b>Frontend:</b> React 19 + TailwindCSS + Vite",
    "<b>Database:</b> MongoDB (stores all reports)",
    "<b>AI Chat:</b> Google Gemini API",
    "<b>Audio Processing:</b> FFmpeg for format conversion",
    "<b>ML Model:</b> Random Forest trained on 40,000+ voice samples with 22 biomarkers"
]

for item in tech_items:
    story.append(Paragraph("• " + item, body_style))

story.append(Spacer(1, 0.2*inch))

# Pages
story.append(Paragraph("Pages in App", heading_style))

pages = [
    "<b>🏠 Home:</b> Welcome page",
    "<b>🔐 Login:</b> User authentication",
    "<b>📊 Dashboard:</b> View predictions & risk analysis",
    "<b>💬 Chat:</b> Talk to AI medical assistant",
    "<b>📄 Reports:</b> Download past reports as PDFs"
]

for page in pages:
    story.append(Paragraph("• " + page, body_style))

story.append(Spacer(1, 0.3*inch))

# Summary
story.append(Paragraph("Summary", heading_style))
story.append(Paragraph(
    "<b>Bottom line:</b> MedGenix is a smart voice analyzer that predicts Parkinson's disease with high accuracy "
    "and stores everything for medical reference. The system combines cutting-edge AI with a user-friendly interface "
    "to make disease detection accessible to everyone.",
    body_style
))

story.append(Spacer(1, 0.2*inch))

# Footer
footer_text = f"Generated on {datetime.now().strftime('%B %d, %Y at %H:%M:%S')}"
story.append(Paragraph(footer_text, ParagraphStyle('Footer', parent=styles['Normal'], fontSize=9, textColor=colors.grey)))

# Build PDF
doc.build(story)
print(f"PDF generated successfully: {output_path}")
