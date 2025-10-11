"use client";
// Admin Dashboard for WANAC Coaching Platform
import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../../components/dashboardcomponents/adminsidebar';
import { useRouter } from 'next/navigation';
import { fireteamService } from '../../services/api/fireteam.service';
import { clientsService } from '../../services/api/clients.service';
import { sessionsService } from '../../services/api/sessions.service';
import { cohortService } from '../../services/api/cohort.service';
import { Users, UserCheck, Calendar, Users as TeamIcon, BarChart3, Activity, TrendingUp, Clock, Bell, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
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
    
    // Load sidebar state from localStorage
    const stored = localStorage.getItem('wanacAdminSidebarCollapsed');
    if (stored !== null) {
      setSidebarCollapsed(stored === 'true');
    }
  }, []);

  // Persist sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('wanacAdminSidebarCollapsed', sidebarCollapsed);
  }, [sidebarCollapsed]);

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
      bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
      description: 'Manage all users',
      path: '/admin/manageusers'
    },
    { 
      icon: UserCheck, 
      label: 'Coaches', 
      count: stats.totalCoaches,
      bgColor: 'bg-gradient-to-br from-orange-500 to-orange-600',
      description: 'Coach management',
      path: '/admin/managecoaches'
    },
    { 
      icon: Calendar, 
      label: 'Sessions', 
      count: stats.totalSessions,
      bgColor: 'bg-gradient-to-br from-purple-500 to-purple-600',
      description: 'Schedule & sessions',
      path: '/admin/sessions'
    },
    { 
      icon: TeamIcon, 
      label: 'Fireteams', 
      count: stats.totalFireteams,
      bgColor: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      description: 'Team collaboration',
      path: '/admin/fireteammanagement'
    },
    { 
      icon: BarChart3, 
      label: 'Analytics', 
      count: '-',
      bgColor: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
      description: 'Platform insights',
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
    <div className="h-screen flex bg-white font-body text-foreground overflow-hidden">
      <AdminSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className="flex-1 flex flex-col h-full transition-all duration-300">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between flex-shrink-0 shadow-sm">
          <h2 className="text-lg font-semibold text-[#002147] hidden md:block">Dashboard Overview</h2>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#002147] to-[#003875] flex items-center justify-center text-white shadow-md">
              <Users size={20} />
            </div>
            <span className="text-sm text-gray-900 font-semibold">{user?.name || 'Admin'}</span>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 h-0 overflow-y-auto px-4 md:px-8 py-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Main Content */}
              <div className="flex-1 space-y-6">
                {/* Welcome Section */}
                <section className="bg-gradient-to-br from-[#002147] to-[#003875] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-lg animate-fadeIn relative overflow-hidden">
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[url('/veterancommunity.png')] bg-cover bg-center" />
                  </div>
                  
                  <div className="relative z-10">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white tracking-tight">
                    Welcome Back{user?.name ? `, ${user.name}` : ''}!
                    </h2>
                    <p className="text-white/90 text-sm md:text-base leading-relaxed">
                    Admin control panel for WANAC platform
                  </p>
                </div>
                  <div className="relative z-10 hidden md:flex items-center justify-center w-20 h-20 bg-white/10 rounded-full backdrop-blur-sm">
                    <Activity size={36} className="text-white/90" />
                </div>
                </section>

                {/* Quick Actions Row */}
                <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <div
                    key={action.label}
                    onClick={() => router.push(action.path)}
                        className={`group p-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-lg transform hover:scale-105 flex flex-col items-center text-center gap-2 cursor-pointer ${action.bgColor} text-white`}
                  >
                        <div className="p-2 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                          <Icon size={20} />
                    </div>
                        <div>
                          <h3 className="text-xl font-bold mb-0.5">
                      {loading ? '...' : action.count}
                    </h3>
                          <p className="text-xs font-bold mb-0.5">{action.label}</p>
                          <p className="text-[10px] opacity-90 hidden md:block">{action.description}</p>
                        </div>
                  </div>
                );
              })}
                </section>

                {/* Content Grid */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Platform Stats Chart */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 animate-fadeIn">
                    <h3 className="text-base font-semibold mb-3 flex items-center gap-2 text-[#002147]">
                      <BarChart3 className="text-blue-500" size={18} />
                      Platform Activity
                    </h3>
                    <div className="flex flex-col items-center justify-center h-56 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg border-2 border-dashed border-gray-200">
                      <BarChart3 size={40} className="mb-2 text-blue-500" />
                  <p className="text-sm text-gray-600 font-medium">Analytics Dashboard</p>
                  <p className="text-xs text-gray-400 mt-1">Coming Soon</p>
                </div>
              </div>

                  {/* Quick Stats Summary */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 animate-fadeIn">
                    <h3 className="text-base font-semibold mb-3 flex items-center gap-2 text-[#002147]">
                      <TrendingUp className="text-green-500" size={18} />
                      Platform Overview
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-2.5 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center">
                            <Users className="text-white" size={18} />
                          </div>
                          <span className="font-medium text-sm text-gray-900">Total Users</span>
                        </div>
                        <span className="text-xl font-bold text-blue-600">
                          {loading ? '...' : stats.totalUsers}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center p-2.5 bg-orange-50 rounded-lg">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center">
                            <UserCheck className="text-white" size={18} />
                          </div>
                          <span className="font-medium text-sm text-gray-900">Active Coaches</span>
                        </div>
                        <span className="text-xl font-bold text-orange-600">
                          {loading ? '...' : stats.totalCoaches}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center p-2.5 bg-purple-50 rounded-lg">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 bg-purple-500 rounded-lg flex items-center justify-center">
                            <Calendar className="text-white" size={18} />
                          </div>
                          <span className="font-medium text-sm text-gray-900">Total Sessions</span>
                        </div>
                        <span className="text-xl font-bold text-purple-600">
                          {loading ? '...' : stats.totalSessions}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center p-2.5 bg-emerald-50 rounded-lg">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center">
                            <TeamIcon className="text-white" size={18} />
                          </div>
                          <span className="font-medium text-sm text-gray-900">Active Fireteams</span>
                        </div>
                        <span className="text-xl font-bold text-emerald-600">
                          {loading ? '...' : stats.totalFireteams}
                        </span>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* Sidebar for Notifications & Activity */}
              <aside className="lg:w-80 space-y-6">
                {/* Admin Notifications */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-4">
                  <h3 className="text-base font-semibold text-[#002147] mb-3 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse" /> 
                    <Bell className="text-red-500" size={16} />
                    Notifications
                  </h3>
                  <ul className="space-y-2.5">
                    {[
                      { id: 1, text: '5 new users registered today', type: 'info' },
                      { id: 2, text: '3 sessions scheduled for tomorrow', type: 'success' },
                      { id: 3, text: 'System maintenance scheduled', type: 'warning' },
                    ].map((n) => (
                      <li 
                        key={n.id} 
                        className="text-xs text-gray-700 border-l-3 border-blue-500 pl-3 py-2 bg-blue-50/50 rounded hover:bg-blue-50 transition-colors cursor-pointer"
                      >
                        {n.text}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recent Activity */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-4">
                  <h3 className="text-base font-semibold text-[#002147] mb-3 flex items-center gap-2">
                    <Clock className="text-orange-500" size={16} />
                  Recent Activity
                  </h3>
                  <div className="space-y-2.5">
                  {loading ? (
                      <div className="flex items-center justify-center py-6">
                        <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-blue-500"></div>
                    </div>
                  ) : recentActivity.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-6 text-gray-400">
                        <AlertCircle size={28} className="mb-2" />
                        <p className="text-xs text-gray-500">No recent activity</p>
                    </div>
                  ) : (
                    recentActivity.map((activity, idx) => {
                      const Icon = activity.icon;
                      const colorClasses = activity.color === 'blue' 
                          ? { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-500' }
                          : { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-500' };
                      return (
                          <div 
                            key={idx} 
                            className={`border-l-3 ${colorClasses.border} pl-3 py-2 ${colorClasses.bg} rounded hover:opacity-80 transition-opacity cursor-pointer`}
                          >
                            <div className="flex items-start gap-2">
                            <Icon className={colorClasses.text} size={14} />
                          <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-900 truncate line-clamp-1">
                              {activity.title}
                            </p>
                                <p className="text-[10px] text-gray-500 mt-0.5">
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
              </aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
  