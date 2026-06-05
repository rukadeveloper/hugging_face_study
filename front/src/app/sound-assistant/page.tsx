"use client";

import { useState } from "react";
import AudioComponent from "@/components/AudioComponent";
import AudioResponse from "@/components/AudioResponse";
import CommonPut from "@/components/CommonPut";

export default function SoundAssistantPage() {
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [textFromAudio, setTextFromAudio] = useState<string>("");
  const [isTransformingAudio, setIsTransformingAudio] = useState(false);
  const [question, setQuestion] = useState<string>("");
  const [isAskingQuestion, setIsAskingQuestion] = useState(false);
  const [answer, setAnswer] = useState<string>("");
  const [ttsUrl, setTtsUrl] = useState<string>("");
  const [isConvertingToSpeech, setIsConvertingToSpeech] = useState(false);

  const changeAudioToText = async () => {
    if (!audioUrl) {
      alert("Please upload or record audio first");
      return;
    }

    setIsTransformingAudio(true);
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

      if (!response.ok) throw new Error("Conversion failed");
      const data = await response.json();
      setTextFromAudio(data.text);
    } catch (error) {
      alert("Error converting audio to text");
    } finally {
      setIsTransformingAudio(false);
    }
  };

  const quest = async () => {
    if (!question.trim()) {
      alert("Please enter a question");
      return;
    }

    setIsAskingQuestion(true);
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

      if (!response.ok) throw new Error("Question failed");
      const data = await response.json();
      setAnswer(data.answer);
    } catch (error) {
      alert("Error generating answer");
    } finally {
      setIsAskingQuestion(false);
    }
  };

  const handleTextToSpeech = async () => {
    if (!answer) {
      alert("Please generate an answer first");
      return;
    }

    setIsConvertingToSpeech(true);
    try {
      const response = await fetch("http://localhost:8000/api/v1/tts", {
        method: "POST",
      });

      if (!response.ok) throw new Error("TTS failed");
      const data = await response.json();
      setTtsUrl(data.url);
    } catch (error) {
      alert("Error converting to speech");
    } finally {
      setIsConvertingToSpeech(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Sound Assistant
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <AudioComponent audioUrl={audioUrl} setAudioUrl={setAudioUrl} />
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <CommonPut
                put="Audio to Text"
                label="Transcription"
                height="h-32"
                highHeight="h-40"
                hasButton={true}
                value={textFromAudio}
                isTransforming={isTransformingAudio}
                changeValue={setTextFromAudio}
                onSubmit={changeAudioToText}
                isSubmitting={isTransformingAudio}
              />
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <CommonPut
                put="Question"
                label="Ask a Question"
                height="h-24"
                highHeight="h-32"
                hasButton={true}
                value={question}
                isTransforming={false}
                changeValue={setQuestion}
                onSubmit={quest}
                isSubmitting={isAskingQuestion}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <CommonPut
                put="Answer"
                label="Generated Answer"
                height="h-32"
                highHeight="h-40"
                hasButton={false}
                value={answer}
                isTransforming={false}
                changeValue={setAnswer}
                isSubmitting={isAskingQuestion}
              />
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <button
                onClick={handleTextToSpeech}
                disabled={isConvertingToSpeech || !answer}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 mb-4"
              >
                {isConvertingToSpeech ? "Converting..." : "Answer to Speech"}
              </button>
              {ttsUrl && (
                <AudioResponse audioUrl={ttsUrl} />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
