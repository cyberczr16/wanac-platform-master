"use client";
import { useState, useRef, useEffect } from "react";
import { Send, User, Bot } from "lucide-react";

export default function ChatComponentV2({ user, onSendMessage, loading, messages: externalMessages }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(externalMessages || []);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (externalMessages) setMessages(externalMessages);
  }, [externalMessages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMsg = { sender: user?.role || "user", text: input, timestamp: new Date().toISOString() };
    setMessages((msgs) => [...msgs, newMsg]);
    setInput("");
    if (onSendMessage) await onSendMessage(input);
  };

  return (
    <div className="flex flex-col w-full h-[500px] bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="px-4 py-3 border-b bg-gradient-to-r from-blue-50 to-orange-50 flex items-center gap-2 rounded-t-xl">
        <Bot className="text-orange-500" size={22} />
        <span className="font-semibold text-lg text-gray-800">Chat</span>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-gray-400 text-center mt-10">No messages yet. Start the conversation!</div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === (user?.role || "user") ? "justify-end" : "justify-start"}`}
          >
            {msg.sender !== (user?.role || "user") && (
              <span className="inline-flex items-center justify-center w-8 h-8 bg-orange-200 text-orange-700 rounded-full mr-2">
                <Bot size={18} />
              </span>
            )}
            <div
              className={`max-w-[70%] px-4 py-2 rounded-2xl shadow text-base break-words ${
                msg.sender === (user?.role || "user")
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
            {msg.sender === (user?.role || "user") && (
              <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-400 text-white rounded-full ml-2">
                <User size={18} />
              </span>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-end justify-start">
            <span className="inline-flex items-center justify-center w-8 h-8 bg-orange-200 text-orange-700 rounded-full mr-2">
              <Bot size={18} />
            </span>
            <div className="bg-white border border-gray-200 text-gray-400 px-4 py-2 rounded-2xl shadow text-base">
              <span className="inline-block w-6 animate-pulse">...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* Input */}
      <form
        onSubmit={e => { e.preventDefault(); handleSend(); }}
        className="border-t px-4 py-3 bg-white flex gap-2 items-center rounded-b-xl"
      >
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !loading && handleSend()}
          placeholder="Type your message..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center justify-center"
          disabled={!input.trim() || loading}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
} 