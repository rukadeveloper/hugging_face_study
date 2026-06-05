"use client";

interface OutputColumnProps {
  results: any;
}

export default function OutputColumn({ results }: OutputColumnProps) {
  if (!results?.results) return null;

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Sentiment Results ({results.total})
      </h3>
      <div className="max-h-96 overflow-y-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2 text-left">
                Text
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Sentiment
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Score
              </th>
            </tr>
          </thead>
          <tbody>
            {results.results.map((item: any, index: number) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 break-words">
                  {item[0]}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      item[1].label === "POSITIVE"
                        ? "bg-green-100 text-green-800"
                        : item[1].label === "NEGATIVE"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {item[1].label}
                  </span>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {(item[1].score * 100).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
