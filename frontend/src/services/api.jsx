import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

export const predict = (features) => {
  return API.post("/predict", { features });
};

export const chat = (prompt) => {
  return API.post("/chat", {
    prompt: prompt
  });
};

export const generateReport = (data) => {
  return API.post("/report", data, {
    responseType: "blob",   // 🔥 REQUIRED
  });
};