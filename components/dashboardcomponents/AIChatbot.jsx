"use client";

import { useState, useRef, useEffect } from "react";

const SendIcon = () => (
  <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

const BotIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/>
    <path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/>
  </svg>
);

const SYSTEM_PROMPT = `You are a supportive AI life coach assistant for WANAC (We Are Not A Club), a veteran and personal development platform.
You help users reflect on their progress, set goals, and grow across all areas of life: health, career, relationships, finances, personal growth, recreation, spirituality, and community.
Keep responses concise (2-4 sentences), warm, and actionable. Ask follow-up questions to understand the user better when appropriate.`;

export default function AIChatbot({ lifeScoreContext = "" }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hey! I'm your AI life coach. I can help you reflect on your progress, set goals, or work through any challenges. What's on your mind today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);
    setError("");

    // Build contextual message — inject life score data on first real user message
    const isFirstUserMessage = messages.filter((m) => m.role === "user").length === 0;
    const fullMessage = [
      SYSTEM_PROMPT,
      lifeScoreContext && isFirstUserMessage
        ? `\nUser's current life score data: ${lifeScoreContext}`
        : "",
      `\nUser: ${text}`,
    ]
      .filter(Boolean)
      .join("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: fullMessage }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to get a response.");
      }
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      // Remove the user message on hard failure so they can retry
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="w-full flex flex-col" style={{ height: 420 }}>
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 mb-3 border-b border-gray-100">
        <div className="w-7 h-7 rounded-full bg-[#002147] flex items-center justify-center text-white">
          <BotIcon />
        </div>
        <div>
          <p className="text-xs font-bold text-gray-900">AI Life Coach</p>
          <p className="text-[10px] text-green-500 font-medium">● Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-6 h-6 rounded-full bg-[#002147] flex items-center justify-center text-white shrink-0 mt-0.5">
                <BotIcon />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[12px] leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#002147] text-white rounded-tr-sm"
                  : "bg-gray-100 text-gray-800 rounded-tl-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex gap-2 justify-start">
            <div className="w-6 h-6 rounded-full bg-[#002147] flex items-center justify-center text-white shrink-0">
              <BotIcon />
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1 items-center">
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {error && (
          <p className="text-[10px] text-red-500 text-center py-1">{error}</p>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={sendMessage}
        className="flex gap-2 pt-3 border-t border-gray-100 mt-3"
      >
        <input
          ref={inputRef}
          className="flex-1 border-2 border-gray-200 rounded-xl px-3 py-2 text-[12px] focus:outline-none focus:border-[#002147] transition-colors bg-white placeholder-gray-400"
          placeholder="Ask your AI life coach…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="bg-[#002147] text-white px-3.5 py-2 rounded-xl hover:bg-[#003875] disabled:opacity-40 transition-colors flex items-center justify-center"
          aria-label="Send message"
        >
          <SendIcon />
        </button>
      </form>
    </div>
  );
}
