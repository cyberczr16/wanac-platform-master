"use client";
// Admin Dashboard for WANAC Coaching Platform
import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../../components/dashboardcomponents/adminsidebar';
import { useRouter } from 'next/navigation';
import { fireteamService } from '../../services/api/fireteam.service';
import { clientsService } from '../../services/api/clients.service';
import { sessionsService } from '../../services/api/sessions.service';
import { cohortService } from '../../services/api/cohort.service';
import { Users, UserCheck, Calendar, Users as TeamIcon, BarChart3, Activity, TrendingUp, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCoaches: 0,
    totalSessions: 0,
    totalFireteams: 0,
  });
  const [fireteams, setFireteams] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const router = useRouter();

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

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      try {
        // Fetch all data in parallel
        const [clientsData, coachesData, sessionsData, fireteamsData] = await Promise.all([
          clientsService.getClients().catch(() => []),
          cohortService.getCoaches().catch(() => []),
          sessionsService.getSessions().catch(() => []),
          fireteamService.getFireteams().catch(() => []),
        ]);

        // Process clients data
        const clients = Array.isArray(clientsData) ? clientsData : (clientsData.clients || clientsData.data || []);
        
        // Process coaches data
        const coaches = Array.isArray(coachesData) ? coachesData : (coachesData.coaches || coachesData.data || []);
        
        // Process sessions data
        const sessionsArray = Array.isArray(sessionsData) ? sessionsData : (sessionsData.sessions || sessionsData.data || []);
        
        // Process fireteams data
        const fireteamsArray = Array.isArray(fireteamsData) ? fireteamsData : [];

        setStats({
          totalUsers: clients.length,
          totalCoaches: coaches.length,
          totalSessions: sessionsArray.length,
          totalFireteams: fireteamsArray.length,
        });

        setFireteams(fireteamsArray.slice(0, 3)); // Show only first 3
        setSessions(sessionsArray.slice(0, 5)); // Show only first 5
        
        // Generate recent activity from available data
        const activities = [];
        
        // Add recent sessions
        sessionsArray.slice(0, 3).forEach(session => {
          activities.push({
            type: 'session',
            title: session.title || 'Session',
            time: session.date || new Date().toISOString(),
            icon: Calendar,
            color: 'blue'
          });
        });
        
        // Add recent fireteams
        fireteamsArray.slice(0, 2).forEach(fireteam => {
          activities.push({
            type: 'fireteam',
            title: fireteam.title || 'Fireteam',
            time: fireteam.date || fireteam.created_at || new Date().toISOString(),
            icon: TeamIcon,
            color: 'green'
          });
        });
        
        // Sort by time (most recent first)
        activities.sort((a, b) => new Date(b.time) - new Date(a.time));
        setRecentActivity(activities.slice(0, 5));

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  const quickActions = [
    { 
      icon: Users, 
      label: 'Users', 
      count: stats.totalUsers,
      lightColor: 'bg-blue-50',
      textColor: 'text-[#3366FF]',
      path: '/admin/manageusers'
    },
    { 
      icon: UserCheck, 
      label: 'Coaches', 
      count: stats.totalCoaches,
      lightColor: 'bg-orange-50',
      textColor: 'text-accent',
      path: '/admin/managecoaches'
    },
    { 
      icon: Calendar, 
      label: 'Sessions', 
      count: stats.totalSessions,
      lightColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      path: '/admin/sessions'
    },
    { 
      icon: TeamIcon, 
      label: 'Fireteams', 
      count: stats.totalFireteams,
      lightColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      path: '/admin/fireteammanagement'
    },
    { 
      icon: BarChart3, 
      label: 'Analytics', 
      count: '-',
      lightColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      path: '/admin/analytics'
    },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex h-screen bg-gray-50 font-serif overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between flex-shrink-0">
          <h2 className="text-lg font-semibold text-heading hidden md:block">Dashboard Overview</h2>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#002147] to-[#3366FF] flex items-center justify-center text-white">
              <Users size={18} />
            </div>
            <span className="text-sm text-gray-700 font-medium">{user?.name || 'Admin'}</span>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-4 bg-gray-50">
          <div className="max-w-7xl mx-auto h-full flex flex-col">
            {/* Welcome Section - Compact */}
            <div className="bg-gradient-to-r from-[#002147] to-[#3366FF] rounded-lg p-4 md:p-5 mb-4 text-white flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold mb-1">
                    Welcome Back{user?.name ? `, ${user.name}` : ''}!
                  </h1>
                  <p className="text-blue-100 text-sm">
                    Admin control panel for WANAC platform
                  </p>
                </div>
                <div className="hidden md:flex items-center justify-center w-16 h-16 bg-white/10 rounded-full">
                  <Activity size={32} className="text-white/80" />
                </div>
              </div>
            </div>

            {/* Quick Stats Grid - More Compact */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4 flex-shrink-0">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <div
                    key={action.label}
                    onClick={() => router.push(action.path)}
                    className="bg-white rounded-lg p-4 shadow-sm hover:shadow-lg transition-all cursor-pointer border border-gray-100 hover:border-[#3366FF]"
                  >
                    <div className={`w-10 h-10 ${action.lightColor} rounded-lg flex items-center justify-center mb-2`}>
                      <Icon className={`${action.textColor}`} size={20} />
                    </div>
                    <h3 className="text-2xl font-bold text-heading mb-1">
                      {loading ? '...' : action.count}
                    </h3>
                    <p className="text-xs font-semibold text-gray-700">{action.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Bottom Section - Flexible height */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
              {/* Chart Placeholder */}
              <div className="lg:col-span-2 bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex flex-col">
                <div className="flex items-center justify-between mb-3 flex-shrink-0">
                  <h2 className="text-base font-semibold text-heading">
                    Platform Activity & Growth
                  </h2>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#3366FF]"></div>
                    <div className="w-3 h-3 rounded-full bg-accent"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg border-2 border-dashed border-gray-200">
                  <BarChart3 size={48} className="mb-2 text-[#3366FF]" />
                  <p className="text-sm text-gray-600 font-medium">Analytics Dashboard</p>
                  <p className="text-xs text-gray-400 mt-1">Coming Soon</p>
                </div>
              </div>

              {/* Recent Activity - Scrollable */}
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex flex-col">
                <h2 className="text-base font-semibold text-heading mb-3 flex-shrink-0">
                  Recent Activity
                </h2>
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3366FF]"></div>
                    </div>
                  ) : recentActivity.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <Clock size={32} className="mb-2" />
                      <p className="text-sm text-gray-500">No recent activity</p>
                    </div>
                  ) : (
                    recentActivity.map((activity, idx) => {
                      const Icon = activity.icon;
                      const colorClasses = activity.color === 'blue' 
                        ? { bg: 'bg-blue-50', text: 'text-[#3366FF]' }
                        : { bg: 'bg-emerald-50', text: 'text-emerald-600' };
                      return (
                        <div key={idx} className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className={`w-8 h-8 ${colorClasses.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <Icon className={colorClasses.text} size={14} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-heading truncate">
                              {activity.title}
                            </p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Clock size={10} className="text-gray-400" />
                              <p className="text-xs text-gray-500">
                                {formatDate(activity.time)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
  