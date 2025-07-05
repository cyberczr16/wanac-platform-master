"use client";

import { useState, useEffect } from "react";
import Sidebar from "../../../../../components/dashboardcomponents/sidebar";
import ClientTopbar from "../../../../../components/dashboardcomponents/clienttopbar";
import ChatComponent from "../../../../../components/ChatComponent";

export default function AIChatbotPage() {
  const [user, setUser] = useState(null);

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

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-white to-orange-50 font-serif">
      {/* Sidebar */}
      <Sidebar />
      {/* Main Area */}
      <div className="flex-1 flex flex-col h-full transition-all duration-300">
        {/* Top Bar */}
        <ClientTopbar user={user} />
        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-2 md:px-8 py-8">
          <div className="w-full max-w-2xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2 tracking-tight">AI Chatbot Assistant</h2>
              <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
                Get instant guidance and support from your AI assistant. Ask anything about your account, sessions, or how to use the platform!
              </p>
            </div>
            <section className="flex flex-col items-center justify-center">
              <div className="w-full">
                <ChatComponent user={user} />
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
