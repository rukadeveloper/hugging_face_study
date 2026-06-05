"use client";

import { useState } from "react";
import OutputBar from "@/components/OutputBar";

export default function SoundAssistantPage() {
    const [audioUrl, setAudioUrl] = useState("");
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [transcription, setTranscription] = useState("");
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [responseAudioUrl, setResponseAudioUrl] = useState("");

    // 파일 업로드
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setAudioFile(file);

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

            const data = await response.json();
            setAudioUrl(data.url);
        } catch (error) {
            console.error("Upload failed:", error);
        }
    };

    // 녹음 시작
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
                setAudioFile(file);

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

                    const data = await response.json();
                    setAudioUrl(data.url);
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

    // 녹음 중지
    const stopRecording = () => {
        mediaRecorder?.stop();
        setIsRecording(false);
    };

    // 오디오를 텍스트로
    const handleAudioToText = async () => {
        if (!audioUrl) {
            alert("Please upload or record audio first");
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("input_audio_path", audioUrl);

            const response = await fetch(
                "http://localhost:8000/api/v1/audio_to_text",
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await response.json();
            setTranscription(data.text);
        } catch (error) {
            console.error("Transcription failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // 질문으로 답변 생성
    const handleGenerateAnswer = async () => {
        if (!question.trim()) {
            alert("Please enter a question");
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("question", question);

            const response = await fetch(
                "http://localhost:8000/api/v1/text_generation",
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await response.json();
            setAnswer(data.answer);
        } catch (error) {
            console.error("Answer generation failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // 답변을 음성으로
    const handleAnswerToSpeech = async () => {
        if (!answer) {
            alert("Please generate an answer first");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:8000/api/v1/tts", {
                method: "POST",
            });

            const data = await response.json();
            setResponseAudioUrl(data.url);
        } catch (error) {
            console.error("TTS failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main>
            <div id="wrap" className="w-[1080px] mx-auto py-8">
                <h2 className="text-center mb-[30px] text-2xl font-bold">
                    음성 어시스턴트
                </h2>
                <p className="text-[14px] mb-[16px] text-center">
                    음성을 텍스트로, 텍스트를 음성으로 변환하는 AI 어시스턴트
                </p>

                <div className="grid grid-cols-2 gap-[10px]">
                    {/* 왼쪽: 오디오 입력 */}
                    <div className="space-y-4">
                        {/* 파일 업로드 */}
                        <div className="border border-gray-300 rounded-lg p-4">
                            <h3 className="font-semibold mb-2">파일 업로드</h3>
                            <input
                                type="file"
                                accept="audio/*"
                                onChange={handleFileUpload}
                                className="w-full"
                            />
                            {audioFile && (
                                <p className="text-green-600 text-sm mt-2">
                                    ✓ {audioFile.name}
                                </p>
                            )}
                        </div>

                        {/* 녹음 */}
                        <div className="border border-gray-300 rounded-lg p-4">
                            <h3 className="font-semibold mb-2">음성 녹음</h3>
                            <button
                                onClick={
                                    isRecording ? stopRecording : startRecording
                                }
                                className={`w-full py-2 rounded text-white font-semibold ${
                                    isRecording
                                        ? "bg-red-600 hover:bg-red-700"
                                        : "bg-green-600 hover:bg-green-700"
                                }`}
                            >
                                {isRecording
                                    ? "🛑 녹음 중지"
                                    : "🎤 녹음 시작"}
                            </button>
                            {isRecording && (
                                <p className="text-red-600 mt-2 text-sm">
                                    녹음 중...
                                </p>
                            )}
                        </div>

                        {/* 오디오 재생 */}
                        {audioUrl && (
                            <div className="border border-gray-300 rounded-lg p-4">
                                <h3 className="font-semibold mb-2">
                                    현재 오디오
                                </h3>
                                <audio
                                    controls
                                    className="w-full"
                                    src={`http://localhost:8000${audioUrl}`}
                                />
                            </div>
                        )}

                        {/* 오디오 to 텍스트 */}
                        <button
                            onClick={handleAudioToText}
                            disabled={!audioUrl || isLoading}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
                        >
                            {isLoading ? "변환 중..." : "🎵 음성을 텍스트로"}
                        </button>

                        {/* 텍스트 결과 */}
                        {transcription && (
                            <OutputBar
                                content={transcription}
                                title="음성 인식 결과"
                                isLoading={false}
                            />
                        )}
                    </div>

                    {/* 오른쪽: 텍스트 처리 */}
                    <div className="space-y-4">
                        {/* 질문 입력 */}
                        <div className="border border-gray-300 rounded-lg p-4">
                            <h3 className="font-semibold mb-2">질문</h3>
                            <textarea
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="질문을 입력하세요..."
                                className="w-full h-24 p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                        </div>

                        {/* 답변 생성 */}
                        <button
                            onClick={handleGenerateAnswer}
                            disabled={!question || isLoading}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
                        >
                            {isLoading ? "생성 중..." : "💡 답변 생성"}
                        </button>

                        {/* 답변 결과 */}
                        {answer && (
                            <OutputBar
                                content={answer}
                                title="AI 답변"
                                isLoading={false}
                            />
                        )}

                        {/* 답변을 음성으로 */}
                        <button
                            onClick={handleAnswerToSpeech}
                            disabled={!answer || isLoading}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
                        >
                            {isLoading ? "변환 중..." : "🔊 답변을 음성으로"}
                        </button>

                        {/* 응답 오디오 재생 */}
                        {responseAudioUrl && (
                            <div className="border border-gray-300 rounded-lg p-4">
                                <h3 className="font-semibold mb-2">
                                    음성 응답
                                </h3>
                                <audio
                                    controls
                                    className="w-full"
                                    autoPlay
                                    src={`http://localhost:8000${responseAudioUrl}`}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
