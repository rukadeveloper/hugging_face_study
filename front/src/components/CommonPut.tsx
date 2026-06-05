"use client";

interface CommonPutProps {
    put: 'input' | 'output';
    label: string;
    height: number;
    highHeight?: number;
    hasButton?: string | false;
    value: string;
    isTransforming?: boolean;
    changeValue?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit?: () => void;
}

export default function CommonPut({
    put,
    label,
    height,
    highHeight = height + 50,
    hasButton,
    value,
    isTransforming = false,
    changeValue,
    onSubmit,
}: CommonPutProps) {
    const isInput = put === 'input';
    const currentHeight = isTransforming ? highHeight : height;

    return (
        <div className="common__put w-full">
            <div className="w-full border border-[#e7e7e9] rounded-[5px] overflow-auto flex flex-col">
                <div className="w-[80px] h-[30px] border-r border-b border-[#e7e7e9] flex justify-center items-center gap-[6px]">
                    <span className="text-[12px]">{put === 'input' ? 'Input' : 'Output'}</span>
                </div>
                <div style={{ height: `${currentHeight}px` }} className="flex-1 transition-all duration-300">
                    <input
                        type="text"
                        value={value}
                        onChange={changeValue}
                        placeholder={`${label}를 입력하세요...`}
                        disabled={!isInput}
                        className="w-full h-full p-[20px] border-none outline-none bg-white disabled:bg-gray-50 resize-none"
                    />
                </div>
            </div>
            {isInput && hasButton && (
                <button
                    onClick={onSubmit || (() => {})}
                    className="w-full font-[600] py-[10px] bg-[#e4e4e6] rounded-[5px] cursor-pointer mt-[30px] hover:bg-[#d4d4d6]"
                >
                    {hasButton}
                </button>
            )}
            {!isInput && hasButton && (
                <button
                    onClick={onSubmit || (() => {})}
                    className="w-full font-[600] py-[10px] bg-[#e4e4e6] rounded-[5px] cursor-pointer mt-[30px] hover:bg-[#d4d4d6]"
                >
                    {hasButton}
                </button>
            )}
        </div>
    );
}
