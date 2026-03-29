import { useState } from "react";

const featureNames = [
  "MDVP:Fo(Hz)", "MDVP:Fhi(Hz)", "MDVP:Flo(Hz)",
  "MDVP:Jitter(%)", "MDVP:Jitter(Abs)", "MDVP:RAP",
  "MDVP:PPQ", "Jitter:DDP", "MDVP:Shimmer",
  "MDVP:Shimmer(dB)", "Shimmer:APQ3", "Shimmer:APQ5",
  "MDVP:APQ", "Shimmer:DDA", "NHR", "HNR",
  "RPDE", "DFA", "spread1", "spread2", "D2", "PPE"
];

function InputForm({ onPredict }) {
  const [features, setFeatures] = useState(Array(22).fill(""));

  const handleChange = (i, value) => {
    const updated = [...features];
    updated[i] = value;
    setFeatures(updated);
  };

  const loadDemo = () => {
    setFeatures([
      119.992,157.302,74.997,0.00784,0.00007,0.0037,0.00554,0.01109,
      0.04374,0.426,0.02182,0.0313,0.02971,0.06545,0.02211,21.033,
      0.414783,0.815285,-4.813031,0.266482,2.301442,0.284654
    ]);
  };

  return (
    <div>
      {/* Buttons */}
      <div className="flex gap-3 justify-center mb-4">
        <button
          onClick={loadDemo}
          className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
        >
          Load Demo Data
        </button>

        <button
          onClick={() => onPredict(features.map(Number))}
          className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
        >
          Predict
        </button>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {features.map((val, i) => (
          <input
            key={i}
            type="number"
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