"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "../../../../components/dashboardcomponents/sidebar";
import ClientTopbar from "../../../../components/dashboardcomponents/clienttopbar";
import { FaRobot, FaPaperPlane, FaLightbulb, FaQuestionCircle } from "react-icons/fa";

export default function AIChatbotPage() {
  const [user, setUser] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I'm your AI Assistant. How can I help you today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const userData = localStorage.getItem("wanacUser");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = {
      sender: "user",
      text: input,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      const aiMessage = {
        sender: "ai",
        text: data.reply || data.error || "Sorry, I couldn't get a response.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "There was an error connecting to the AI service.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = [
    "How do I book a coaching session?",
    "What are my upcoming sessions?",
    "Tell me about the fireteam feature",
    "How can I track my progress?"
  ];

  const handleQuickPrompt = (prompt) => {
    setInput(prompt);
  };

  return (
    <div className="h-screen flex bg-white font-body">
      {/* Sidebar */}
      <Sidebar 
        className="w-56 bg-white border-r border-gray-200" 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
      />
      
      {/* Main Area */}
      <div className="flex-1 flex flex-col h-full transition-all duration-300">
        {/* Top Bar */}
        <ClientTopbar user={user} />
        
        {/* Main Content */}
        <main className="flex-1 h-0 overflow-y-auto px-4 md:px-6 py-3 bg-gray-50">
          <div className="max-w-7xl mx-auto h-full">
            <div className="flex flex-col lg:flex-row gap-4 h-full">
              {/* Main Content */}
              <div className="flex-1 flex flex-col space-y-3 min-h-0">
                {/* Header Section */}
                <section className="bg-gradient-to-br from-[#002147] to-[#003875] rounded-xl p-4 shadow-lg relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <img 
                      src="/veterancommunity.png" 
                      alt="Background" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="relative z-10 flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-full">
                      <FaRobot className="text-white text-xl" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-white mb-1">AI Assistant</h1>
                      <p className="text-white/90 text-xs">Get instant guidance and support 24/7</p>
                    </div>
                  </div>
                </section>

                {/* Quick Prompts */}
                <section className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
                  <p className="text-[10px] text-gray-600 mb-2 flex items-center gap-1.5">
                    <FaLightbulb className="text-orange-500" size={10} />
                    Quick prompts to get started:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {quickPrompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuickPrompt(prompt)}
                        className="text-[10px] px-2.5 py-1.5 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-all text-gray-700 hover:text-[#002147] font-medium"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Chat Container */}
                <section className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col min-h-0">
                  {/* Chat Header */}
                  <div className="flex items-center justify-between px-3 py-2.5 bg-gradient-to-r from-[#002147] to-[#003875] text-white border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                        <FaRobot className="text-sm" />
                      </div>
                      <span className="font-semibold text-sm">AI Assistant</span>
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    </div>
                  {user && user.name && (
                      <div className="flex items-center gap-1.5">
                        <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-[10px]">
                        {user.name[0]}
                      </span>
                        <span className="text-[10px] text-white/90">{user.name}</span>
                      </div>
                  )}
                </div>

                {/* Messages */}
                  <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2 bg-gray-50">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.sender === "ai" && (
                        <div className="flex flex-col items-center mr-2">
                            <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#002147] to-[#003875] flex items-center justify-center shadow-sm">
                              <FaRobot className="text-white text-[10px]" />
                            </span>
                        </div>
                      )}
                      <div
                          className={`max-w-[75%] px-3 py-2 rounded-lg text-[11px] shadow-sm whitespace-pre-line ${
                          msg.sender === "user"
                              ? "bg-orange-500 text-white rounded-br-none"
                              : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                        }`}
                      >
                        {msg.text}
                          <div className={`text-[8px] mt-1 ${msg.sender === "user" ? "text-white/70" : "text-gray-400"}`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      {msg.sender === "user" && user && (
                        <div className="flex flex-col items-center ml-2">
                            <span className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center shadow-sm text-orange-600 font-bold text-[10px]">
                              {user.name ? user.name[0] : "U"}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white text-gray-800 shadow-sm border border-gray-200">
                          <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 bg-[#002147] rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-[#002147] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-1.5 h-1.5 bg-[#002147] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-[10px] text-gray-600">AI is typing...</span>
                        </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
                <form
                    className="flex gap-2 px-3 py-2.5 bg-white border-t border-gray-200"
                  onSubmit={e => {
                    e.preventDefault();
                    handleSend();
                  }}
                >
                  <textarea
                      className="flex-1 resize-none rounded-lg border-2 border-gray-300 px-3 py-2 focus:outline-none focus:border-[#002147] focus:ring-2 focus:ring-[#002147]/20 transition text-[11px] bg-white shadow-sm min-h-[36px] max-h-[80px]"
                    placeholder="Type your message..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleInputKeyDown}
                    rows={1}
                    disabled={loading}
                  />
                  <button
                    type="submit"
                      className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 text-[11px]"
                    disabled={loading || !input.trim()}
                  >
                      <FaPaperPlane size={10} />
                    Send
                  </button>
                </form>
                </section>
              </div>
              
              {/* Right Sidebar */}
              <aside className="lg:w-64 space-y-3">
                {/* Tips Card */}
                <div className="bg-gradient-to-br from-[#002147] to-[#003875] rounded-xl shadow-sm p-3 text-white">
                  <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                    <FaLightbulb />
                    How to Use
                  </h3>
                  <ul className="space-y-2 text-[10px] text-white/90">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500 mt-0.5">•</span>
                      <span>Ask questions about your account and sessions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500 mt-0.5">•</span>
                      <span>Get guidance on using platform features</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500 mt-0.5">•</span>
                      <span>Request help with tasks and goals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500 mt-0.5">•</span>
                      <span>Get instant 24/7 support</span>
                    </li>
                  </ul>
                </div>

                {/* FAQ Card */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-3">
                  <h3 className="text-sm font-semibold text-[#002147] mb-3 flex items-center gap-1.5">
                    <FaQuestionCircle className="text-orange-500" />
                    Common Topics
                  </h3>
                  <div className="space-y-2">
                    <div className="p-2 bg-blue-50 rounded text-[10px] text-gray-700">
                      <strong>Sessions:</strong> Book, reschedule, or view upcoming sessions
                    </div>
                    <div className="p-2 bg-green-50 rounded text-[10px] text-gray-700">
                      <strong>Fireteam:</strong> Join groups and collaborate
                    </div>
                    <div className="p-2 bg-yellow-50 rounded text-[10px] text-gray-700">
                      <strong>Progress:</strong> Track life scores and journal entries
                    </div>
                    <div className="p-2 bg-orange-50 rounded text-[10px] text-gray-700">
                      <strong>Account:</strong> Update profile and preferences
                    </div>
                  </div>
                </div>

                {/* Stats Card */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-3">
                  <h3 className="text-sm font-semibold text-[#002147] mb-3">Chat Stats</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                      <span className="text-[10px] font-medium text-gray-700">Messages</span>
                      <span className="text-sm font-bold text-[#002147]">{messages.length}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span className="text-[10px] font-medium text-gray-700">Status</span>
                      <span className="text-[10px] font-bold text-green-600 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        Online
                      </span>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
