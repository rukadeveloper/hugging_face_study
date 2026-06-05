"use client";

import { useState } from "react";

interface ImageUrlBoxProps {
    onImageLoad?: (url: string) => void;
    label?: string;
}

export default function ImageUrlBox({
    onImageLoad,
    label = "Image URL",
}: ImageUrlBoxProps) {
    const [url, setUrl] = useState("");
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState("");

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newUrl = e.target.value;
        setUrl(newUrl);
        setError("");
    };

    const handleLoadImage = () => {
        if (!url.trim()) {
            setError("Please enter an image URL");
            return;
        }

        try {
            new URL(url); // Validate URL
            setPreview(url);
            onImageLoad?.(url);
        } catch {
            setError("Invalid URL format");
        }
    };

    return (
        <div className="image-url-box w-full border border-gray-300 rounded-lg p-4">
            <label className="block text-sm font-semibold mb-2">{label}</label>
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={url}
                    onChange={handleUrlChange}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button
                    onClick={handleLoadImage}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Load
                </button>
            </div>
            {error && <div className="text-red-600 text-sm mb-4">{error}</div>}
            {preview && (
                <div className="image-preview mt-4">
                    <img
                        src={preview}
                        alt="Preview"
                        className="max-w-full max-h-64 rounded border border-gray-300"
                        onError={() => setError("Failed to load image")}
                    />
                </div>
            )}
        </div>
    );
}
