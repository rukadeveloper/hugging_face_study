"use client";

import { useState, useRef } from "react";
import { MdPlayArrow, MdPause } from "react-icons/md";

export default function AudioResponse() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handlePlayPause = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
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
            setCurrentTime(newTime);
        }
    };

    const formatTime = (time: number) => {
        if (!time || isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    return (
        <div id="audioResponse" className="w-full">
            <div className="w-full border border-[#e7e7e9] rounded-[5px] overflow-auto flex flex-col">
                <div className="w-[80px] h-[30px] border-r border-b border-[#e7e7e9] flex justify-center items-center gap-[6px]">
                    <span className="text-[12px]">응답</span>
                </div>
                <div className="flex-1 p-[20px] flex items-center gap-[15px]">
                    {/* 재생 버튼 */}
                    <button
                        onClick={handlePlayPause}
                        className="flex-shrink-0 w-[40px] h-[40px] rounded-full bg-[#f0f0f1] flex items-center justify-center hover:bg-[#e0e0e2]"
                    >
                        {isPlaying ? (
                            <MdPause size={20} />
                        ) : (
                            <MdPlayArrow size={20} />
                        )}
                    </button>

                    {/* 진행률 바 */}
                    <div className="flex-1 flex items-center gap-[10px]">
                        <input
                            ref={audioRef}
                            type="range"
                            min="0"
                            max={duration || 0}
                            value={currentTime}
                            onChange={handleProgressChange}
                            className="flex-1 h-[4px] bg-[#e7e7e9] rounded-full appearance-none cursor-pointer"
                            style={{
                                background: `linear-gradient(to right, #333 0%, #333 ${duration ? (currentTime / duration) * 100 : 0}%, #e7e7e9 ${duration ? (currentTime / duration) * 100 : 0}%, #e7e7e9 100%)`
                            }}
                        />
                        <span className="text-[12px] text-[#919096] whitespace-nowrap">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                    </div>
                </div>
            </div>

            {/* 숨겨진 오디오 요소 */}
            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
            />
        </div>
    );
}
