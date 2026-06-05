"use client";

import { useState } from "react";
import PutColumn from "@/components/PutColumn";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

export interface Output {
    text: string;
    label: string;
    score: number;
}

export default function EmotionVisualPage() {
    const [inputValue, setInputValue] = useState<string>("");
    const [outputValue, setOutputValue] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [chartData, setChartData] = useState<{ name: string; value: number }[]>([]);

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
                `감정: ${json.label}\n확률: ${(json.score * 100).toFixed(1)}%`
            );

            // 긍정/부정 확률 계산
            const positiveScore = json.label === "POSITIVE" ? json.score : 1 - json.score;
            const negativeScore = 1 - positiveScore;

            setChartData([
                { name: "긍정", value: parseFloat((positiveScore * 100).toFixed(1)) },
                { name: "부정", value: parseFloat((negativeScore * 100).toFixed(1)) }
            ]);
        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClear = () => {
        setInputValue("");
        setOutputValue("");
        setChartData([]);
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
                {chartData.length > 0 && (
                    <div className="mt-[30px] w-full">
                        <h3 className="text-[16px] font-semibold mb-[15px]">감정 분석 결과</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, value }) => `${name}: ${value}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    <Cell fill="#82ca9d" />
                                    <Cell fill="#ffc658" />
                                </Pie>
                                <Tooltip formatter={(value) => `${value}%`} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </main>
    );
}
