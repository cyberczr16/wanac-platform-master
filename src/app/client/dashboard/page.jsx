'use client';

import { useState, useEffect } from 'react';
import {
  FaCalendar,
  FaPenFancy,
  FaRobot,
  FaChartLine,
  FaUsers,
  FaFire,
  FaUserCircle,
  FaVideo,
  FaBell,
  FaGraduationCap,
  FaBriefcase,
  FaCog,
  FaChevronLeft,
  FaChevronRight,
  FaCalendarAlt,
  FaFileAlt,
  FaSearch,
  FaClipboardList,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaArrowRight,
} from 'react-icons/fa';
import Sidebar from '../../../../components/dashboardcomponents/sidebar'
import ClientTopbar from '../../../../components/dashboardcomponents/clienttopbar';
import { useRouter } from 'next/navigation';
import { sessionsService } from '../../../services/api/sessions.service';
import { habitsService } from '../../../services/api/habits.service';
import { fireteamService } from '../../../services/api/fireteam.service';
import { experienceService } from '../../../services/api/experience.service';
import { notificationService } from '../../../services/api/notification.service';
import journalPrompts from '../../../data/journalPrompts.json';

// Day of year (1–365) for aligning with 365 Growth Journal prompts
function getDayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start + (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
  const oneDay = 864e5;
  return Math.min(365, Math.max(1, Math.floor(diff / oneDay) + 1));
}

// Known system/non-score fields to filter out of life score display
const SYSTEM_FIELDS = new Set([
  'id', 'user_id', 'client_id', 'coach_id', 'fire_team_id', 'cohort_id',
  'created_at', 'updated_at', 'deleted_at', 'date', 'week', 'month', 'year',
]);

// Filter life score object to only score-like entries
function getScoreEntries(lifeScore) {
  return Object.entries(lifeScore).filter(([key, value]) => {
    if (SYSTEM_FIELDS.has(key)) return false;
    const num = Number(value);
    return !isNaN(num) && num >= 0 && num <= 10;
  });
}

// Color-code a score 0-10
function getScoreColor(score) {
  if (score >= 8) return { bar: 'from-emerald-400 to-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50' };
  if (score >= 5) return { bar: 'from-amber-400 to-amber-500', text: 'text-amber-600', bg: 'bg-amber-50' };
  return { bar: 'from-red-400 to-red-500', text: 'text-red-600', bg: 'bg-red-50' };
}

// Format a date/time for session display
function formatSessionDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d)) return null;
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  let dayLabel;
  if (d.toDateString() === today.toDateString()) dayLabel = 'Today';
  else if (d.toDateString() === tomorrow.toDateString()) dayLabel = 'Tomorrow';
  else dayLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  return { dayLabel, time, raw: d };
}

export default function ClientDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [lifeScore, setLifeScore] = useState({});
  const [upcomingExperiences, setUpcomingExperiences] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState(() => new Date());

  // Mock data for right sidebar (replace with real API later)
  const availableForCoaching = [
    { id: 1, name: 'Mike Tyson', role: 'iOS Developer', initial: 'M', color: 'bg-blue-100 text-blue-700' },
    { id: 2, name: 'Samuel John', role: 'Android Developer', initial: 'S', color: 'bg-purple-100 text-purple-700' },
    { id: 3, name: 'Jiya George', role: 'UX/UI Designer', initial: 'J', color: 'bg-amber-100 text-amber-700' },
  ];

  const router = useRouter();

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  const scoreEntries = getScoreEntries(lifeScore);
  const avgScore = scoreEntries.length > 0
    ? Math.round(scoreEntries.reduce((acc, [, v]) => acc + Number(v), 0) / scoreEntries.length * 10) / 10
    : null;

  const progressSummary = (() => {
    if (scoreEntries.length === 0 && upcomingSessions.length === 0) {
      return 'Your journey starts here. Schedule a session to begin tracking your progress.';
    }
    const parts = [];
    if (upcomingSessions.length > 0) {
      parts.push(`${upcomingSessions.length} upcoming session${upcomingSessions.length > 1 ? 's' : ''}`);
    }
    if (avgScore !== null) {
      parts.push(`overall life score of ${avgScore}/10`);
    }
    return parts.length > 0
      ? `You have ${parts.join(' and a ')}. Keep building momentum!`
      : 'Schedule your next session to keep building momentum.';
  })();

  // Fetch upcoming fireteam experiences
  const fetchUpcomingExperiences = async () => {
    try {
      const fireteams = await fireteamService.getFireteams();
      const allExperiences = [];
      for (const fireteam of fireteams) {
        try {
          const experiences = await experienceService.getExperiences(fireteam.id);
          const experiencesWithFireteam = experiences.map(exp => ({ ...exp, fireteam }));
          allExperiences.push(...experiencesWithFireteam);
        } catch { /* skip this fireteam */ }
      }
      const upcoming = allExperiences
        .filter(exp => exp.status === 'upcoming' || exp.status === 'scheduled' || !exp.status)
        .slice(0, 4);
      setUpcomingExperiences(upcoming);
    } catch {
      setUpcomingExperiences([]);
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem('wanacUser');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        // Sessions
        setSessionsLoading(true);
        sessionsService.getSessions().then((sessions) => {
          let sessionArray = [];
          if (Array.isArray(sessions)) sessionArray = sessions;
          else if (sessions?.sessions?.data && Array.isArray(sessions.sessions.data)) sessionArray = sessions.sessions.data;
          else if (sessions?.data && Array.isArray(sessions.data)) sessionArray = sessions.data;
          const now = new Date();
          const upcoming = sessionArray.filter(s => s.scheduled_at && new Date(s.scheduled_at) > now);
          setUpcomingSessions(upcoming);
        }).catch(() => setUpcomingSessions([])).finally(() => { setSessionsLoading(false); setLoading(false); });

        // Life score
        habitsService.getWholeLifeHistory().then((history) => {
          let historyArray = [];
          if (Array.isArray(history)) historyArray = history;
          else if (history?.data && Array.isArray(history.data)) historyArray = history.data;
          if (historyArray.length > 0) setLifeScore(historyArray[0]);
        }).catch(() => {});

        // Experiences
        fetchUpcomingExperiences();

        // Notifications
        notificationService.getNotifications().then((data) => {
          let list = [];
          if (Array.isArray(data)) list = data;
          else if (data?.data && Array.isArray(data.data)) list = data.data;
          else if (data?.notifications && Array.isArray(data.notifications)) list = data.notifications;
          setNotifications(list);
        }).catch(() => setNotifications([]));
      } catch {
        setUser(null);
        setLoading(false);
        setSessionsLoading(false);
      }
    } else {
      setLoading(false);
      setSessionsLoading(false);
    }
  }, []);

  const unreadCount = notifications.filter(n => !n.read && !n.read_at).length;

  return (
    <div
      className="h-screen max-h-[100dvh] flex flex-row overflow-hidden bg-[#f5f5f5] font-body text-foreground"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      {/* Sidebar */}
      <Sidebar className="w-56 bg-white border-r border-gray-200" collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-h-0 min-w-0 w-full transition-all duration-300">
        <ClientTopbar user={user} />

        <main className="flex-1 min-h-0 overflow-hidden flex flex-col px-3 sm:px-4 md:px-6 py-3 md:py-4">
          <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-3 md:gap-4 max-w-7xl mx-auto w-full min-w-0">

            {/* ── Left / Main column ── */}
            <div className="flex-1 min-w-0 flex flex-col min-h-0 gap-3 md:gap-4">

              {/* Welcome hero banner */}
              <section className="flex-shrink-0 relative overflow-hidden rounded-2xl bg-[#9A6AE3] text-white shadow-sm">
                <div className="absolute top-2 left-16 w-10 h-10 rounded-full bg-white/20" aria-hidden />
                <div className="absolute bottom-4 left-24 w-8 h-8 rounded-full bg-white/15" aria-hidden />
                <div className="absolute top-4 right-1/3 w-6 h-6 rounded-full bg-white/10" aria-hidden />
                <div className="flex flex-row min-h-[130px] sm:min-h-[150px]">
                  {/* Left image */}
                  <div className="relative w-28 sm:w-36 flex-shrink-0 flex items-end justify-center overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=320&q=80"
                      alt=""
                      className="h-full w-full object-cover object-bottom scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#9A6AE3] to-transparent opacity-60" />
                  </div>
                  {/* Right content */}
                  <div className="flex-1 flex flex-col justify-center px-4 sm:px-5 py-4 pr-4">
                    <p className="text-white/80 text-xs font-medium uppercase tracking-widest mb-0.5">{greeting}</p>
                    <h2
                      className="text-xl sm:text-2xl font-bold text-white tracking-tight"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {user?.name ? user.name.split(' ')[0] : 'Welcome back'}!
                    </h2>
                    <p className="text-white/85 text-xs sm:text-sm mt-1 leading-snug max-w-xl line-clamp-2">
                      {progressSummary}
                    </p>
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      <button
                        onClick={() => router.push('/client/session')}
                        className="inline-flex items-center gap-1.5 bg-white text-[#9A6AE3] hover:bg-white/95 font-semibold px-3 py-2 rounded-xl text-xs transition-colors shadow-sm"
                      >
                        <FaVideo className="text-sm" />
                        Schedule a Session
                      </button>
                      <button
                        onClick={() => router.push('/client/fireteam')}
                        className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white font-semibold px-3 py-2 rounded-xl text-xs transition-colors border border-white/20"
                      >
                        <FaFire className="text-sm" />
                        FireTeam
                      </button>
                    </div>
                  </div>
                  {/* Stat pill — top-right */}
                  {avgScore !== null && (
                    <div className="absolute top-3 right-3 flex flex-col items-center bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl px-3 py-1.5">
                      <span className="text-white text-lg font-black leading-none">{avgScore}</span>
                      <span className="text-white/70 text-[10px] font-medium">/10 avg</span>
                    </div>
                  )}
                </div>
              </section>

              {/* Quick Actions */}
              <section className="flex-shrink-0 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>
                    Quick access
                  </h3>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  <QuickActionCard icon={FaUsers}      title="Community"    href="/client/community"          iconBg="bg-blue-50 text-blue-600" />
                  <QuickActionCard icon={FaPenFancy}   title="Journal"      href="/client/journal"            iconBg="bg-purple-50 text-purple-600" />
                  <QuickActionCard icon={FaRobot}      title="AI Assistant" href="/client/aichatbot"          iconBg="bg-pink-50 text-pink-600" />
                  <QuickActionCard icon={FaChartLine}  title="Life Score"   href="/client/lifescores"         iconBg="bg-amber-50 text-amber-600" />
                  <QuickActionCard icon={FaFire}       title="FireTeam"     href="/client/fireteam"           iconBg="bg-orange-50 text-orange-600" />
                  <QuickActionCard icon={FaCalendar}   title="Sessions"     href="/client/session"            iconBg="bg-indigo-50 text-indigo-600" />
                </div>
              </section>

              {/* Content Grid — 3 cards */}
              <section className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-3 gap-3 overflow-hidden">

                {/* Upcoming Sessions */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col min-h-0 overflow-hidden">
                  <div className="flex items-center justify-between mb-3 flex-shrink-0">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                      <FaVideo className="text-indigo-500 text-xs" />
                      Upcoming Sessions
                    </h3>
                    <button
                      className="text-[10px] font-semibold text-gray-400 hover:text-[#9A6AE3] transition-colors flex items-center gap-0.5"
                      onClick={() => router.push('/client/session')}
                    >
                      View all <FaArrowRight className="text-[8px]" />
                    </button>
                  </div>
                  <div className="flex-1 min-h-0 overflow-y-auto space-y-2">
                    {sessionsLoading ? (
                      <div className="space-y-2">
                        {[1,2].map(i => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
                      </div>
                    ) : upcomingSessions.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full py-4 text-center">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center mb-2">
                          <FaCalendar className="text-indigo-400 text-sm" />
                        </div>
                        <p className="text-xs text-gray-500 font-medium">No sessions scheduled</p>
                        <button
                          onClick={() => router.push('/client/session')}
                          className="mt-2 text-xs font-semibold text-[#9A6AE3] hover:underline"
                        >
                          Book a session →
                        </button>
                      </div>
                    ) : (
                      upcomingSessions.slice(0, 4).map((session) => {
                        const dt = formatSessionDate(session.scheduled_at);
                        const isToday = dt?.dayLabel === 'Today';
                        return (
                          <div key={session.id}
                            className={`p-2.5 rounded-xl border text-xs ${isToday ? 'bg-indigo-50 border-indigo-100' : 'bg-gray-50 border-gray-100'}`}>
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="font-semibold text-gray-900 truncate">
                                  {session.title || session.topic || 'Coaching Session'}
                                </p>
                                {session.coach?.user?.name && (
                                  <p className="text-gray-500 truncate mt-0.5">with {session.coach.user.name}</p>
                                )}
                              </div>
                              {dt && (
                                <div className={`flex-shrink-0 text-right ${isToday ? 'text-indigo-600' : 'text-gray-500'}`}>
                                  <p className="font-bold">{dt.dayLabel}</p>
                                  <p className="text-[10px]">{dt.time}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                  {!sessionsLoading && upcomingSessions.length > 0 && (
                    <button
                      onClick={() => router.push('/client/session')}
                      className="mt-2 text-xs font-semibold text-[#9A6AE3] hover:underline text-center flex-shrink-0"
                    >
                      + Schedule another session
                    </button>
                  )}
                </div>

                {/* Life Score Overview */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col min-h-0 overflow-hidden">
                  <div className="flex items-center justify-between mb-3 flex-shrink-0">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                      <FaChartLine className="text-amber-500 text-xs" />
                      Life Score
                    </h3>
                    {avgScore !== null && (
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-100 rounded-full px-2 py-0.5">
                        {avgScore}/10 avg
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-h-0 overflow-y-auto space-y-2">
                    {scoreEntries.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full py-4 text-center">
                        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center mb-2">
                          <FaChartLine className="text-amber-400 text-sm" />
                        </div>
                        <p className="text-xs text-gray-500 font-medium">No score data yet</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Complete a session to see your scores</p>
                      </div>
                    ) : (
                      scoreEntries.map(([category, score]) => {
                        const num = Number(score);
                        const colors = getScoreColor(num);
                        return (
                          <div key={category}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="capitalize font-medium text-gray-700 text-xs truncate pr-2">{category.replace(/_/g, ' ')}</span>
                              <span className={`text-[10px] font-bold flex-shrink-0 px-1.5 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                                {num}/10
                              </span>
                            </div>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full bg-gradient-to-r ${colors.bar} rounded-full transition-all duration-500`}
                                style={{ width: `${num * 10}%` }}
                              />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                  <button
                    className="mt-2 text-xs font-semibold text-[#9A6AE3] hover:underline flex-shrink-0"
                    onClick={() => router.push('/client/lifescores')}
                  >
                    View detailed analysis →
                  </button>
                </div>

                {/* Today's Journal Prompt */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col min-h-0 overflow-hidden">
                  <div className="flex items-center justify-between mb-3 flex-shrink-0">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                      <FaPenFancy className="text-purple-500 text-xs" />
                      Journal Prompt
                    </h3>
                    <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 border border-purple-100 rounded-full px-2 py-0.5">
                      Today
                    </span>
                  </div>
                  <div className="flex-1 min-h-0 overflow-y-auto">
                    {(() => {
                      const dayOfYear = getDayOfYear();
                      const len = journalPrompts.length;
                      const prompts = [0, 1].map((i) => {
                        const idx = (dayOfYear - 1 + i) % len;
                        const p = journalPrompts[idx];
                        return p ? { ...p, dayLabel: i === 0 ? 'Today' : 'Tomorrow' } : null;
                      }).filter(Boolean);

                      return prompts.length === 0 ? (
                        <p className="text-gray-400 text-xs">No prompts available.</p>
                      ) : (
                        <div className="space-y-2">
                          {prompts.map((p, i) => (
                            <div key={`${p.number}-${i}`}
                              className={`rounded-xl p-3 ${i === 0 ? 'bg-purple-50 border border-purple-100' : 'bg-gray-50 border border-gray-100'}`}>
                              <div className="flex items-center justify-between mb-1">
                                <span className={`text-[10px] font-bold uppercase tracking-wide ${i === 0 ? 'text-purple-600' : 'text-gray-400'}`}>
                                  {p.dayLabel} · Prompt #{p.number}
                                </span>
                              </div>
                              <p className={`text-xs leading-relaxed ${i === 0 ? 'text-gray-700' : 'text-gray-400'} line-clamp-3`}>
                                {p.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                  <button
                    className="mt-2 text-xs font-semibold text-[#9A6AE3] hover:underline flex-shrink-0"
                    onClick={() => router.push('/client/journal')}
                  >
                    Open Journal →
                  </button>
                </div>

              </section>
            </div>

            {/* ── Right sidebar ── */}
            <aside className="w-full lg:w-64 xl:w-72 flex-shrink-0 min-w-0 flex flex-col min-h-0 gap-3">

              {/* User profile card */}
              <div className="flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-200 border border-amber-300 flex items-center justify-center overflow-hidden flex-shrink-0 text-amber-800 font-bold text-sm">
                  {user?.profile_image ? (
                    <img src={user.profile_image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span>{(user?.name || 'A').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <button onClick={() => router.push('/client/accountsettings')} className="text-left min-w-0 w-full">
                    <p className="font-bold text-gray-900 truncate text-sm">{user?.name || 'Your Profile'}</p>
                    <p className="text-[10px] text-gray-400">View & edit profile</p>
                  </button>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => router.push('/client/accountsettings')}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 text-xs" aria-label="Settings">
                    <FaCog />
                  </button>
                  <button
                    className="relative w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 text-xs"
                    aria-label="Notifications"
                    onClick={() => router.push('/client/accountsettings')}
                  >
                    <FaBell />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center text-[8px] font-bold text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Schedule Calendar */}
              <div className="flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900">Schedule</h3>
                  <div className="flex items-center gap-0.5">
                    <button type="button"
                      onClick={() => setCalendarMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1))}
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 text-xs">
                      <FaChevronLeft />
                    </button>
                    <span className="px-2 py-0.5 rounded-lg bg-[#9A6AE3] text-white text-xs font-semibold">
                      {calendarMonth.toLocaleString('default', { month: 'short', year: '2-digit' })}
                    </span>
                    <button type="button"
                      onClick={() => setCalendarMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1))}
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 text-xs">
                      <FaChevronRight />
                    </button>
                  </div>
                </div>
                <div className="flex gap-1.5 overflow-x-auto pb-0.5">
                  {(() => {
                    const start = new Date(calendarMonth);
                    start.setDate(start.getDate() - start.getDay() + 1);
                    return [0, 1, 2, 3, 4].map((i) => {
                      const d = new Date(start);
                      d.setDate(start.getDate() + i);
                      const isSelected = selectedDay.toDateString() === d.toDateString();
                      const isToday = d.toDateString() === new Date().toDateString();
                      const hasSession = upcomingSessions.some(s => {
                        const sd = s.scheduled_at ? new Date(s.scheduled_at) : null;
                        return sd && sd.toDateString() === d.toDateString();
                      });
                      return (
                        <button key={i} type="button" onClick={() => setSelectedDay(d)}
                          className={`relative flex-shrink-0 min-w-[46px] px-1.5 py-2 rounded-xl text-center text-xs font-medium transition-colors ${
                            isSelected
                              ? 'bg-[#9A6AE3] text-white shadow-sm'
                              : isToday
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <div className="text-[10px] opacity-70">{d.toLocaleDateString('en-GB', { weekday: 'short' })}</div>
                          <div className="font-bold">{d.getDate()}</div>
                          {hasSession && (
                            <div className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-[#9A6AE3]'}`} />
                          )}
                        </button>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Shortcuts */}
              <div className="flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-2">
                <h3 className="text-sm font-bold text-gray-900">Shortcuts</h3>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { icon: FaFileAlt,      label: 'Application materials', href: '/client/mycareercompass',             color: 'bg-purple-50 text-purple-600' },
                    { icon: FaCalendar,     label: 'Appointments',          href: '/client/mycareercompass',             color: 'bg-indigo-50 text-indigo-600' },
                    { icon: FaSearch,       label: 'Research tools',        href: '/client/mycareercompass/researchtools', color: 'bg-sky-50 text-sky-600' },
                    { icon: FaClipboardList, label: 'Assignments',          href: '/client/myeducationcompass',          color: 'bg-amber-50 text-amber-600' },
                  ].map(({ icon: Icon, label, href, color }) => (
                    <button key={label} type="button" onClick={() => router.push(href)}
                      className="flex items-center gap-2 p-2 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 text-left transition-colors">
                      <div className={`w-6 h-6 rounded-lg ${color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="text-[10px]" />
                      </div>
                      <span className="font-medium text-gray-700 text-[11px] truncate leading-tight">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Available for coaching */}
              <div className="flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900">Book a Coach</h3>
                  <button type="button" onClick={() => router.push('/client/session')}
                    className="text-[10px] font-semibold text-[#9A6AE3] hover:underline">
                    View all
                  </button>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-0.5">
                  {availableForCoaching.map((p) => (
                    <div key={p.id}
                      className="flex-shrink-0 w-24 rounded-xl bg-gray-50 border border-gray-100 p-2 flex flex-col items-center text-center">
                      <div className={`w-8 h-8 rounded-full ${p.color} flex items-center justify-center font-bold text-xs mb-1.5`}>
                        {p.initial}
                      </div>
                      <p className="font-semibold text-gray-900 text-[10px] truncate w-full">{p.name}</p>
                      <p className="text-[9px] text-gray-400 truncate w-full mb-1.5">{p.role}</p>
                      <button type="button"
                        className="w-full py-1 rounded-lg bg-[#9A6AE3] text-white text-[10px] font-semibold hover:bg-purple-600 transition-colors"
                        onClick={() => router.push('/client/session')}>
                        Book
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming fireteam experiences */}
              <div className="flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                    <FaFire className="text-orange-500 text-xs" />
                    FireTeam Sessions
                  </h3>
                  <button type="button" onClick={() => router.push('/client/fireteam')}
                    className="text-[10px] font-semibold text-[#9A6AE3] hover:underline">
                    View all
                  </button>
                </div>
                <div className="space-y-1.5">
                  {upcomingExperiences.length === 0 ? (
                    <p className="text-[11px] text-gray-400 py-1">No upcoming fireteam sessions.</p>
                  ) : (
                    upcomingExperiences.slice(0, 3).map((exp) => (
                      <button key={exp.id} type="button"
                        onClick={() => router.push('/client/fireteam')}
                        className="w-full text-left p-2.5 rounded-xl bg-orange-50 border border-orange-100 hover:bg-orange-100/60 transition-colors">
                        <p className="font-semibold text-gray-900 text-[11px] truncate">{exp.title || exp.name || 'Group session'}</p>
                        <p className="text-[10px] text-orange-600 truncate mt-0.5">{exp.fireteam?.title || 'FireTeam'}</p>
                      </button>
                    ))
                  )}
                </div>
              </div>

            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ── Quick Action Card ── */
function QuickActionCard({ icon: Icon, title, href, iconBg = 'bg-blue-50 text-blue-600' }) {
  return (
    <a
      href={href}
      className="group flex flex-col items-center text-center p-3 rounded-2xl border border-gray-100 bg-white hover:shadow-sm hover:border-gray-200 transition-all"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      <div className={`mb-2 w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center transition-colors group-hover:opacity-80`}>
        <Icon className="text-lg" />
      </div>
      <h3 className="text-[11px] font-semibold text-gray-700 line-clamp-1" style={{ fontFamily: 'var(--font-heading)' }}>{title}</h3>
    </a>
  );
}
