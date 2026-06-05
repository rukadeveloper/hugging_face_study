"use client";

import { useState } from "react";
import PutColumn from "@/components/PutColumn";

export interface Output {
    text: string;
    label: string;
    score: number;
}

export default function EmotionVisualPage() {
    const [inputValue, setInputValue] = useState<string>("");
    const [outputValue, setOutputValue] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const inputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
    };

    const outputChange = (data: string) => {
        setOutputValue(data);
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            const response = await fetch(
                `http://localhost:8000/api/v1/sentiment-analysis?text=${inputValue}`,
                {
                    method: "POST",
                }
            );
            const json = await response.json();
            setOutputValue(
                `감정: ${json.label}|확률: ${(json.score * 100).toFixed(1)}%`
            );
        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClear = () => {
        setInputValue("");
        setOutputValue("");
    };

    return (
        <main>
            <div id="wrap" className="w-[1080px] mx-auto">
                <h2 className="text-center mb-[30px]">AI 감정 분석 시각화</h2>
                <p className="text-[14px] mb-[16px]">
                    Hugging Face Transformer 모델 기반 감정 분석 시각화
                </p>
                <div className="put__rc grid grid-cols-2 gap-[10px]">
                    <PutColumn
                        ele="input"
                        label="text"
                        value={inputValue}
                        onChange={inputChange}
                        onSubmit={handleSubmit}
                        onClear={handleClear}
                        isSubmitting={isSubmitting}
                    />
                    <PutColumn
                        ele="output"
                        label="greeting"
                        value={outputValue}
                        isSubmitting={isSubmitting}
                    />
                </div>
            </div>
        </main>
    );
}
