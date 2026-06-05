"use client";

import { useState } from "@/app/multi_emotion/page";

interface Output {
    text: string;
    label: string;
    score: number;
}

interface OutputColumnProps {
    outputs?: Output[];
}

export default function OutputColumn({ outputs = [] }: OutputColumnProps) {
    return (
        <div className="new__output w-full">
            <div id="outputArea" className="w-full border border-[#e7e7e9] rounded-[5px] overflow-auto flex flex-col">
                <div id="outputAreaTitle" className="w-[80px] h-[30px] border-r border-b border-[#e7e7e9] flex justify-center items-center gap-[6px]">
                    <span className="text-[12px]">Output</span>
                </div>
                {outputs && outputs.length > 0 ? (
                    <div id="output" className="flex flex-col pb-[50px] pt-[20px] px-[20px]">
                        <table className="border border-[#e7e7e7]">
                            <thead>
                                <tr>
                                    <td className="pl-[10px] border border-[#e7e7e9] py-[10px]">문장</td>
                                    <td className="pl-[10px] border border-[#e7e7e9] py-[10px]">감정</td>
                                    <td className="pl-[10px] border border-[#e7e7e9] py-[10px]">확률</td>
                                </tr>
                            </thead>
                            <tbody>
                                {outputs.map((output: Output, index: number) => (
                                    <tr key={index}>
                                        <td className="pl-[10px] border border-[#e7e7e9] py-[10px]">{output.text}</td>
                                        <td className="pl-[10px] border border-[#e7e7e9] py-[10px]">{output.label}</td>
                                        <td className="pl-[10px] border border-[#e7e7e9] py-[10px]">{(output.score * 100).toFixed(1)}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div id="output" className="flex flex-col pb-[50px] pt-[20px]">
                        <h2 className="text-[19px] text-center mb-[20px]">No output</h2>
                    </div>
                )}
            </div>
        </div>
    );
}
