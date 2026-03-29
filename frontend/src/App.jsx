import { useState } from "react";
import InputForm from "./components/InputForm";
import ResultCard from "./components/ResultCard";
import ChatBot from "./components/ChatBot";   // ✅ ADD THIS
import { predict } from "./services/api";

function App() {
  const [result, setResult] = useState(null);

  const handlePredict = async (features) => {
    try {
      const res = await predict(features);
      setResult(res.data);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-gray-800 rounded-2xl shadow-lg p-6">
        
        <h1 className="text-3xl font-bold text-center mb-6">
          🧠 MedGenix - Parkinson Detection
        </h1>

        {/* Prediction Section */}
        <InputForm onPredict={handlePredict} />
        <ResultCard result={result} />

        {/* Chatbot Section */}
        <ChatBot />   {/* ✅ ADD THIS */}

      </div>
    </div>
  );
}

export default App;