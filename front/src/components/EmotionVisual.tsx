"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface EmotionVisualProps {
  results: any;
}

const EMOTION_COLORS: { [key: string]: string } = {
  joy: "#FFD700",
  sadness: "#4169E1",
  anger: "#DC143C",
  fear: "#9932CC",
  surprise: "#FF69B4",
  neutral: "#808080",
};

export default function EmotionVisual({ results }: EmotionVisualProps) {
  if (!results) return null;

  // Prepare data for visualization
  const emotionCounts: { [key: string]: number } = {};
  const emotionScores: { emotion: string; score: number }[] = [];

  if (results.results && Array.isArray(results.results)) {
    results.results.forEach((item: any) => {
      const emotion = item[1]?.label?.toLowerCase() || "neutral";
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;

      if (emotionScores.find((e) => e.emotion === emotion)) {
        const existing = emotionScores.find((e) => e.emotion === emotion)!;
        existing.score = (existing.score + (item[1]?.score || 0)) / 2;
      } else {
        emotionScores.push({
          emotion,
          score: item[1]?.score || 0,
        });
      }
    });
  } else if (results.chart_data) {
    results.chart_data.forEach((item: any) => {
      emotionCounts[item.name.toLowerCase()] = item.value;
      emotionScores.push({
        emotion: item.name.toLowerCase(),
        score: item.percentage / 100,
      });
    });
  }

  const pieData = Object.entries(emotionCounts).map(([emotion, count]) => ({
    name: emotion.charAt(0).toUpperCase() + emotion.slice(1),
    value: count,
  }));

  const barData = emotionScores.map((item) => ({
    ...item,
    score: Math.round(item.score * 100),
  }));

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Emotion Analysis Results
      </h2>

      {/* Pie Chart */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Emotion Distribution
        </h3>
        {pieData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry) => (
                  <Cell
                    key={`cell-${entry.name}`}
                    fill={
                      EMOTION_COLORS[entry.name.toLowerCase()] ||
                      EMOTION_COLORS.neutral
                    }
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-600">No emotion data available</p>
        )}
      </div>

      {/* Bar Chart */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Average Emotion Score
        </h3>
        {barData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="emotion" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-600">No emotion data available</p>
        )}
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(emotionCounts).map(([emotion, count]) => (
          <div
            key={emotion}
            className="bg-gray-50 p-4 rounded-lg border-l-4"
            style={{
              borderColor: EMOTION_COLORS[emotion] || EMOTION_COLORS.neutral,
            }}
          >
            <div className="text-2xl font-bold text-gray-800">{count}</div>
            <div className="text-sm text-gray-600 capitalize">
              {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
