"use client";

interface PutBoxProps {
    label: string;
    ele: 'input' | 'output';
    value: string;
    onChange: (data: string) => void;
    textColor?: string;
    isSubmitting: boolean;
    onSubmit?: () => void;
    onClear?: () => void;
}

export default function PutBox({
    label,
    ele,
    value,
    onChange,
    textColor = "text-black",
    isSubmitting,
    onSubmit,
    onClear,
}: PutBoxProps) {
    return (
        <div className={`put-box ${ele}`}>
            <label className={`label ${textColor}`}>{label}</label>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={ele === 'output'}
                className="textarea-input w-full h-32 p-4 border border-gray-300 rounded-lg"
            />
            {ele === 'input' && (
                <div className="button-group flex gap-2 mt-2">
                    <button
                        onClick={onSubmit}
                        disabled={isSubmitting}
                        className="btn-submit px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {isSubmitting ? 'Processing...' : 'Submit'}
                    </button>
                    <button
                        onClick={onClear}
                        className="btn-clear px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                        Clear
                    </button>
                </div>
            )}
        </div>
    );
}
