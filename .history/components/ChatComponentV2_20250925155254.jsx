"use client";
import { useState, useRef, useEffect } from "react";
import { Bot, User, Send, Shield } from "lucide-react";
export default function ChatComponentV2({ user, onSendMessage, loading, messages: externalMessages }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(externalMessages || []);
  const [filterRole, setFilterRole] = useState("");
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
    const newMsg = {
      sender: user?.role || "user",
      name: user?.name || "You",
      text: input,
      timestamp: new Date().toISOString(),
    };
    setMessages((msgs) => [...msgs, newMsg]);
    setInput("");
    if (onSendMessage) await onSendMessage(input);
  };

  // Helper to get avatar/icon and color by role
  const getRoleAvatar = (role) => {
    switch (role) {
      case "admin":
        return <Shield className="text-purple-600" size={18} />;
      case "coach":
        return <User className="text-green-600" size={18} />;
      case "client":
        return <User className="text-blue-600" size={18} />;
      default:
        return <Bot className="text-orange-500" size={18} />;
    }
  };

  const getRoleBg = (role, isCurrentUser) => {
    if (isCurrentUser) return "bg-blue-500 text-white rounded-br-none";
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 border border-purple-200 rounded-bl-none";
      case "coach":
        return "bg-green-100 text-green-800 border border-green-200 rounded-bl-none";
      case "client":
        return "bg-blue-100 text-blue-800 border border-blue-200 rounded-bl-none";
      default:
        return "bg-white border border-gray-200 text-gray-800 rounded-bl-none";
    }
  };

  // Filter messages by role if selected
  const displayedMessages = filterRole
    ? messages.filter((msg) => msg.sender === filterRole)
    : messages;

  return (
    <div className="flex flex-col w-full h-[500px] bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="px-4 py-3 border-b bg-gradient-to-r from-blue-50 to-orange-50 flex items-center gap-2 rounded-t-xl justify-between">
        <div className="flex items-center gap-2">
          <Bot className="text-orange-500" size={22} />
          <span className="font-semibold text-lg text-gray-800">Chat</span>
        </div>
        {/* Role Filter */}
        <div className="flex gap-2 items-center">
          <label className="text-sm text-gray-600">Filter:</label>
          <select
            className="border border-gray-300 rounded px-2 py-1 text-sm"
            value={filterRole}
            onChange={e => setFilterRole(e.target.value)}
          >
            <option value="">All</option>
            <option value="admin">Admin</option>
            <option value="coach">Coach</option>
            <option value="client">Client</option>
          </select>
        </div>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
        {displayedMessages.length === 0 && (
          <div className="text-gray-400 text-center mt-10">No messages yet. Start the conversation!</div>
        )}
        {displayedMessages.map((msg, idx) => {
          const isCurrentUser = msg.sender === (user?.role || "user");
          return (
            <div
              key={idx}
              className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
            >
              {!isCurrentUser && (
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full mr-2 ${msg.sender === "admin" ? "bg-purple-200" : msg.sender === "coach" ? "bg-green-200" : msg.sender === "client" ? "bg-blue-200" : "bg-orange-200"}`}>
                  {getRoleAvatar(msg.sender)}
                </span>
              )}
              <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl shadow text-base break-words ${getRoleBg(msg.sender, isCurrentUser)}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-xs">
                    {msg.name || (isCurrentUser ? "You" : msg.sender.charAt(0).toUpperCase() + msg.sender.slice(1))}
                  </span>
                  <span className="text-[10px] text-gray-400">{msg.sender.charAt(0).toUpperCase() + msg.sender.slice(1)}</span>
                  <span className="text-[10px] text-gray-300 ml-2">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                {msg.text}
              </div>
              {isCurrentUser && (
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ml-2 bg-blue-400 text-white`}>
                  <User size={18} />
                </span>
              )}
            </div>
          );
        })}
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