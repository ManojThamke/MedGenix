import axios from "axios";

// 1. Create Instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
});

// 2. Request Interceptor: Attach JWT Token automatically
// This removes the need to manually pass headers in every function below.
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor: Global Error Handling (Optional but Recommended)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // If backend returns 401, the token might be expired
    if (error.response?.status === 401) {
      console.warn("Session expired. Redirecting to login...");
      localStorage.removeItem("token");
      // window.location.href = "/login"; // Optional: auto-redirect
    }
    return Promise.reject(error);
  }
);

// -------------------------------
// AUTHENTICATION
// -------------------------------
export const signup = async (data) => {
  const res = await API.post("/signup", data);
  return res.data;
};

export const login = async (data) => {
  const res = await API.post("/login", data);
  return res.data;
};

export const googleLogin = async (email) => {
  try {
    const res = await API.post("/google-login", { email });
    return res.data;
  } catch (error) {
    console.error("Google Login API Error:", error.response?.data || error.message);
    return { error: "Google login failed" };
  }
};

// -------------------------------
// CLINICAL PREDICTIONS
// -------------------------------

/**
 * Manual Prediction using 22 features
 * @param {Array} features - Array of floats
 */
export const predict = async (features) => {
  try {
    const response = await API.post("/predict", { features });
    return response.data;
  } catch (error) {
    console.error("Predict API Error:", error.response?.data || error.message);
    return { error: error.response?.data?.detail || "Prediction failed" };
  }
};

/**
 * Voice Prediction using Audio Blob
 * @param {FormData} formData - Must contain 'file' key with the audio blob
 */
export const voicePredict = async (formData) => {
  try {
    // Note: Do NOT set Content-Type header manually. 
    // Axios + Browser will handle the boundary for FormData.
    const response = await API.post("/voice-predict", formData);
    return response.data;
  } catch (error) {
    console.error("Voice API Error:", error.response?.data || error.message);
    return { error: error.response?.data?.detail || "Voice prediction failed" };
  }
};

// -------------------------------
// GEN-AI & REPORTING
// -------------------------------

/**
 * Fetch a plain-English AI explanation of the prediction
 * @param {Object} data - Contains result, confidence, risk, and features array
 */
export const explainPrediction = async (data) => {
  try {
    const response = await API.post("/explain", data);
    return response.data;
  } catch (error) {
    console.error("Explain API Error:", error.response?.data || error.message);
    // Safe fallback so the UI doesn't break
    return { explanation: "Analysis complete. Awaiting clinical review." };
  }
};

/**
 * AI Chat with Gemini
 * @param {string} prompt - User message
 * @param {string} language - Target language (e.g., "English", "Spanish", "Hindi")
 */
export const chat = async (prompt, language = "English") => {
  try {
    const response = await API.post("/chat", { prompt, language });
    return response.data;
  } catch (error) {
    console.error("Chat API Error:", error.response?.data || error.message);
    return { error: "Chat failed" };
  }
};

/**
 * Save Clinical Report to MongoDB
 * @param {Object} data - ResultData and FormData
 */
export const generateReport = async (data) => {
  try {
    const response = await API.post("/report", data);
    return response.data;
  } catch (error) {
    console.error("❌ Report DB Save Error:", error.response?.data || error.message);
    return { error: "Failed to save report to database." };
  }
};

// -------------------------------
// DASHBOARD STATS & HISTORY
// -------------------------------

/**
 * Fetch Live Dashboard Statistics from MongoDB
 */
export const getStats = async () => {
  try {
    const response = await API.get("/stats");
    return response.data;
  } catch (error) {
    console.error("❌ Stats Fetch Error:", error.response?.data || error.message);
    return null;
  }
};

/**
 * Fetch Full Report History from MongoDB
 */
export const getHistory = async () => {
  try {
    const response = await API.get("/history");
    return response.data;
  } catch (error) {
    console.error("❌ History Fetch Error:", error.response?.data || error.message);
    return [];
  }
};

export default API;