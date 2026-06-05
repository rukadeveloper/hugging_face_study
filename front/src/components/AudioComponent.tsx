'use client';

import { useState, useRef } from "react";
import { MdSpatialAudioOff, MdUpload } from "react-icons/md";
import { HiOutlineMicrophone } from "react-icons/hi2";
import { IoCloseCircle } from "react-icons/io5";

interface AudioComponentProps {
    changeAudioToText: (data: string) => void;
    changeTransforming: (data: boolean) => void;
    isTransforming: boolean;
}

export default function AudioComponent({
    changeAudioToText,
    changeTransforming,
    isTransforming,
}: AudioComponentProps) {
    const [activeTab, setActiveTab] = useState<'upload' | 'record'>('upload');
    const [uploadedAudio, setUploadedAudio] = useState<string>("");
    const [isUploading, setIsUploading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleAudioUpload = () => {
        inputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const formData = new FormData();
            formData.append("file", file);
            const response = await fetch("http://localhost:8000/api/v1/file-upload", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            setUploadedAudio(data.url);

            // 자동으로 audio to text 실행
            changeTransforming(true);
            try {
                const textResponse = await fetch("http://localhost:8000/api/v1/audio_to_text", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ input_audio_path: data.url }),
                });
                const textData = await textResponse.json();
                changeAudioToText(textData.text);
            } catch (error) {
                console.error("Audio to text failed:", error);
            } finally {
                changeTransforming(false);
            }
        } catch (error) {
            console.error("Upload failed:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            const chunks: BlobPart[] = [];

            recorder.ondataavailable = (e) => chunks.push(e.data);
            recorder.onstop = async () => {
                const blob = new Blob(chunks, { type: "audio/webm" });
                const file = new File([blob], "recording.webm", { type: "audio/webm" });

                try {
                    const formData = new FormData();
                    formData.append("file", file);
                    const response = await fetch("http://localhost:8000/api/v1/file-upload", {
                        method: "POST",
                        body: formData,
                    });
                    const data = await response.json();
                    setUploadedAudio(data.url);

                    // 자동으로 audio to text 실행
                    changeTransforming(true);
                    try {
                        const textResponse = await fetch("http://localhost:8000/api/v1/audio_to_text", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ input_audio_path: data.url }),
                        });
                        const textData = await textResponse.json();
                        changeAudioToText(textData.text);
                    } catch (error) {
                        console.error("Audio to text failed:", error);
                    } finally {
                        changeTransforming(false);
                    }
                } catch (error) {
                    console.error("Upload failed:", error);
                }

                stream.getTracks().forEach((track) => track.stop());
            };

            recorder.start();
            setMediaRecorder(recorder);
            setIsRecording(true);
        } catch (error) {
            console.error("Microphone access denied:", error);
        }
    };

    const stopRecording = () => {
        mediaRecorder?.stop();
        setIsRecording(false);
    };

    const clearAudio = () => {
        setUploadedAudio("");
        changeAudioToText("");
        if (inputRef.current) inputRef.current.value = "";
    };

    return (
        <div id="audioWrap">
            <div id="audioWrapBox" className="w-full h-[250px] border border-[#e6e6e8] rounded-[5px] flex flex-col">
                <div id="audioWrapBoxTitle" className="w-[80px] h-[30px] border-r border-b border-[#e6e6e8] flex items-center justify-center gap-[5px]">
                    <MdSpatialAudioOff />
                    <span className="text-[12px]">오디오</span>
                </div>
                <div id="audioWrapBoxContent" className="flex-1 flex justify-center items-center">
                    {uploadedAudio ? (
                        <div className="flex flex-col justify-center items-center gap-[10px]">
                            <div className="text-center">
                                <div className="text-[#d6d9d6]">오디오 로드됨</div>
                                <audio controls className="mt-[10px]" src={`http://localhost:8000${uploadedAudio}`} style={{ maxWidth: '100%' }} />
                            </div>
                            <button
                                onClick={clearAudio}
                                className="flex items-center gap-[5px] text-[#919096] hover:text-[#333]"
                            >
                                <IoCloseCircle size={20} />
                                <span className="text-[12px]">제거</span>
                            </button>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'upload' ? (
                                <button
                                    onClick={handleAudioUpload}
                                    disabled={isUploading}
                                    className="flex flex-col justify-center items-center gap-[5px]"
                                >
                                    <MdUpload size={22} color={"#919096"} />
                                    <span className="text-[#d6d9d6]">오디오를 여기에 드롭</span>
                                    <span className="text-[#919096]">-또는-</span>
                                    <span className="text-[#919096]">클릭하여 업로드</span>
                                </button>
                            ) : (
                                <button
                                    onClick={isRecording ? stopRecording : startRecording}
                                    className="flex flex-col justify-center items-center gap-[5px]"
                                >
                                    <HiOutlineMicrophone size={22} color={isRecording ? "#dc2626" : "#919096"} />
                                    <span className="text-[#d6d9d6]">{isRecording ? "녹음 중..." : "녹음 시작"}</span>
                                    <span className="text-[#919096]">클릭하여 녹음</span>
                                </button>
                            )}
                        </>
                    )}
                </div>
                <div id="audioWrapBoxTab" className="h-[40px] border-t border-[#e6e6e8] flex justify-center items-center gap-[20px] px-[20px]">
                    <button
                        onClick={() => setActiveTab('upload')}
                        className={`flex items-center gap-[6px] pb-[8px] border-b-[2px] transition-colors ${activeTab === 'upload'
                            ? 'border-[#333] text-[#333]'
                            : 'border-transparent text-[#919096]'
                        }`}
                    >
                        <MdUpload size={16} />
                    </button>
                    <button
                        onClick={() => setActiveTab('record')}
                        className={`flex items-center gap-[6px] pb-[8px] border-b-[2px] transition-colors ${activeTab === 'record'
                            ? 'border-[#333] text-[#333]'
                            : 'border-transparent text-[#919096]'
                        }`}
                    >
                        <HiOutlineMicrophone size={16} />
                    </button>
                </div>
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
        </div>
    );
}
