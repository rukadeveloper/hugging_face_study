"use client";

interface CommonPutProps {
  put: string;
  label: string;
  height: string;
  highHeight: string;
  hasButton: boolean;
  value: string;
  isTransforming: boolean;
  changeValue: (value: string) => void;
  onSubmit?: () => void;
  isSubmitting: boolean;
}

export default function CommonPut({
  put,
  label,
  height,
  highHeight,
  hasButton,
  value,
  isTransforming,
  changeValue,
  onSubmit,
  isSubmitting,
}: CommonPutProps) {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{put}</h2>
      <textarea
        value={value}
        onChange={(e) => changeValue(e.target.value)}
        placeholder={`Enter ${label.toLowerCase()}...`}
        className={`w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
          isTransforming ? highHeight : height
        }`}
      />
      {hasButton && (
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isSubmitting ? "Processing..." : `Convert ${put}`}
        </button>
      )}
    </div>
  );
}
