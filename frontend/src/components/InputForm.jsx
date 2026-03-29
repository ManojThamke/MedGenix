import { useState } from "react";
import { voicePredict } from "../services/api"; // 🔥 IMPORTANT

const featureNames = [
  "MDVP:Fo(Hz)", "MDVP:Fhi(Hz)", "MDVP:Flo(Hz)",
  "MDVP:Jitter(%)", "MDVP:Jitter(Abs)", "MDVP:RAP",
  "MDVP:PPQ", "Jitter:DDP", "MDVP:Shimmer",
  "MDVP:Shimmer(dB)", "Shimmer:APQ3", "Shimmer:APQ5",
  "MDVP:APQ", "Shimmer:DDA", "NHR", "HNR",
  "RPDE", "DFA", "spread1", "spread2", "D2", "PPE"
];

function InputForm({ onPredict, onPredictFromVoice }) {
  const [features, setFeatures] = useState(Array(22).fill(""));
  const [recording, setRecording] = useState(false);

  // -------------------------------
  // Handle Input Change
  // -------------------------------
  const handleChange = (i, value) => {
    const updated = [...features];
    updated[i] = value;
    setFeatures(updated);
  };

  // -------------------------------
  // Load Demo Data
  // -------------------------------
  const loadDemo = () => {
    setFeatures([
      119.992, 157.302, 74.997, 0.00784, 0.00007, 0.0037, 0.00554, 0.01109,
      0.04374, 0.426, 0.02182, 0.0313, 0.02971, 0.06545, 0.02211, 21.033,
      0.414783, 0.815285, -4.813031, 0.266482, 2.301442, 0.284654
    ]);
  };

  // -------------------------------
  // Manual Predict
  // -------------------------------
  const handlePredict = () => {
    if (features.some(f => f === "")) {
      alert("Please fill all fields or use Demo Data");
      return;
    }

    onPredict(features.map(Number));
  };

  // -------------------------------
  // 🎤 Voice Recording + API Call
  // -------------------------------
  const recordVoice = async () => {
    let stream;

    try {
      setRecording(true);

      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      const audioChunks = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        setRecording(false);

        // stop mic
        stream.getTracks().forEach(track => track.stop());

        // ✅ FIXED FORMAT
        const blob = new Blob(audioChunks, { type: "audio/webm" });

        const formData = new FormData();
        formData.append("file", blob, "voice.webm");

        try {
          const data = await voicePredict(formData);

          console.log("VOICE RESULT:", data);

          if (data.error) {
            alert(data.error);
            return;
          }

          onPredictFromVoice(data);

        } catch (err) {
          console.error(err);
          alert("Voice prediction failed");
        }
      };

      mediaRecorder.start();

      setTimeout(() => {
        mediaRecorder.stop();
      }, 4000);

    } catch (err) {
      console.error(err);
      setRecording(false);
      alert("Microphone access denied");
    }
  };

  return (
    <div>
      {/* Buttons */}
      <div className="flex gap-3 justify-center mb-4 flex-wrap">

        <button
          onClick={loadDemo}
          className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
        >
          Load Demo Data
        </button>

        <button
          onClick={handlePredict}
          className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
        >
          Predict
        </button>

        {/* 🎤 Voice Button */}
        <button
          onClick={recordVoice}
          className={`px-4 py-2 rounded ${recording
              ? "bg-red-500"
              : "bg-purple-500 hover:bg-purple-600"
            }`}
        >
          {recording ? "Recording..." : "🎤 Record Voice"}
        </button>

      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {features.map((val, i) => (
          <input
            key={i}
            type="number"
            step="any"
            value={val}
            placeholder={featureNames[i]}
            onChange={(e) => handleChange(i, e.target.value)}
            className="p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
          />
        ))}
      </div>
    </div>
  );
}

export default InputForm;