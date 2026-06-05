import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          HuggingFace AI Assistant
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/sentiment-analysis"
            className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer"
          >
            <div className="text-2xl font-bold text-blue-600 mb-2">📊</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Sentiment Analysis
            </h2>
            <p className="text-gray-600">
              Analyze the sentiment of text and CSV files using advanced NLP models.
            </p>
          </Link>

          <Link
            href="/sound-assistant"
            className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer"
          >
            <div className="text-2xl font-bold text-blue-600 mb-2">🎙️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Sound Assistant
            </h2>
            <p className="text-gray-600">
              Convert audio to text, generate responses, and convert back to speech.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
