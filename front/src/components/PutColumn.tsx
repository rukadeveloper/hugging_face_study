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
                    className="w-full flex-1 p-[20px] border-none outline-none resize-none focus:outline-none"
                    placeholder={`Enter ${label}...`}
                    value={typeof value === 'string' ? value : ''}
                    onChange={onChange}
                    disabled={ele === 'output'}
                />
            </div>
            {ele === 'input' && (
                <div className="flex gap-[10px] mt-[30px]">
                    <button
                        onClick={onSubmit}
                        disabled={isSubmitting}
                        className="flex-1 font-[600] py-[10px] bg-[#f0f0f1] rounded-[5px] cursor-pointer hover:bg-[#e0e0e2] disabled:bg-gray-400"
                    >
                        {isSubmitting ? 'Processing...' : 'Submit'}
                    </button>
                    <button
                        onClick={onClear}
                        className="flex-1 font-[600] py-[10px] bg-[#e4e4e6] rounded-[5px] cursor-pointer hover:bg-[#d4d4d6]"
                    >
                        Clear
                    </button>
                </div>
            )}
        </div>
    );
}
