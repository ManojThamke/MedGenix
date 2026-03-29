import axios from "axios";

// -------------------------------
// BASE URL
// -------------------------------
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
});

// -------------------------------
// PREDICT (Manual)
// -------------------------------
export const predict = async (features) => {
  try {
    const response = await API.post("/predict", { features });
    return response.data;
  } catch (error) {
    console.error("Predict API Error:", error);
    return { error: "Prediction failed" };
  }
};

// -------------------------------
// VOICE PREDICT 🔥 (FIXED BOUNDARY ISSUE)
// -------------------------------
export const voicePredict = async (formData) => {
  try {
    // REMOVED manual headers. Axios will automatically set 
    // Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...
    const response = await API.post("/voice-predict", formData);

    return response.data;
  } catch (error) {
    console.error("Voice API Error:", error);
    return { error: "Voice prediction failed" };
  }
};

// -------------------------------
// CHAT
// -------------------------------
export const chat = async (prompt) => {
  try {
    const response = await API.post("/chat", { prompt });
    return response.data;
  } catch (error) {
    console.error("Chat API Error:", error);
    return { error: "Chat failed" };
  }
};

// -------------------------------
// REPORT (DATABASE SAVE ONLY) ✅ FIXED
// -------------------------------
export const generateReport = async (data) => {
  try {
    // We send the POST request to save the data.
    // Expected return is standard JSON: {"success": True}
    const response = await API.post("/report", data);
    return response.data; 

  } catch (error) {
    console.error("❌ Report DB Save Error:", error);
    return { error: "Failed to save report to database." };
  }
};

export const signup = async (data) => {
  const res = await API.post("/signup", data);
  return res.data;
};

export const login = async (data) => {
  const res = await API.post("/login", data);
  return res.data;
};