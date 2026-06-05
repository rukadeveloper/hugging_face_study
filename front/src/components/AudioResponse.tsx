"use client";

import { useState, useRef } from "react";

interface AudioResponseProps {
  audioUrl: string;
}

export default function AudioResponse({ audioUrl }: AudioResponseProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setProgress(newTime);
    }
  };

  const formatTime = (time: number) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">AI Voice Response</h2>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        {/* Waveform visualization */}
        <div className="flex items-center justify-center gap-0.5 mb-6 h-16">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 rounded-full transition-all ${
                isPlaying
                  ? "bg-gradient-to-t from-blue-400 to-blue-600"
                  : "bg-gray-300"
              }`}
              style={{
                height: `${30 + Math.sin(i * 0.5) * 20}%`,
                animation: isPlaying ? `wave 0.5s ease-in-out ${i * 0.05}s infinite` : "none",
              }}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={handlePlayPause}
            className="flex-shrink-0 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors"
          >
            {isPlaying ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Progress bar */}
          <div className="flex-1">
            <input
              ref={audioRef}
              type="range"
              min="0"
              max={duration || 0}
              value={progress}
              onChange={handleProgressChange}
              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Time display */}
          <span className="text-sm text-gray-700 whitespace-nowrap">
            {formatTime(progress)} / {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={`http://localhost:8000${audioUrl}`}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      <style>{`
        @keyframes wave {
          0%, 100% { transform: scaleY(0.8); }
          50% { transform: scaleY(1.2); }
        }
      `}</style>
    </div>
  );
}
