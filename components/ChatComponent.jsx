"use client";

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, X, Send } from 'lucide-react';

const AI_AVATAR = (
  <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-300 rounded-full mr-2">
    🤖
  </span>
);
const USER_AVATAR = (
  <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-400 text-white rounded-full ml-2">
    🧑
  </span>
);

function LoadingDots() {
  return (
    <span className="inline-block w-6 text-gray-400">
      <span className="animate-bounce">.</span>
      <span className="animate-bounce delay-75">.</span>
      <span className="animate-bounce delay-150">.</span>
    </span>
  );
}

export default function ChatComponent({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  
  const toggleChat = () => setIsOpen(!isOpen);

  // Load chat history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("wanacChatHistory");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    localStorage.setItem("wanacChatHistory", JSON.stringify(messages));
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input };
    setMessages((msgs) => [...msgs, userMessage]);
    setLoading(true);

    try {
      const { data } = await axios.post(
        "/api/chat",
        {
          message: input,
          userId: user?.id,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      setMessages((msgs) => [
        ...msgs,
        { sender: "ai", text: data.reply || "No response." },
      ]);
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        { sender: "ai", text: "Error: " + (err?.response?.data?.error || err.message) },
      ]);
    }
    setInput("");
    setLoading(false);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button 
        onClick={toggleChat}
        className="bg-orange-500 hover:bg-orange-600 text-white rounded-full p-3 shadow-lg"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
      
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white rounded-lg shadow-xl flex flex-col overflow-hidden border border-gray-200">
          <div className="bg-[#002147] text-white p-3 flex justify-between items-center">
            <h3 className="font-medium">Chat with us</h3>
            <button onClick={toggleChat} className="text-white hover:text-gray-200">
              <X size={18} />
            </button>
          </div>
          
          <div ref={chatContainerRef} className="flex-1 p-3 overflow-y-auto max-h-80 space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-end ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "ai" && AI_AVATAR}
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm text-base break-words ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
                {msg.sender === "user" && USER_AVATAR}
              </div>
            ))}
            {loading && (
              <div className="flex items-end justify-start">
                {AI_AVATAR}
                <div className="bg-gray-100 text-gray-400 px-4 py-2 rounded-2xl shadow-sm text-base">
                  <LoadingDots />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="border-t border-gray-200 p-3 flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
              disabled={loading}
            />
            <button 
              type="submit"
              className="bg-orange-500 text-white px-4 rounded-r-lg hover:bg-orange-600 flex items-center justify-center"
              disabled={!input.trim() || loading}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}