"use client";

import { useState } from "react";

interface AudioComponentProps {
  audioUrl: string;
  setAudioUrl: (url: string) => void;
}

export default function AudioComponent({
  audioUrl,
  setAudioUrl,
}: AudioComponentProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "record">("upload");
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:8000/api/v1/file-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();
      setAudioUrl(data.url);
    } catch (error) {
      alert("Error uploading file");
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const file = new File([blob], "recording.webm", {
          type: "audio/webm",
        });

        try {
          const formData = new FormData();
          formData.append("file", file);

          const response = await fetch(
            "http://localhost:8000/api/v1/file-upload",
            {
              method: "POST",
              body: formData,
            }
          );

          if (!response.ok) throw new Error("Upload failed");
          const data = await response.json();
          setAudioUrl(data.url);
        } catch (error) {
          alert("Error uploading recording");
        }

        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      alert("Error accessing microphone");
    }
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    setIsRecording(false);
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Audio Input</h2>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setActiveTab("upload")}
          className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
            activeTab === "upload"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Upload
        </button>
        <button
          onClick={() => setActiveTab("record")}
          className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
            activeTab === "record"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Record
        </button>
      </div>

      {activeTab === "upload" && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="w-full"
          />
          <p className="text-gray-600 mt-2">
            Supported formats: MP3, WAV, M4A, OGG, FLAC
          </p>
        </div>
      )}

      {activeTab === "record" && (
        <div className="text-center">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`px-6 py-3 rounded-lg font-semibold text-white ${
              isRecording ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isRecording ? "Stop Recording" : "Start Recording"}
          </button>
          {isRecording && (
            <p className="text-red-600 mt-4 font-semibold">Recording...</p>
          )}
        </div>
      )}

      {audioUrl && (
        <div className="mt-6">
          <p className="text-gray-700 font-semibold mb-2">Current Audio:</p>
          <audio controls className="w-full">
            <source src={`http://localhost:8000${audioUrl}`} />
          </audio>
        </div>
      )}
    </div>
  );
}
