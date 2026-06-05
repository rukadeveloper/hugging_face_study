"use client";

interface ChatMessageProps {
    text: string;
    sender: 'user' | 'bot' | 'assistant';
    timestamp?: string;
    isLoading?: boolean;
}

export default function ChatMessage({
    text,
    sender,
    timestamp,
    isLoading = false,
}: ChatMessageProps) {
    const isUserMessage = sender === 'user';

    return (
        <div className={`chat-message-wrapper mb-4 flex ${isUserMessage ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`chat-message max-w-xs px-4 py-2 rounded-lg ${
                    isUserMessage
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}
            >
                {isLoading ? (
                    <div className="flex gap-2">
                        <div className="animate-bounce">.</div>
                        <div className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</div>
                        <div className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</div>
                    </div>
                ) : (
                    <p className="text-sm whitespace-pre-wrap">{text}</p>
                )}
                {timestamp && (
                    <div className={`text-xs mt-1 ${isUserMessage ? 'text-blue-100' : 'text-gray-600'}`}>
                        {timestamp}
                    </div>
                )}
            </div>
        </div>
    );
}
