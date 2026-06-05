"use client";

import { useState } from "react";
import OutputBar from "@/components/OutputBar";

export default function EmotionCsvPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [output, setOutput] = useState("");
    const [fileUrl, setFileUrl] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.name.endsWith(".csv")) {
            setFile(selectedFile);
        } else {
            alert("Please select a CSV file");
        }
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file");
            return;
        }

        setIsLoading(true);
        try {
            // Upload file
            const formData = new FormData();
            formData.append("file", file);

            const uploadResponse = await fetch(
                "http://localhost:8000/api/v1/file-upload",
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!uploadResponse.ok) {
                throw new Error("Upload failed");
            }

            const uploadData = await uploadResponse.json();
            const fileName = uploadData.filename;
            setFileUrl(fileName);

            // Analyze CSV
            const analysisResponse = await fetch(
                "http://localhost:8000/api/v1/csv_chart",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ file_path: fileName }),
                }
            );

            if (!analysisResponse.ok) {
                throw new Error("Analysis failed");
            }

            const analysisData = await analysisResponse.json();
            setOutput(
                `분석 완료: 총 ${analysisData.total}개 항목\n파일: ${analysisData.file}`
            );
        } catch (error) {
            setOutput(`Error: ${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main>
            <div id="wrap" className="w-[1080px] mx-auto">
                <h2 className="text-center mb-[30px]">CSV 감정 분석</h2>
                <p className="text-[14px] mb-[16px]">
                    CSV 파일의 감정을 한 번에 분석합니다
                </p>
                <div className="grid grid-cols-2 gap-[10px]">
                    <div className="file-upload-section">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileChange}
                                className="w-full"
                            />
                            {file && (
                                <p className="text-green-600 mt-4">
                                    선택된 파일: {file.name}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={handleUpload}
                            disabled={!file || isLoading}
                            className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
                        >
                            {isLoading ? "분석 중..." : "분석 시작"}
                        </button>
                    </div>
                    <OutputBar
                        content={output}
                        title="분석 결과"
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </main>
    );
}
