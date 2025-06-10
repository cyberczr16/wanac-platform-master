'use client';

import { useState, useEffect } from 'react';
import {
  FaCalendar,
  FaPenFancy,
  FaRobot,
  FaChartLine,
  FaBook,
  FaUserShield,
  FaUsers,
  FaEnvelope,
  FaBell,
  FaUserCircle,
} from 'react-icons/fa';
import Sidebar from '../../../../components/Sidebar';
import ClientNavbar from '../../../../components/ClientNavbar';

export default function ClientDashboard() {
  const [upcomingSessions, setUpcomingSessions] = useState([
    {
      id: 1,
      date: '2024-03-25',
      time: '10:00 AM',
      coach: 'Coach Smith',
      type: 'One-on-One Session',
    },
    {
      id: 2,
      date: '2024-03-27',
      time: '2:00 PM',
      coach: 'Coach Smith',
      type: 'Goal Review',
    },
  ]);

  const [lifeScore, setLifeScore] = useState({
    career: 7,
    relationships: 8,
    health: 6,
    finances: 5,
    personal: 7,
  });

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
    <div className="min-h-screen bg-gray-50">
       {/* Sidebar */}
       <Sidebar className="bg-white border-r border-gray-200 shadow-md mt-0" />
      {/* Top Navigation Bar */}
      <ClientNavbar user={user} />
      <div className="flex">
       
        <div className="flex-1">
          {/* Main Content */}
          <main className="p-6 md:p-10">
            <div className="space-y-8 max-w-7xl mx-auto">
              {/* Welcome Section */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-8 shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-1">Welcome Back!</h2>
                  <p className="text-gray-600 text-lg">Here's an overview of your coaching journey.</p>
                </div>
                <img src="/dashboard-illustration.svg" alt="Dashboard Illustration" className="w-32 h-32 object-contain hidden md:block" />
              </div>
              {/* Quick Actions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <QuickActionCard
                  icon={FaCalendar}
                  title="Schedule Session"
                  description="Book your next coaching session"
                  href="/(dashboard)/appointments"
                  color="blue"
                />
                <QuickActionCard
                  icon={FaPenFancy}
                  title="New Journal Entry"
                  description="Record your thoughts and progress"
                  href="/(dashboard)/journal"
                  color="green"
                />
                <QuickActionCard
                  icon={FaRobot}
                  title="AI Assistant"
                  description="Get instant guidance and support"
                  href="/(dashboard)/aichatbot"
                  color="purple"
                />
                <QuickActionCard
                  icon={FaChartLine}
                  title="Track Progress"
                  description="View your life score metrics"
                  href="/(dashboard)/lifescore"
                  color="orange"
                />
                <QuickActionCard
                  icon={FaUsers}
                  title="Breakout Room"
                  description="Join group discussions and collaborate"
                  href="/pages/breakoutroom"
                  color="blue"
                />
              </div>
              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upcoming Sessions */}
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaCalendar className="text-blue-600" />
                    Upcoming Sessions
                  </h3>
                  <div className="space-y-4">
                    {upcomingSessions.map((session) => (
                      <div
                        key={session.id}
                        className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 rounded"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-800">{session.type}</p>
                            <p className="text-sm text-gray-600">with {session.coach}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-800">{session.date}</p>
                            <p className="text-sm text-gray-600">{session.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View All Sessions →
                  </button>
                </div>
                {/* Life Score Overview */}
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaChartLine className="text-orange-600" />
                    Life Score Overview
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(lifeScore).map(([category, score]) => (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium capitalize text-gray-700">
                            {category}
                          </span>
                          <span className="text-sm text-gray-600">{score}/10</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-orange-500 rounded-full transition-all duration-300"
                            style={{ width: `${score * 10}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="mt-4 text-orange-600 hover:text-orange-700 text-sm font-medium">
                    View Detailed Analysis →
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function QuickActionCard({ icon: Icon, title, description, href, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200',
    green: 'bg-green-50 text-green-700 hover:bg-green-100 border-green-200',
    purple: 'bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200',
    orange: 'bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-200',
  };

  return (
    <a
      href={href}
      className={`block p-6 rounded-xl border shadow-sm transition-colors duration-200 ${colorClasses[color]} cursor-pointer group`}
    >
      <Icon className="text-3xl mb-3 group-hover:scale-110 transition-transform" />
      <h3 className="font-semibold mb-1 text-lg">{title}</h3>
      <p className="text-sm opacity-80">{description}</p>
    </a>
  );
}
