"use client";

import { useState } from "react";

interface FileAnalysisProps {
  onAnalysisComplete: (data: any) => void;
}

export default function FileAnalysis({ onAnalysisComplete }: FileAnalysisProps) {
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
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

      if (!uploadResponse.ok) throw new Error("Upload failed");
      const uploadData = await uploadResponse.json();
      const fileUrl = uploadData.filename;

      setSelectedFile(fileUrl);

      // Analyze CSV
      const chartResponse = await fetch(
        "http://localhost:8000/api/v1/csv_chart",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file_path: fileUrl }),
        }
      );

      if (!chartResponse.ok) throw new Error("Analysis failed");
      const chartData = await chartResponse.json();
      onAnalysisComplete(chartData);
    } catch (error) {
      alert("Error analyzing file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload CSV File</h2>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          disabled={loading}
          className="w-full"
        />
        {loading && <p className="text-blue-600 mt-2 font-semibold">Analyzing...</p>}
        {selectedFile && !loading && (
          <p className="text-green-600 mt-2 font-semibold">File analyzed</p>
        )}
      </div>
    </div>
  );
}
