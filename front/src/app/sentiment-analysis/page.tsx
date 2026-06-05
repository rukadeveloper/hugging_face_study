"use client";

import { useState } from "react";
import FileAnalysis from "@/components/FileAnalysis";
import OutputColumn from "@/components/OutputColumn";
import CsvOutputs from "@/components/CsvOutputs";

export default function SentimentAnalysisPage() {
  const [activeTab, setActiveTab] = useState<"text" | "file">("text");
  const [text, setText] = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [csvData, setCsvData] = useState<any>(null);

  const analyzeSentiment = async () => {
    if (!text.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/v1/multi-sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texts: text }),
      });

      if (!response.ok) throw new Error("Analysis failed");
      const data = await response.json();
      setResults(data);
    } catch (error) {
      alert("Error analyzing sentiment");
    } finally {
      setLoading(false);
    }
  };

  const handleCsvAnalysis = (data: any) => {
    setCsvData(data);
    setResults(null);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Sentiment Analysis
        </h1>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("text")}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              activeTab === "text"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-300"
            }`}
          >
            Text Analysis
          </button>
          <button
            onClick={() => setActiveTab("file")}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              activeTab === "file"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-300"
            }`}
          >
            File Analysis
          </button>
        </div>

        {activeTab === "text" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Enter Text
              </h2>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text (one sentence per line)..."
                className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={analyzeSentiment}
                disabled={loading}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? "Analyzing..." : "Analyze Sentiment"}
              </button>
            </div>

            {results && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Results
                </h2>
                <OutputColumn results={results} />
              </div>
            )}
          </div>
        )}

        {activeTab === "file" && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <FileAnalysis onAnalysisComplete={handleCsvAnalysis} />
            {csvData && <CsvOutputs data={csvData} />}
          </div>
        )}
      </div>
    </main>
  );
}
