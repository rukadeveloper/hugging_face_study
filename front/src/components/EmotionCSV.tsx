"use client";

import { useState } from "react";

interface EmotionCSVProps {
  onAnalysisComplete: (data: any) => void;
}

export default function EmotionCSV({ onAnalysisComplete }: EmotionCSVProps) {
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      setError("Please select a CSV file");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Upload file
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch(
        "http://localhost:8000/api/v1/file-upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error("File upload failed");
      }

      const uploadData = await uploadResponse.json();
      const fileUrl = uploadData.filename;
      setSelectedFile(fileUrl);

      // Analyze emotions
      const analysisResponse = await fetch(
        "http://localhost:8000/api/v1/emotion_csv",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file_path: fileUrl }),
        }
      );

      if (!analysisResponse.ok) {
        throw new Error("Emotion analysis failed");
      }

      const analysisData = await analysisResponse.json();
      onAnalysisComplete(analysisData);
    } catch (err) {
      setError("Error processing CSV file. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        CSV Emotion Analysis
      </h2>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          disabled={loading}
          className="w-full cursor-pointer"
        />
        {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
        {loading && (
          <p className="text-blue-600 mt-2 font-semibold">Analyzing...</p>
        )}
        {selectedFile && !loading && (
          <p className="text-green-600 mt-2 font-semibold">File analyzed</p>
        )}
      </div>
    </div>
  );
}
