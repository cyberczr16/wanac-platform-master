"use client";
import Sidebar from '../../../../components/dashboardcomponents/sidebar';
import ClientTopbar from '../../../../components/dashboardcomponents/clienttopbar';
import ChatComponent from '../../../../components/ChatComponent';
import { useState, useEffect } from 'react';

export default function ClientMessagesPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('wanacUser');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        setUser(null);
      }
    }
  }, []);

  return (
    <div className="h-screen flex bg-white font-body text-foreground">
      {/* Sidebar */}
      <Sidebar />
      {/* Main Area */}
      <div className="flex-1 flex flex-col h-full transition-all duration-300">
        {/* Top Bar */}
        <ClientTopbar user={user || { name: 'Client' }} />
        {/* Main Content */}
        <main className="flex-1 h-0 overflow-y-auto px-2 md:px-8 py-6 bg-muted flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-6 text-center">Messages</h1>
          <div className="w-full max-w-2xl">
            <ChatComponent user={user || { name: 'Client' }} />
          </div>
        </main>
      </div>
    </div>
  );
} 