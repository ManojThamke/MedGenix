import { generateReport } from "../services/api";

function ResultCard({ result }) {
  if (!result) return null;

  const handleDownload = async () => {
    try {
      const res = await generateReport({
        result: result.result,
        confidence: result.confidence,
      });

      // 🔥 Create file download
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "MedGenix_Report.pdf"; // file name

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);

    } catch (err) {
      alert("❌ Download failed");
    }
  };

  return (
    <div className="mt-6 text-center">
      <h2 className="text-2xl font-semibold text-green-400">
        Result: {result.result}
      </h2>

      <h3 className="text-lg mt-2">
        Confidence: {result.confidence}%
      </h3>

      <button
        onClick={handleDownload}
        className="bg-purple-500 px-4 py-2 rounded mt-4 hover:bg-purple-600"
      >
        📄 Download Report
      </button>
    </div>
  );
}

export default ResultCard;