"use client";

import React from "react";

interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp?: string;
}

interface ChatBoxProps {
    messages?: ChatMessage[];
    onSendMessage?: (message: string) => void;
    isLoading?: boolean;
}

export default function ChatBox({
    messages = [],
    onSendMessage,
    isLoading = false,
}: ChatBoxProps) {
    const [inputText, setInputText] = React.useState("");

    const handleSend = () => {
        if (inputText.trim()) {
            onSendMessage?.(inputText);
            setInputText("");
        }
    };

    return (
        <div className="chat-box flex flex-col h-96 border border-gray-300 rounded-lg overflow-hidden">
            <div className="chat-messages flex-1 overflow-y-auto p-4 bg-white">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`mb-4 ${
                            msg.sender === 'user' ? 'text-right' : 'text-left'
                        }`}
                    >
                        <div
                            className={`inline-block px-3 py-2 rounded-lg ${
                                msg.sender === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-black'
                            }`}
                        >
                            {msg.text}
                        </div>
                        {msg.timestamp && (
                            <div className="text-xs text-gray-500 mt-1">
                                {msg.timestamp}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="chat-input flex gap-2 p-4 border-t border-gray-300">
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && !isLoading) {
                            handleSend();
                        }
                    }}
                    placeholder="Type a message..."
                    disabled={isLoading}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button
                    onClick={handleSend}
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                    {isLoading ? '...' : 'Send'}
                </button>
            </div>
        </div>
    );
}
