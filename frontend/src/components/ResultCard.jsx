import { generateReport } from "../services/api";

function ResultCard({ result }) {
  if (!result) return null;

  const handleDownload = async () => {
    try {
      // ✅ API returns DIRECT blob
      const blob = await generateReport({
        result: result.result,
        confidence: result.confidence,
        risk: result.risk,
      });

      console.log("PDF size:", blob.size); // 🔥 DEBUG

      // ❌ If backend returned error instead of PDF
      if (blob.type !== "application/pdf") {
        const text = await blob.text();
        console.error("Backend Error:", text);
        alert("Backend error — check console");
        return;
      }

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "MedGenix_Report.pdf";

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error("Download error:", err);
      alert("❌ Download failed");
    }
  };

  return (
    <div className="mt-6 p-6 bg-gray-800 rounded-lg text-center shadow-lg">

      <h2 className="text-2xl font-bold text-green-400 mb-2">
        Result: {result.result}
      </h2>

      <p className="text-lg text-white mb-1">
        Confidence: {result.confidence}%
      </p>

      <p
        className={`text-lg mb-4 ${
          result.risk === "HIGH"
            ? "text-red-400"
            : result.risk === "MODERATE"
            ? "text-yellow-400"
            : "text-green-400"
        }`}
      >
        Risk Level: {result.risk}
      </p>

      <button
        onClick={handleDownload}
        className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700 transition"
      >
        📄 Download Report
      </button>
    </div>
  );
}

export default ResultCard;