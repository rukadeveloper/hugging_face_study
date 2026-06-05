"use client";

import { useState } from "react";
import PutColumn from "@/components/PutColumn";


export default function EmotionPage() {
    const putArray: Array<{ ele: 'input' | 'output'; label: string }> = [
        {
            ele: 'input',
            label: 'text'
        },
        {
            ele: 'output',
            label: 'greeting'
        }
    ]

    const [inputValue, setInputValue] = useState<string>("");
    const [outputValue, setOutputValue] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    const inputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value)
    }

    const outputChange = (data: string) => {
        setOutputValue(data)
    }

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            const response = await fetch(`http://localhost:8000/api/v1/sentiment-analysis?text=${inputValue}`, {
                method: "POST",
            })
            const json = await response.json()
            setOutputValue(`감정: ${json.label}\n확률: ${json.score}`)
        } catch (error) {
            console.log(error)
        } finally {
            setIsSubmitting(false);
        }
    }


    const handleClear = () => {
        setInputValue("");
        setOutputValue("");
    }

    return (
        <main>
            <div id="wrap" className="w-[1080px] mx-auto">
                <h2 className="text-center mb-[30px]">AI 감정 분석 웹앱</h2>
                <p className="text-[14px] mb-[16px]">
                    Hugging Face Transformer 모델 기반 감정 분석
                </p>
                <div className="put__rc grid grid-cols-2 gap-[10px]">
                    {putArray.map((e, i) => (
                        <PutColumn
                            key={i}
                            ele={e.ele}
                            label={e.label}
                            value={e.ele === 'input' ? inputValue : outputValue}
                            onChange={inputChange}
                            onSubmit={e.ele === 'input' ? handleSubmit : undefined}
                            onClear={e.ele === 'input' ? handleClear : undefined}
                            isSubmitting={isSubmitting}
                        />
                    ))}
                </div>
            </div>
        </main>
    )
}
