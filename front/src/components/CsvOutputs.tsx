"use client";

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

interface CsvOutputsProps {
  data: any;
}

export default function CsvOutputs({ data }: CsvOutputsProps) {
  const chartData = data?.chart_data || [];

  const COLORS = {
    POSITIVE: "#10b981",
    NEGATIVE: "#ef4444",
  };

  const renderLabel = ({ name, percentage }: any) => {
    return `${name} ${percentage}%`;
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Sentiment Analysis Results</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Sentiment Distribution</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry: any) => (
                    <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-600">No data available</p>
          )}
        </div>

        {/* Statistics */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Summary</h3>
          <div className="space-y-4">
            {chartData.map((item: any) => (
              <div key={item.name} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-semibold text-gray-700">{item.name}</span>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-800">{item.value}</div>
                  <div className="text-sm text-gray-600">{item.percentage}%</div>
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-gray-200 mt-6">
              <h4 className="font-bold text-gray-800 mb-3">Most Positive Review</h4>
              {data?.most_positive_review ? (
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <p className="text-gray-700 text-sm mb-1">
                    {data.most_positive_review[0]}
                  </p>
                  <p className="text-green-600 text-sm font-semibold">
                    Score: {(data.most_positive_review[1] * 100).toFixed(1)}%
                  </p>
                </div>
              ) : (
                <p className="text-gray-600 text-sm">No positive reviews</p>
              )}
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h4 className="font-bold text-gray-800 mb-3">Most Negative Review</h4>
              {data?.most_negative_review ? (
                <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                  <p className="text-gray-700 text-sm mb-1">
                    {data.most_negative_review[0]}
                  </p>
                  <p className="text-red-600 text-sm font-semibold">
                    Score: {(data.most_negative_review[1] * 100).toFixed(1)}%
                  </p>
                </div>
              ) : (
                <p className="text-gray-600 text-sm">No negative reviews</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
