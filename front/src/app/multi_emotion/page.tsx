"use client"

import { useState } from "react";
import OutputColumn from "@/components/OutputColumn";
import PutColumn from "@/components/PutColumn";

export interface Outputs {
    text: string
    label: string
    score: number
}


export default function MultiEmotionPage() {
    const [inputValue, setInputValue] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [outputValue, setOutputValue] = useState<Outputs[]>([])

    const inputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value)
    }

    const inputClear = () => {
        setInputValue("");
    }

    const inputSubmit = async () => {
        try {
            setIsSubmitting(true);
            const response = await fetch(`http://localhost:8000/api/v1/multi-sentiment?texts=${encodeURIComponent(inputValue)}`, {
                method: "POST"
            })
            const json = await response.json()
            console.log(json)
            // Backend returns results as array of tuples: [[text, {text, label, score}], ...]
            // Extract the second element (object) from each tuple
            const parsedResults = json.results.map((item: any) => {
                if (Array.isArray(item) && item.length === 2) {
                    return item[1]; // Get the object part of the tuple
                }
                return item; // Fallback if not a tuple
            })
            setOutputValue(parsedResults)
        } catch (error) {
            console.log(error)
        } finally {
            setIsSubmitting(false);
        }
    }


    return (
        <main>
            <div id="wrap" className="w-[1080px] mx-auto">
                <h2 className="text-center mb-[30px]">AI 감정 분석 웹앱</h2>
                <p className="text-[14px] mb-[16px]">
                    Hugging Face Transformer 모델 기반 감정 분석
                </p>
                <div className="put__rc grid grid-cols-2 gap-[10px]">
                    <PutColumn ele="input" label="text" value={inputValue} onSubmit={inputSubmit} onChange={inputChange} onClear={inputClear} isSubmitting={isSubmitting} />
                    <OutputColumn outputs={outputValue} />
                </div>
            </div>
        </main >
    )
}
