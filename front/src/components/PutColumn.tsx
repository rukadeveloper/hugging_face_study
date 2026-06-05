"use client";

interface PutColumnProps {
    ele: 'input' | 'output';
    label: string;
    value: string | any;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onSubmit?: () => void;
    onClear?: () => void;
    isSubmitting: boolean;
}

export default function PutColumn({
    ele,
    label,
    value,
    onChange,
    onSubmit,
    onClear,
    isSubmitting,
}: PutColumnProps) {
    return (
        <div className="new__input w-full">
            <div id="inputArea" className="w-full border border-[#e7e7e9] rounded-[5px] overflow-auto flex flex-col">
                <div id="inputAreaTitle" className="w-[80px] h-[30px] border-r border-b border-[#e7e7e9] flex justify-center items-center gap-[6px]">
                    <span className="text-[12px]">{ele === 'input' ? 'Input' : 'Output'}</span>
                </div>
                <textarea
                    id={ele}
                    className="w-full flex-1 p-[20px] border-none outline-none resize-none"
                    placeholder={`Enter ${label}...`}
                    value={typeof value === 'string' ? value : ''}
                    onChange={onChange}
                    disabled={ele === 'output'}
                />
            </div>
            {ele === 'input' && (
                <div className="flex gap-[10px] mt-[10px]">
                    <button
                        onClick={onSubmit}
                        disabled={isSubmitting}
                        className="flex-1 bg-blue-600 text-white py-[10px] rounded-[5px] font-semibold hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {isSubmitting ? 'Processing...' : 'Submit'}
                    </button>
                    <button
                        onClick={onClear}
                        className="flex-1 bg-gray-300 text-gray-700 py-[10px] rounded-[5px] font-semibold hover:bg-gray-400"
                    >
                        Clear
                    </button>
                </div>
            )}
        </div>
    );
}
