"use client"

import AudioComponent from "@/components/AudioComponent";
import AudioResponse from "@/components/AudioResponse";
import CommonPut from "@/components/CommonPut";
import { useState } from "react";

export default function SoundAssistantPage() {
    const [audioToTextValue, setAudioToTextValue] = useState<string>("")
    const [questionValue, setQuestionValue] = useState<string>("");
    const [answerValue, setAnswerValue] = useState<string>("");
    const [isTransforming, setIsTransforming] = useState<boolean>(false);

    const changeAudioToText = (data: string) => {
        setAudioToTextValue(data);
    }

    const changeTransforming = (data: boolean) => {
        setIsTransforming(data);
    }

    const changeQuestionValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuestionValue(e.target.value)
    }

    const changeAnswerValue = (data: string) => {
        setAnswerValue(data)
    }

    const quest = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/text_generation?question=${questionValue}`, {
                method: "POST"
            })
            const data = await response.json()
            if (data.status === "success") {
                changeAnswerValue(data.message)
                console.log(data.message)
            } else {
                console.error(data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <main>
            <div id="wrap" className="w-[1080px] mx-auto">
                <h2 className="mt-[30px] mb-[20px]">AI 음성 비서</h2>
                <div id="gra__block" className="grid grid-cols-2 gap-[10px]">
                    <AudioComponent changeAudioToText={changeAudioToText} changeTransforming={changeTransforming} isTransforming={isTransforming} />
                    <CommonPut put={"output"} label={"텍스트 변환"} height={110} highHeight={150} hasButton={"텍스트 변환"} value={audioToTextValue} isTransforming={isTransforming} />
                    <CommonPut put={"input"} label={"question"} height={40} hasButton={"질문하기"} value={questionValue} changeValue={changeQuestionValue} onSubmit={quest} />
                    <CommonPut put={"output"} label={"answer"} height={100} hasButton={"답변 음성 변환"} value={answerValue} />
                </div>
                <div className="mt-[10px]">
                    <AudioResponse />
                </div>
            </div>
        </main>
    )
}
