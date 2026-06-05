"use client";

interface OutputBarProps {
    content: string;
    title?: string;
    isLoading?: boolean;
}

export default function OutputBar({
    content,
    title = "Output",
    isLoading = false,
}: OutputBarProps) {
    return (
        <div className="output-bar w-full border border-gray-300 rounded-lg overflow-hidden">
            <div className="output-header bg-gray-100 px-4 py-2 border-b border-gray-300">
                <h3 className="text-sm font-semibold">{title}</h3>
            </div>
            <div className="output-content p-4 bg-white min-h-24 max-h-96 overflow-y-auto">
                {isLoading ? (
                    <p className="text-gray-500 italic">Loading...</p>
                ) : content ? (
                    <p className="text-gray-800 whitespace-pre-wrap">{content}</p>
                ) : (
                    <p className="text-gray-400 italic">No output yet</p>
                )}
            </div>
        </div>
    );
}
