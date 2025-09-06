'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../../../components/dashboardcomponents/sidebar';
import ClientTopbar from '../../../../components/dashboardcomponents/clienttopbar';
import DashboardSidebar from '../../../../components/dashboardcomponents/DashboardSidebar';
import AIChatbot from '../../../../components/dashboardcomponents/AIChatbot';

// Mock data for insights
const mockInsights = [
  {
    id: 1,
    title: 'Boost Your Productivity',
    description: 'Try the Pomodoro technique to stay focused and take regular breaks for better results.',
    date: '2024-06-01',
  },
  {
    id: 2,
    title: 'Wellness Tip',
    description: 'Remember to take a few minutes each day for mindful breathing to reduce stress.',
    date: '2024-06-02',
  },
  {
    id: 3,
    title: 'AI Suggestion',
    description: 'Based on your recent activity, consider setting a new weekly goal to track your progress.',
    date: '2024-06-03',
  },
];

const mockStats = {
  insightsThisWeek: 5,
  activeSessions: 2,
  lastActive: '2 hours ago',
};

const mockTips = [
  'Set clear, achievable goals for the week.',
  'Use the AI assistant to brainstorm solutions.',
  'Review your progress every Friday.',
];

export default function AIInsightsPage() {
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
    <div className="h-screen flex bg-gray-50 font-serif">
      {/* Sidebar */}
      <Sidebar />
      {/* Main Area */}
      <div className="flex-1 flex flex-col h-full transition-all duration-300">
        {/* Top Bar */}
        <ClientTopbar user={user} />
        {/* Main Content */}
        <main className="flex-1 h-0 overflow-y-auto px-4 md:px-12 py-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Content */}
              <div className="flex-1 space-y-8">
                {/* Welcome Section */}
                <section className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-none">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-primary mb-1 tracking-tight">
                      Welcome to AI Insights{user?.name ? `, ${user.name}` : ''}!
                    </h2>
                    <p className="text-gray-600 text-base md:text-lg">Get instant guidance, insights, and support from your AI assistant.</p>
                  </div>
                  <img
                    src="/ai-insights-illustration.svg"
                    alt="AI Insights"
                    className="w-28 h-28 md:w-36 md:h-36 object-contain hidden md:block"
                  />
                </section>
                {/* AI Assistant Section */}
                <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-none min-h-[300px] flex flex-col justify-center items-center">
                  <AIChatbot />
                </section>
                {/* Insights Section */}
                <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-none">
                  <h3 className="text-xl font-semibold mb-4 text-primary">Recent AI Insights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {mockInsights.map((insight) => (
                      <div key={insight.id} className="border border-gray-100 rounded-lg p-4 bg-gray-50 hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-400">{new Date(insight.date).toLocaleDateString()}</span>
                        </div>
                        <h4 className="text-lg font-bold text-gray-800 mb-1">{insight.title}</h4>
                        <p className="text-gray-600 text-sm">{insight.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
              {/* Dashboard Widgets Sidebar */}
              <aside className="w-full lg:w-72 flex-shrink-0 space-y-6">
                {/* Stats Widget */}
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-none">
                  <h5 className="text-md font-semibold mb-2 text-primary">Your Stats</h5>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>Insights this week: <span className="font-bold">{mockStats.insightsThisWeek}</span></li>
                    <li>Active sessions: <span className="font-bold">{mockStats.activeSessions}</span></li>
                    <li>Last active: <span className="font-bold">{mockStats.lastActive}</span></li>
                  </ul>
                </div>
                {/* Quick Tips Widget */}
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-none">
                  <h5 className="text-md font-semibold mb-2 text-primary">Quick Tips</h5>
                  <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                    {mockTips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
