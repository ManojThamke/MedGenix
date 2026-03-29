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
// VOICE PREDICT 🔥
// -------------------------------
export const voicePredict = async (formData) => {
  try {
    const response = await API.post("/voice-predict", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

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
// REPORT (PDF) ✅ FINAL FIX
// -------------------------------
export const generateReport = async (data) => {
  try {
    const response = await API.post("/report", data, {
      responseType: "blob", // 🔥 VERY IMPORTANT
    });

    // ✅ RETURN ONLY BLOB
    return response.data;

  } catch (error) {
    console.error("❌ Report API Error:", error);

    // 🔥 DEBUG BACKEND RESPONSE (VERY IMPORTANT)
    if (error.response && error.response.data) {
      try {
        const text = await error.response.data.text();
        console.error("Backend Error Response:", text);
      } catch (e) {}
    }

    throw new Error("Report generation failed");
  }
};