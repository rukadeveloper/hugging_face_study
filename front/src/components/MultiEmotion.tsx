"use client";

import { useState } from "react";

interface MultiEmotionProps {
  onAnalysisComplete: (results: any) => void;
}

export default function MultiEmotion({
  onAnalysisComplete,
}: MultiEmotionProps) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeEmotion = async () => {
    if (!text.trim()) {
      setError("Please enter text");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/multi-emotion",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ texts: text }),
        }
      );

      if (!response.ok) {
        throw new Error("Emotion analysis failed");
      }

      const data = await response.json();
      onAnalysisComplete(data);
    } catch (err) {
      setError("Error analyzing emotion. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Emotion Analysis
      </h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text (one sentence per line)..."
        className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
      {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
      <button
        onClick={analyzeEmotion}
        disabled={loading}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
      >
        {loading ? "Analyzing..." : "Analyze Emotion"}
      </button>
    </div>
  );
}
