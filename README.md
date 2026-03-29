# 🏥 MedGenix - Parkinson's Disease Detection System

MedGenix is an AI-powered medical diagnostic system that detects Parkinson's disease using voice pattern analysis and machine learning. It combines a FastAPI backend, React frontend, MongoDB database, and advanced ML models to provide accurate predictions with confidence scores and risk assessment.

## 📋 Project Overview

**MedGenix** leverages machine learning to analyze voice biomarkers and detect early signs of Parkinson's disease. The system processes 22 voice features extracted from audio recordings and uses ensemble learning models to deliver predictions with high accuracy, including risk stratification.

### Key Features
- ✅ **AI-Powered Detection** - Ensemble of Random Forest, SVM, and Logistic Regression models for accurate predictions
- ✅ **Voice Feature Analysis** - Analyzes 22 distinct voice biomarkers including:
  - **MDVP Measurements**: Fundamental frequency (Fo) and variation (Fhi, Flo)
  - **Jitter & Shimmer**: Voice perturbation indicators (absolute, relative, PPE)
  - **Noise Ratios**: NHR, HNR - Voice quality metrics
  - **Dysdiadochokinesia**: Speed of repetitive movements (spread1, spread2)
  - **Phonatory Tremor**: DFA - Voice stability analysis
- ✅ **Risk Stratification** - Automatic classification into HIGH (≥80%), MODERATE (60-79%), LOW (<60%) risk categories
- ✅ **MongoDB Integration** - Persistent storage of all predictions and reports for medical record keeping
- ✅ **Medical Chat Assistant** - Powered by Google Gemini for context-aware Parkinson's medical guidance
- ✅ **Enhanced PDF Reports** - Professional clinical reports with:
  - Patient details and timestamps
  - AI prediction summary with risk level
  - Model analysis and methodology
  - Key contributing features identification
  - Abnormal pattern alerts
  - AI clinical insights and recommendations
  - Medical disclaimer
- ✅ **CORS-Enabled API** - Full frontend-backend integration with automatic file downloads
- ✅ **React Frontend** - Modern responsive UI with TailwindCSS styling
- ✅ **Data Persistence** - Automatic logging of all predictions with metadata and timestamps

---

## 🔄 How It Works

MedGenix follows a straightforward end-to-end pipeline that takes voice biomarker data from the user and delivers an AI-powered Parkinson's disease risk assessment.

### Step-by-Step Workflow

```
User Input (22 Voice Features)
        │
        ▼
┌───────────────────┐
│  React Frontend   │  ← User enters/uploads voice feature values
│  (localhost:5173) │
└────────┬──────────┘
         │  HTTP POST /predict (JSON payload)
         ▼
┌───────────────────┐
│  FastAPI Backend  │  ← Validates input (expects exactly 22 features)
│  (localhost:8000) │     Scales features using pre-trained StandardScaler
└────────┬──────────┘     Runs Ensemble ML Model (RF + SVM + LR)
         │                Computes confidence score & risk level
         ▼
┌───────────────────┐
│  ML Ensemble      │  ← Random Forest + SVM + Logistic Regression
│  (best_model.pkl) │     Majority voting for final prediction
└────────┬──────────┘
         │  Prediction + Confidence + Risk Level
         ▼
┌───────────────────┐
│  MongoDB Database │  ← Auto-saves prediction record with timestamp
│  (medgenix)       │
└────────┬──────────┘
         │  JSON Response
         ▼
┌───────────────────┐
│  React Frontend   │  ← Displays result card with risk badge
│  Result Display   │     Offers PDF report download & chat options
└───────────────────┘
```

### Detailed Stages

#### 1. 🎙️ Voice Feature Input
The user opens the **Dashboard** page and enters 22 numerical voice biomarkers (measured from a patient's speech recording). These include:
- Fundamental frequency measures (MDVP:Fo, Fhi, Flo)
- Jitter/Shimmer perturbation ratios (voice instability indicators)
- Noise ratios (NHR, HNR) and nonlinear dynamics (RPDE, DFA, PPE)

#### 2. 🌐 API Request
The React frontend (`services/api.jsx`) sends the 22 features as a JSON array to the FastAPI backend at `POST /predict`.

#### 3. ⚙️ Backend Processing (`backend/main.py`)
- **Input validation**: Confirms exactly 22 features are received
- **Feature scaling**: Applies the pre-trained `StandardScaler` (`scaler.pkl`) to normalize values
- **ML Inference**: Passes scaled features through the ensemble model (`best_model.pkl`) for prediction
- **Risk classification**:
  - `confidence ≥ 80%` → **HIGH** risk
  - `60% ≤ confidence < 80%` → **MODERATE** risk
  - `confidence < 60%` → **LOW** risk

#### 4. 🤖 Machine Learning Ensemble (`ml_engine/`)
Three models were trained on the Parkinson's voice dataset and combined:
- **Random Forest** – High accuracy, provides feature importance
- **Support Vector Machine (SVM)** – Strong generalization
- **Logistic Regression** – Probabilistic baseline

The best-performing ensemble is saved as `backend/models/best_model.pkl`.

#### 5. 🗄️ Data Persistence (`backend/utils/db.py`)
Every prediction is automatically stored in MongoDB with:
- Prediction result, confidence score, and risk level
- Timestamp for audit trail and history tracking

#### 6. 📄 Report Generation (`backend/routes/report.py`)
Optionally, the user can request a clinical PDF report. The backend generates a timestamped PDF (`MedGenix_Report_YYYYMMDD_HHMMSS.pdf`) containing:
- Prediction summary with risk badge
- Voice feature analysis and key contributing indicators
- AI-generated clinical insights (via Gemini)
- Professional recommendations and medical disclaimer

#### 7. 💬 Medical Chat Assistant (`backend/routes/chat.py`)
The **Chat** page connects to Google Gemini API to answer medical questions about Parkinson's disease in real time, complementing the automated prediction with expert knowledge.

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
- npm and pip
- Git
- MongoDB account (Cloud or Local)
- Google Gemini API key

### System Dependencies

**Windows:**
```bash
# Install Python 3.8+
# Download from https://www.python.org/downloads/

# Install Node.js 16+
# Download from https://nodejs.org/

# Git
# Download from https://git-scm.com/
```

**macOS:**
```bash
# Using Homebrew
brew install python@3.9
brew install node
brew install git
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install python3 python3-pip
sudo apt-get install nodejs npm
sudo apt-get install git
```

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies using requirements.txt
pip install -r requirements.txt

# Or manually install (if requirements.txt not available)
pip install fastapi uvicorn scikit-learn joblib numpy pydantic reportlab python-dotenv google-generativeai pymongo

# Set up environment variables
# Create .env file in backend directory with:
# GEMINI_API_KEY=your_google_gemini_api_key
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/medgenix

# Run the backend server
uvicorn main:app --reload
```

Backend runs on `http://localhost:8000`
API documentation available at `http://localhost:8000/docs`

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

### 3. MongoDB Setup

**Option A: Cloud (MongoDB Atlas)**
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Create database user with username and password
4. Add your IP address to whitelist
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/`
6. Add `medgenix` database name to connection string in `.env`

**Option B: Local MongoDB**
1. Install MongoDB from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/medgenix`

### 4. Google Gemini API Setup

1. Visit [Google AI Studio](https://ai.google.dev/tutorials/python_quickstart)
2. Click "Get API Key" and create a new API key
3. Add to `.env`: `GEMINI_API_KEY=your_api_key_here`

---

## 🎯 Detailed Features

### 1. **Prediction Engine with Risk Assessment**
- Analyzes 22 voice biomarkers extracted from speech
- Returns 3 outputs: prediction result, confidence score, and risk level
- Automatic risk classification based on confidence percentages
- High accuracy ensemble model approach
- Real-time predictions with instant results

### 2. **MongoDB Data Persistence**
- Every prediction is automatically saved to MongoDB
- Tracks: prediction result, confidence, risk level, timestamp, filename
- Enables patient history tracking and audit trails
- Supports analytics and research queries
- Secure medical record keeping infrastructure

### 3. **Clinical Report Generation**
- Generates professional PDF reports with timestamp
- Includes comprehensive clinical analysis sections:
  - Patient information and timestamp
  - Prediction results with risk classification
  - Detailed model methodology explanation
  - Key contributing voice features analysis
  - Clinical alerts for abnormal patterns
  - AI-generated clinical insights
  - Professional recommendations for follow-up
  - Medical legal disclaimer
- Automatic PDF download to user device
- Reports auto-saved to MongoDB and local `reports/` folder

### 4. **Medical Chat Assistant**
- Powered by Google Gemini large language model
- Context-aware responses about Parkinson's disease
- Supports medical questions and patient education
- Real-time response streaming
- Trained to provide accurate medical information
- Complements automated predictions with expert knowledge

### 5. **Full-Stack Integration**
- **Backend**: FastAPI with high-performance async support
- **Frontend**: React 19 with modern component architecture
- **Database**: MongoDB with cloud and local support
- **ML Models**: Ensemble approach with model comparison metrics
- **CORS**: Complete frontend-backend integration
- **Scalability**: Designed for production deployment

### 6. **Voice Feature Analysis Details**
The 22 voice biomarkers analyzed:
1. **MDVP:Fo(Hz)** - Average fundamental frequency
2. **MDVP:Fhi(Hz)** - Maximum fundamental frequency
3. **MDVP:Flo(Hz)** - Minimum fundamental frequency
4. **MDVP:Jitter(%)** - Jitter percentage
5. **MDVP:Jitter(Abs)** - Absolute jitter
6. **MDVP:RAP** - Relative amplitude perturbation
7. **MDVP:PPQ** - Pitch period perturbation quotient
8. **Jitter:DDP** - Differential jitter
9. **MDVP:Shimmer** - Shimmer percentage
10. **MDVP:Shimmer(dB)** - Shimmer in decibels
11. **Shimmer:APQ3** - 3-point amplitude perturbation quotient
12. **Shimmer:APQ5** - 5-point amplitude perturbation quotient
13. **MDVP:APQ** - Amplitude perturbation quotient
14. **Shimmer:DDA** - Differential shimmer
15. **NHR** - Noise-to-harmonics ratio
16. **HNR** - Harmonics-to-noise ratio
17. **RPDE** - Recurrence period density entropy
18. **DFA** - Detrended fluctuation analysis
19. **spread1** - Phonatory tremor
20. **spread2** - Phonatory tremor variation
21. **PPE** - Pitch period entropy
22. **status** - Target variable (Parkinson's disease status)

---

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

### Error Responses

All API endpoints return appropriate HTTP status codes:

```json
{
  "error": "Error message",
  "detail": "Detailed error description"
}
```

**Common HTTP Status Codes:**
- `200 OK` - Request successful
- `400 Bad Request` - Invalid input (e.g., incorrect number of features)
- `422 Unprocessable Entity` - Validation error
- `500 Internal Server Error` - Server error or database connection issue

**Example Error Response:**
```json
{
  "detail": "Expected 22 features, but received 20"
}
```

---

## 📋 API Reference Summary

| Endpoint | Method | Purpose | Input | Output |
|----------|--------|---------|-------|--------|
| `/` | GET | Health check | - | `{message: "Running"}` |
| `/predict` | POST | Parkinson's prediction | 22 voice features | `{result, confidence, risk}` |
| `/chat` | POST | Medical assistance | Medical prompt | AI response text |
| `/report` | POST | PDF report generation | Prediction data | Binary PDF file |
| `/docs` | GET | API documentation | - | Interactive Swagger UI |

### Prediction Response Codes
```
Confidence >= 80%  → Risk: HIGH     (Likely Parkinson's)
Confidence 60-79%  → Risk: MODERATE (Possible symptoms)
Confidence < 60%   → Risk: LOW      (Unlikely Parkinson's)
```

---

## 🐳 Docker Deployment (Optional)

**Backend Dockerfile** (create `backend/Dockerfile`):
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Frontend Dockerfile** (create `frontend/Dockerfile`):
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "dev"]
```

**Docker Compose** (create `docker-compose.yml` in root):
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - MONGO_URI=${MONGO_URI}
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"

  mongodb:
    image: mongo:5
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

**Run with Docker:**
```bash
# Set environment variables
export GEMINI_API_KEY=your_key
export MONGO_URI=mongodb://mongodb:27017/medgenix

# Build and run
docker-compose up
```

---

## 📈 Performance Optimization Tips

### Backend Optimization
- Use `uvicorn` with multiple workers: `uvicorn main:app --workers 4`
- Enable `--host 0.0.0.0` for network access
- Use connection pooling for MongoDB
- Cache model predictions for identical inputs
- Implement rate limiting for API endpoints

### Frontend Optimization
- Build for production: `npm run build`
- Use code splitting for large components
- Lazy load components as needed
- Optimize images and assets
- Enable gzip compression

### Database Optimization
- Index frequently queried fields in MongoDB
- Archive old reports periodically
- Monitor database size and growth
- Use aggregation pipelines for complex queries

---

Trained models comparison:
- **Random Forest**: High accuracy with feature importance insights
- **SVM**: Strong generalization with probability calibration
- **Logistic Regression**: Baseline model for comparison

All metrics available in `ml_engine/model_results.json`

---

## ⚙️ Environment Configuration

### Backend `.env` File Setup

Create a `.env` file in the `backend/` directory with:

```
# Google Gemini AI Configuration
GEMINI_API_KEY=your_actual_api_key_from_google_ai_studio

# MongoDB Configuration
# For MongoDB Atlas (Cloud):
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/medgenix?retryWrites=true&w=majority

# Or for local MongoDB:
# MONGO_URI=mongodb://localhost:27017/medgenix

# Optional: Debug mode
DEBUG=false
```

### Environment Variable Details

| Variable | Description | Example |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Google Generative AI API key from AI Studio | `AIzaSy...` |
| `MONGO_URI` | MongoDB connection string with database name | `mongodb+srv://user:pass@cluster.mongodb.net/medgenix` |
| `DEBUG` | Enable debug logging (optional) | `true` or `false` |

### Getting Required API Keys

**Google Gemini API Key:**
1. Visit [ai.google.dev](https://ai.google.dev)
2. Click "Get API Key" in the top right
3. Select "Create API key in new project"
4. Copy the API key provided
5. Add to `.env` as `GEMINI_API_KEY`

**MongoDB Connection String:**
1. Create account at [mongodb.com](https://www.mongodb.com)
2. Create a cluster in MongoDB Atlas
3. Click "Connect" → "Drivers"
4. Copy connection string (Username and password will be added automatically if using managed credentials)
5. Add database name: `/medgenix` before query parameters
6. Add to `.env` as `MONGO_URI`

---

## 🐛 Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```bash
# Use a different port
uvicorn main:app --reload --port 8001
```

**MongoDB connection failed:**
- Verify `MONGO_URI` is correct in `.env`
- Check MongoDB server is running (for local)
- Verify database credentials (for cloud)
- Check IP whitelist in MongoDB Atlas (for cloud)

**Gemini API error:**
- Verify `GEMINI_API_KEY` is correct
- Check quota and billing in Google AI Studio
- Ensure API is enabled in Google Cloud Console

### Frontend Issues

**Port 5173 already in use:**
```bash
cd frontend
npm run dev -- --port 5174
```

**Module not found errors:**
```bash
cd frontend
rm -rf node_modules
npm install
```

**CORS errors:**
- Ensure backend is running on `http://localhost:8000`
- Verify CORS is enabled in `backend/main.py`
- Check frontend API base URL matches backend URL

### General Issues

**Python dependencies not installing:**
```bash
# Upgrade pip
python -m pip install --upgrade pip
# Retry installation
pip install -r requirements.txt
```

**Models not loading:**
- Ensure `backend/models/best_model.pkl` exists
- Ensure `backend/models/scaler.pkl` exists
- Check file permissions are readable

---

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

## ✅ Testing & Validation

### Manual Testing

**Test Prediction Endpoint:**
```bash
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "features": [119.99, 157.302, 74.997, 0.00784, 0.00007, 0.00019, 0.00025, 0.00058, 0.021, 0.16, 0.00131, 0.00161, 0.00168, 0.00361, 0.036, 22.2, 0.00386, 0.653, 1.351, 0.02, 0.075, 0.3]
  }'
```

**Test Chat Endpoint:**
```bash
curl -X POST "http://localhost:8000/chat" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "What are early symptoms of Parkinson disease?"}'
```

**Test Report Generation:**
```bash
curl -X POST "http://localhost:8000/report" \
  -H "Content-Type: application/json" \
  -d '{"result": "Parkinsons Detected", "confidence": 85.5}' \
  --output report.pdf
```

### Automated Testing

Create `backend/test_api.py`:
```python
import requests
import json

BASE_URL = "http://localhost:8000"

# Test health check
def test_health():
    response = requests.get(f"{BASE_URL}/")
    assert response.status_code == 200
    print("✓ Health check passed")

# Test prediction
def test_prediction():
    features = [119.99] * 22  # 22 dummy features
    response = requests.post(
        f"{BASE_URL}/predict",
        json={"features": features}
    )
    assert response.status_code == 200
    data = response.json()
    assert "result" in data
    assert "confidence" in data
    assert "risk" in data
    print("✓ Prediction test passed")

# Run tests
if __name__ == "__main__":
    test_health()
    test_prediction()
    print("\nAll tests passed! 🎉")
```

**Run tests:**
```bash
cd backend
python test_api.py
```

---

## 🚢 Production Deployment

### AWS Deployment

1. **EC2 Setup:**
   - Launch Ubuntu 22.04 instance
   - Security group: Allow ports 22, 80, 443, 8000, 5173

2. **Install Dependencies:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install python3-pip nodejs npm -y
   ```

3. **Deploy Backend:**
   ```bash
   cd /var/www/medgenix/backend
   pip install -r requirements.txt
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

4. **Deploy Frontend:**
   ```bash
   cd /var/www/medgenix/frontend
   npm install && npm run build
   ```

### Google Cloud Deployment

1. **Create Cloud Run Service:**
   ```bash
   gcloud run deploy medgenix-backend \
     --source . \
     --platform managed \
     --region us-central1
   ```

2. **Set Environment Variables:**
   ```bash
   gcloud run services update medgenix-backend \
     --set-env-vars GEMINI_API_KEY=your_key,MONGO_URI=your_uri
   ```

### Heroku Deployment

1. **Create `Procfile` in backend:**
   ```
   web: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

2. **Deploy:**
   ```bash
   heroku create medgenix
   git push heroku main
   ```

---

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

**Last Updated**: March 30, 2026

---

## 🔄 Version History & Changelog

### v1.1 - Database & Risk Assessment Integration (Current)
- ✅ MongoDB integration for persistent storage
- ✅ Risk stratification system (HIGH/MODERATE/LOW)
- ✅ Enhanced PDF reports with clinical sections
- ✅ Automatic report file downloads
- ✅ Timestamped report naming convention
- ✅ Database logging of all predictions and reports
- ✅ Enhanced README with comprehensive setup and deployment guides

### v1.0 - Initial Release
- ✅ FastAPI backend with prediction endpoint
- ✅ React frontend with TailwindCSS
- ✅ ML models (Random Forest, SVM, Logistic Regression)
- ✅ Medical chat assistant with Gemini AI
- ✅ CORS-enabled API integration

---

## 🤝 Contributing

We welcome contributions! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Code Style:**
- Backend: Follow PEP 8 Python style guide
- Frontend: Use ESLint configuration
- Commit messages: Clear and descriptive

---

## 📚 Documentation

- **API Docs**: Available at `http://localhost:8000/docs` (when backend running)
- **Dataset**: 40,566 Parkinson's voice samples with 22 biomarkers
- **Models**: Pre-trained and serialized in `backend/models/`
- **Feature**: Complete voice biomarker analysis

---

## 🐛 Reporting Issues

Found a bug? Have a feature request?

1. Check existing issues first
2. Create a detailed issue with:
   - Error message or unexpected behavior
   - Steps to reproduce
   - Expected vs actual results
   - Your environment (OS, Python version, etc.)

---
