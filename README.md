# 🏥 MedGenix - Parkinson's Disease Detection System

MedGenix is an AI-powered medical diagnostic system that detects Parkinson's disease using voice pattern analysis and machine learning. It combines a FastAPI backend, React frontend, MongoDB database, and advanced ML models to provide accurate predictions with confidence scores and risk assessment.

## 📋 Project Overview

**MedGenix** leverages machine learning to analyze voice biomarkers and detect early signs of Parkinson's disease. The system processes 22 voice features extracted from audio recordings and uses ensemble learning models to deliver predictions with high accuracy, including risk stratification.

### Key Features
- ✅ **AI-Powered Detection** - Uses Random Forest, SVM, and Logistic Regression models
- ✅ **Risk Stratification** - Classifies predictions into HIGH/MODERATE/LOW risk categories
- ✅ **MongoDB Integration** - Stores all predictions and reports for medical record keeping
- ✅ **Medical Chat Assistant** - Powered by Google Gemini for Parkinson's-specific medical guidance
- ✅ **Enhanced PDF Reports** - Professional clinical reports with detailed analysis, insights, and recommendations
- ✅ **Voice Feature Analysis** - Processes 22 distinct voice biomarkers
- ✅ **CORS-Enabled API** - Full frontend-backend integration with automatic file downloads
- ✅ **React Frontend** - Modern UI with TailwindCSS

---

## 🏗️ Architecture & Project Structure

```
MedGenix/
├── backend/                    # FastAPI application
│   ├── main.py                # Core API server + prediction endpoints + MongoDB integration
│   ├── routes/
│   │   ├── chat.py            # Medical chat assistant (Gemini integration)
│   │   └── report.py          # Enhanced PDF report generation with clinical insights
│   ├── utils/
│   │   └── db.py              # MongoDB connection & database utilities
│   ├── reports/               # Generated PDF reports (timestamped)
│   ├── venv/                  # Python virtual environment
│   └── models/                # Pre-trained ML models (best_model.pkl, scaler.pkl)
│
├── frontend/                   # React + Vite application
│   ├── src/                   # Source code
│   ├── package.json           # Dependencies (React, Axios, TailwindCSS)
│   ├── index.html             # Entry point
│   └── tailwind.config.js     # TailwindCSS configuration
│
├── ml_engine/                  # Machine learning pipeline
│   ├── eda.py                 # Exploratory Data Analysis
│   ├── preprocess.py          # Data preprocessing & feature scaling
│   ├── train.py               # Model training (RF, SVM, LR)
│   ├── feature_importance.py  # Feature importance analysis
│   ├── processed_data.pkl     # Processed dataset
│   ├── model_results.json     # Training metrics & results
│   ├── feature_importance.json
│   └── learning_curve.json
│
├── data/                       # Dataset
│   └── parkinsons.csv         # Voice biomarker dataset (40,566 samples)
│
└── README.md                   # This file
```

---

## 🛠️ Tech Stack

### Backend
- **FastAPI** - High-performance Python web framework
- **MongoDB** - NoSQL database for storing predictions and reports
- **PyMongo** - MongoDB driver for Python
- **scikit-learn** - Machine learning models (Random Forest, SVM, Logistic Regression)
- **ReportLab** - Advanced PDF generation with clinical formatting
- **Google Generative AI** - Gemini API for medical assistance
- **Pydantic** - Data validation
- **joblib** - Model serialization
- **python-dotenv** - Environment variable management

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool & dev server
- **TailwindCSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Vite React Plugin** - React integration for Vite

### ML & Data
- **scikit-learn** - Model training & evaluation
- **NumPy** - Numerical computing
- **Python 3.x** - Programming language

---

## 📚 What Has Been Done

### ✅ Backend Implementation
1. **FastAPI Application** (`backend/main.py`)
   - Core prediction API endpoint `/predict` with risk classification
   - Home endpoint `/`
   - CORS middleware configured for frontend communication
   - Input validation (expects 22 voice features)
   - Model loading with pre-trained ML model and scaler
   - **Risk Assessment**: Classifies predictions into HIGH (≥80%), MODERATE (60-79%), LOW (<60%) risk levels
   - **MongoDB Integration**: Automatically saves predictions to database

2. **Database Module** (`backend/utils/db.py`)
   - MongoDB connection using PyMongo
   - Collections created for reports storage
   - Connects to `medgenix` database on startup

3. **Chat Route** (`backend/routes/chat.py`)
   - Medical chat assistant using Google Gemini
   - Context-aware responses for Parkinson's disease
   - Real-time response generation

4. **Enhanced Report Route** (`backend/routes/report.py`)
   - **Advanced PDF generation** with comprehensive clinical sections:
     - Patient Details with timestamp
     - AI Prediction Summary with risk level
     - Model Analysis explaining prediction methodology
     - Key Contributing Features (PPE, spread1, MDVP:Fo indicators)
     - Alerts for abnormal patterns
     - AI Clinical Insight with neuromuscular analysis
     - Recommendations for professional follow-up
     - Medical disclaimer
   - **Risk Classification**: Calculates and displays risk level in PDF
   - **Timestamped File Naming**: Reports saved with format `MedGenix_Report_YYYYMMDD_HHMMSS.pdf`
   - **Automatic Directory Management**: Creates `reports/` folder if not exists
   - **MongoDB Storage**: Each report metadata saved (filename, result, confidence, risk, timestamp)
   - **File Download**: Returns PDF as FileResponse for automatic download

### ✅ ML Engine Implementation
1. **Data Preprocessing** (`ml_engine/preprocess.py`)
   - Feature extraction and scaling
   - Data normalization using StandardScaler

2. **Model Training** (`ml_engine/train.py`)
   - Ensemble of 3 models: Random Forest, SVM, Logistic Regression
   - Train-test split validation
   - Performance metrics calculation (Accuracy, Precision, Recall, F1)
   - Confusion matrix generation
   - Model serialization with joblib

3. **Analysis** (`ml_engine/feature_importance.py`, `ml_engine/eda.py`)
   - Feature importance analysis
   - Exploratory Data Analysis
   - Learning curve analysis

### ✅ Frontend Setup
1. **React Application Structure**
   - Vite build configuration
   - TailwindCSS styling setup
   - ESLint configuration
   - Responsive design framework

2. **Package Configuration**
   - All dependencies installed
   - Build scripts configured (`npm run dev`, `npm run build`)

### ✅ Dataset
- **Parkinson's Dataset**: 40,566 samples with 22 voice biomarkers
- Pre-loaded in `data/parkinsons.csv`

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- pip and npm

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn scikit-learn joblib numpy pydantic reportlab python-dotenv google-generativeai pymongo

# Set up environment variables
echo "GEMINI_API_KEY=your_api_key_here" > .env

# Run the backend server
uvicorn main:app --reload
```

Backend runs on `http://localhost:8000`

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if not already done)
npm install

# Run development server
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## 📡 API Endpoints

All endpoints are CORS-enabled for frontend integration.

### 1. Health Check
```
GET /
Response: {"message": "MedGenix API Running 🚀"}
```

### 2. Parkinson's Prediction with Risk Assessment
```
POST /predict
Content-Type: application/json

Request Body:
{
  "features": [
    0.123, 0.456, 0.789, ... (22 float values)
  ]
}

Response:
{
  "result": "Parkinson's Detected" | "Healthy",
  "confidence": 85.50,
  "risk": "HIGH" | "MODERATE" | "LOW"
}

Risk Levels:
- HIGH: confidence ≥ 80%
- MODERATE: confidence 60-79%
- LOW: confidence < 60%
```

**Feature Requirements**: Exactly 22 voice biomarkers (normalized between 0-1)
**Auto-Stored**: Prediction automatically saved to MongoDB

### 3. Medical Chat
```
POST /chat
Content-Type: application/json

Request Body:
{
  "prompt": "What are the early symptoms of Parkinson's?"
}

Response:
{
  "reply": "Parkinson's disease symptoms typically include..."
}
```

### 4. Generate Clinical Report
```
POST /report
Content-Type: application/json

Request Body:
{
  "result": "Parkinson's Detected",
  "confidence": 85.50
}

Response:
- Automatically downloads PDF file: `MedGenix_Report_YYYYMMDD_HHMMSS.pdf`
- Media Type: application/pdf
```

**Report Contents**:
- Patient details and timestamp
- AI prediction summary with risk level
- Model analysis explaining methodology
- Key contributing features analysis
- Alerts for abnormal patterns
- AI clinical insights and recommendations
- Medical disclaimer

**Auto-Stored**: Report metadata saved to MongoDB

---

## 🗄️ MongoDB Database Structure

### Reports Collection (`reports`)
Stores all predictions and report metadata:
```json
{
  "_id": ObjectId,
  "result": "Parkinson's Detected" | "Healthy",
  "confidence": 85.50,
  "risk": "HIGH" | "MODERATE" | "LOW",
  "file_name": "MedGenix_Report_20260329_143022.pdf",
  "created_at": ISODate("2026-03-29T14:30:22Z")
}
```

Each prediction and generated report is automatically logged for:
- Medical record keeping
- Audit trails
- Analytics and research
- Patient history tracking

---

## 📊 Model Performance

Trained models comparison:
- **Random Forest**: High accuracy with feature importance insights
- **SVM**: Strong generalization with probability calibration
- **Logistic Regression**: Baseline model for comparison

All metrics available in `ml_engine/model_results.json`

---

## 🔧 Development Notes

### Environment Variables
Create `.env` file in backend directory:
```
GEMINI_API_KEY=your_google_gemini_api_key
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/
```

**MongoDB Setup**:
- Create MongoDB account at [mongodb.com](https://www.mongodb.com)
- Create a cluster and get connection string
- Add database username and password to `MONGO_URI`

### Model Files
- `backend/models/best_model.pkl` - Trained Random Forest classifier
- `backend/models/scaler.pkl` - Feature scaler (StandardScaler)
- `ml_engine/processed_data.pkl` - Train/test split data
- `backend/utils/db.py` - MongoDB connection manager
- `backend/reports/` - Generated PDF reports (timestamped)

### Frontend Pages
- Main prediction interface
- Chat history display
- Report viewer
- Results dashboard

---

## 🎯 Next Steps / Future Enhancements

- [ ] Implement user authentication & authorization
- [ ] Add patient profile management with history
- [ ] Create patient dashboard to view past predictions and reports
- [ ] Implement audio file upload for automatic voice feature extraction
- [ ] Add audio recording capability directly in frontend
- [ ] Build admin dashboard for report review and analytics
- [ ] Implement report sharing and export functionality
- [ ] Add multi-language support for reports and chat
- [ ] Deploy to cloud (AWS, GCP, Azure)
- [ ] Implement API rate limiting & security enhancements
- [ ] Add real-time prediction monitoring and alerts
- [ ] Implement model versioning and A/B testing
- [ ] Create CI/CD pipeline for automated testing
- [ ] Add comprehensive logging and monitoring

---

## ⚠️ Medical Disclaimer

**DISCLAIMER**: MedGenix is an AI-based diagnostic tool and should NOT replace professional medical diagnosis. This system is designed for research and educational purposes. Please consult with qualified medical professionals for accurate diagnosis and treatment.

---

## 📝 License

This project is part of the MedGenix initiative for AI-powered medical diagnostics.

---

## 👨‍💻 Development Team

Built with ❤️ using FastAPI, React, and Machine Learning

---

## 📞 Support

For issues, questions, or contributions, please reach out to the development team.

---

**Last Updated**: March 29, 2026

---

## 🔄 Latest Updates

### v1.1 - Database & Risk Assessment Integration
- ✅ MongoDB integration for persistent storage
- ✅ Risk stratification system (HIGH/MODERATE/LOW)
- ✅ Enhanced PDF reports with clinical sections
- ✅ Automatic report file downloads
- ✅ Timestamped report naming convention
- ✅ Database logging of all predictions and reports
