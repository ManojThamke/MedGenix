import { useState } from "react";
import InputForm from "./components/InputForm";
import ResultCard from "./components/ResultCard";
import ChatBot from "./components/ChatBot";
import { predict } from "./services/api";

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // -------------------------------
  // 🟢 Manual Prediction
  // -------------------------------
  const handlePredict = async (features) => {
    try {
      setLoading(true);

      const res = await predict(features);

      console.log("MANUAL RESULT:", res); // debug

      if (res.error) {
        alert(res.error);
        return;
      }

      setResult(res);

    } catch (err) {
      console.error(err);
      alert("❌ Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // 🎤 Voice Prediction
  // -------------------------------
  const handleVoiceResult = (data) => {
    console.log("VOICE RESULT:", data); // 🔥 debug

    if (data.error) {
      alert(data.error);
      return;
    }

    setResult(data);   // 🔥 THIS FIXES YOUR ISSUE
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-gray-800 rounded-2xl shadow-lg p-6">
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-6">
          🧠 MedGenix - Parkinson Detection
        </h1>

        {/* Input */}
        <InputForm 
          onPredict={handlePredict}
          onPredictFromVoice={handleVoiceResult}
        />

        {/* Loading Indicator */}
        {loading && (
          <div className="text-center mt-4">
            <p className="text-yellow-400 animate-pulse">
              ⏳ Analyzing...
            </p>
          </div>
        )}

        {/* Result */}
        <ResultCard result={result} />

        {/* Chatbot */}
        <div className="mt-8">
          <ChatBot />
        </div>

      </div>
    </div>
  );
}

export default App;