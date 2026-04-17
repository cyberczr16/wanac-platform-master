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
import { cohortService } from '../../../services/api/cohort.service';
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
  const [availableForCoaching, setAvailableForCoaching] = useState([]);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState(() => new Date());
  const [mobileTab, setMobileTab] = useState('sessions');

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

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const response = await cohortService.getCoaches();
        const coachesArray = Array.isArray(response)
          ? response
          : Array.isArray(response?.coaches?.data)
          ? response.coaches.data
          : Array.isArray(response?.coaches)
          ? response.coaches
          : Array.isArray(response?.data)
          ? response.data
          : [];

        const normalized = coachesArray
          .map((coach, index) => {
            const displayName =
              coach?.name ||
              coach?.full_name ||
              coach?.user?.name ||
              [coach?.first_name, coach?.last_name].filter(Boolean).join(' ').trim() ||
              'Coach';
            const initials = displayName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase();
            const role = coach?.title || coach?.speciality || coach?.specialty || coach?.expertise || 'Coach';
            return {
              id: coach?.id ?? `coach-${index}`,
              name: displayName,
              role,
              initial: initials || 'C',
              profile_image: coach?.profile_image || coach?.avatar || coach?.user?.profile_image || null,
            };
          })
          .slice(0, 8);

        setAvailableForCoaching(normalized);
      } catch {
        setAvailableForCoaching([]);
      }
    };

    fetchCoaches();
  }, []);

  const unreadCount = notifications.filter(n => !n.read && !n.read_at).length;
  const profileImage = user?.profile_image || user?.profilePic || null;

  // Mobile tab definitions
  const mobileTabs = [
    { key: 'sessions', label: 'Sessions', icon: FaVideo, color: 'text-indigo-500' },
    { key: 'score', label: 'Life Score', icon: FaChartLine, color: 'text-amber-500' },
    { key: 'journal', label: 'Journal', icon: FaPenFancy, color: 'text-purple-500' },
    { key: 'coaches', label: 'Coaches', icon: FaUsers, color: 'text-pink-500' },
  ];

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

        {/* ═══════════ MOBILE LAYOUT (viewport-fitted, no scroll) ═══════════ */}
        <main className="md:hidden flex-1 flex flex-col min-h-0 px-3 py-2 gap-2 overflow-hidden">

          {/* Compact hero — greeting + name + CTA row */}
          <section className="flex-shrink-0 relative overflow-hidden rounded-xl bg-[#9A6AE3] text-white shadow-sm px-4 py-3">
            <div className="absolute top-1 right-8 w-16 h-16 rounded-full bg-white/10" aria-hidden />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30 flex-shrink-0">
                <img
                  src={profileImage || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=320&q=80"}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white/70 text-[10px] font-medium uppercase tracking-widest">{greeting}</p>
                <h2 className="text-base font-bold text-white truncate" style={{ fontFamily: 'var(--font-heading)' }}>
                  {user?.name ? user.name.split(' ')[0] : 'Welcome back'}!
                </h2>
              </div>
              {avgScore !== null && (
                <div className="flex-shrink-0 flex flex-col items-center bg-white/15 rounded-lg px-2 py-1">
                  <span className="text-white text-sm font-black leading-none">{avgScore}</span>
                  <span className="text-white/60 text-[8px]">/10</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <button onClick={() => router.push('/client/session')}
                className="flex-1 inline-flex items-center justify-center gap-1 bg-white text-[#9A6AE3] font-semibold py-1.5 rounded-lg text-[11px] shadow-sm">
                <FaVideo className="text-[10px]" /> Book Session
              </button>
              <button onClick={() => router.push('/client/fireteam')}
                className="flex-1 inline-flex items-center justify-center gap-1 bg-white/15 text-white font-semibold py-1.5 rounded-lg text-[11px] border border-white/20">
                <FaFire className="text-[10px]" /> FireTeam
              </button>
            </div>
          </section>

          {/* Schedule strip — 5-day calendar */}
          <section className="flex-shrink-0 bg-white rounded-xl border border-gray-100 shadow-sm px-3 py-2">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-gray-900">Schedule</span>
              <div className="flex items-center gap-0.5">
                <button type="button" onClick={() => setCalendarMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1))}
                  className="w-5 h-5 rounded flex items-center justify-center text-gray-400 hover:bg-gray-100 text-[10px]">
                  <FaChevronLeft />
                </button>
                <span className="px-1.5 py-0.5 rounded bg-[#9A6AE3] text-white text-[10px] font-semibold">
                  {calendarMonth.toLocaleString('default', { month: 'short', year: '2-digit' })}
                </span>
                <button type="button" onClick={() => setCalendarMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1))}
                  className="w-5 h-5 rounded flex items-center justify-center text-gray-400 hover:bg-gray-100 text-[10px]">
                  <FaChevronRight />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-1">
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
                      className={`relative py-1.5 rounded-lg text-center text-[11px] font-medium transition-colors ${
                        isSelected ? 'bg-[#9A6AE3] text-white' : isToday ? 'bg-purple-50 text-purple-700' : 'bg-gray-50 text-gray-600'
                      }`}>
                      <div className="text-[9px] opacity-70 leading-none">{d.toLocaleDateString('en-GB', { weekday: 'short' })}</div>
                      <div className="font-bold leading-tight">{d.getDate()}</div>
                      {hasSession && (
                        <div className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-[#9A6AE3]'}`} />
                      )}
                    </button>
                  );
                });
              })()}
            </div>
          </section>

          {/* Quick Actions — compact horizontal row */}
          <section className="flex-shrink-0">
            <div className="flex gap-1.5 overflow-x-auto">
              {[
                { icon: FaUsers,    title: 'Community',    href: '/client/community',  bg: 'bg-blue-50 text-blue-600' },
                { icon: FaPenFancy, title: 'Journal',      href: '/client/journal',    bg: 'bg-purple-50 text-purple-600' },
                { icon: FaRobot,    title: 'AI Chat',      href: '/client/aichatbot',  bg: 'bg-pink-50 text-pink-600' },
                { icon: FaChartLine,title: 'Life Score',   href: '/client/lifescores', bg: 'bg-amber-50 text-amber-600' },
                { icon: FaGraduationCap, title: 'Education', href: '/client/myeducationcompass', bg: 'bg-emerald-50 text-emerald-600' },
                { icon: FaBriefcase,title: 'Career',       href: '/client/mycareercompass', bg: 'bg-indigo-50 text-indigo-600' },
              ].map(({ icon: Icon, title, href, bg }) => (
                <a key={title} href={href}
                  className="flex-shrink-0 flex flex-col items-center gap-1 p-2 rounded-xl bg-white border border-gray-100 min-w-[56px]">
                  <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center`}>
                    <Icon className="text-xs" />
                  </div>
                  <span className="text-[9px] font-semibold text-gray-600 whitespace-nowrap">{title}</span>
                </a>
              ))}
            </div>
          </section>

          {/* Tab bar */}
          <div className="flex-shrink-0 flex bg-white rounded-xl border border-gray-100 shadow-sm p-1 gap-0.5">
            {mobileTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = mobileTab === tab.key;
              return (
                <button key={tab.key} type="button" onClick={() => setMobileTab(tab.key)}
                  className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-[11px] font-semibold transition-colors ${
                    isActive ? 'bg-[#9A6AE3] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'
                  }`}>
                  <Icon className="text-[10px]" />
                  <span className="hidden xs:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab content — fills remaining space */}
          <div className="flex-1 min-h-0 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">

            {/* Sessions tab */}
            {mobileTab === 'sessions' && (
              <div className="flex-1 flex flex-col p-3 min-h-0">
                <div className="flex items-center justify-between mb-2 flex-shrink-0">
                  <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <FaVideo className="text-indigo-500 text-[10px]" /> Upcoming Sessions
                  </h3>
                  <button className="text-[10px] font-semibold text-[#9A6AE3]" onClick={() => router.push('/client/session')}>
                    View all <FaArrowRight className="inline text-[8px]" />
                  </button>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto space-y-1.5">
                  {sessionsLoading ? (
                    [1,2,3].map(i => <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />)
                  ) : upcomingSessions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-6">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center mb-2">
                        <FaCalendar className="text-indigo-400 text-sm" />
                      </div>
                      <p className="text-xs text-gray-500 font-medium">No sessions scheduled</p>
                      <button onClick={() => router.push('/client/session')} className="mt-1.5 text-xs font-semibold text-[#9A6AE3]">
                        Book a session →
                      </button>
                    </div>
                  ) : (
                    upcomingSessions.slice(0, 5).map((session) => {
                      const dt = formatSessionDate(session.scheduled_at);
                      const isToday = dt?.dayLabel === 'Today';
                      return (
                        <div key={session.id}
                          className={`p-2.5 rounded-lg border text-xs ${isToday ? 'bg-indigo-50 border-indigo-100' : 'bg-gray-50 border-gray-100'}`}>
                          <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 truncate">{session.title || session.topic || 'Coaching Session'}</p>
                              {session.coach?.user?.name && <p className="text-gray-500 truncate text-[10px]">with {session.coach.user.name}</p>}
                            </div>
                            {dt && (
                              <div className={`flex-shrink-0 text-right ${isToday ? 'text-indigo-600' : 'text-gray-500'}`}>
                                <p className="font-bold text-[11px]">{dt.dayLabel}</p>
                                <p className="text-[9px]">{dt.time}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* Life Score tab */}
            {mobileTab === 'score' && (
              <div className="flex-1 flex flex-col p-3 min-h-0">
                <div className="flex items-center justify-between mb-2 flex-shrink-0">
                  <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <FaChartLine className="text-amber-500 text-[10px]" /> Life Score
                  </h3>
                  {avgScore !== null && (
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 rounded-full px-2 py-0.5">
                      {avgScore}/10
                    </span>
                  )}
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto space-y-2">
                  {scoreEntries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-6 text-center">
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
                            <span className={`text-[10px] font-bold flex-shrink-0 px-1.5 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>{num}/10</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full bg-gradient-to-r ${colors.bar} rounded-full transition-all duration-500`} style={{ width: `${num * 10}%` }} />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                <button className="mt-2 text-xs font-semibold text-[#9A6AE3] flex-shrink-0" onClick={() => router.push('/client/lifescores')}>
                  View detailed analysis →
                </button>
              </div>
            )}

            {/* Journal tab */}
            {mobileTab === 'journal' && (
              <div className="flex-1 flex flex-col p-3 min-h-0">
                <div className="flex items-center justify-between mb-2 flex-shrink-0">
                  <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <FaPenFancy className="text-purple-500 text-[10px]" /> Today's Prompt
                  </h3>
                  <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 rounded-full px-2 py-0.5">
                    Day {getDayOfYear()}
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
                      <p className="text-gray-400 text-xs py-4 text-center">No prompts available.</p>
                    ) : (
                      <div className="space-y-2">
                        {prompts.map((p, i) => (
                          <div key={`${p.number}-${i}`}
                            className={`rounded-lg p-3 ${i === 0 ? 'bg-purple-50 border border-purple-100' : 'bg-gray-50 border border-gray-100'}`}>
                            <span className={`text-[10px] font-bold uppercase tracking-wide ${i === 0 ? 'text-purple-600' : 'text-gray-400'}`}>
                              {p.dayLabel} · Prompt #{p.number}
                            </span>
                            <p className={`text-xs leading-relaxed mt-1 ${i === 0 ? 'text-gray-700' : 'text-gray-400'}`}>{p.text}</p>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
                <button className="mt-2 text-xs font-semibold text-[#9A6AE3] flex-shrink-0" onClick={() => router.push('/client/journal')}>
                  Open Journal →
                </button>
              </div>
            )}

            {/* Coaches tab */}
            {mobileTab === 'coaches' && (
              <div className="flex-1 flex flex-col p-3 min-h-0">
                <div className="flex items-center justify-between mb-2 flex-shrink-0">
                  <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <FaUsers className="text-pink-500 text-[10px]" /> Book a Coach
                  </h3>
                  <button className="text-[10px] font-semibold text-[#9A6AE3]" onClick={() => router.push('/client/session')}>View all</button>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto">
                  {availableForCoaching.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-6 text-center">
                      <p className="text-xs text-gray-500">No coaches available right now.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {availableForCoaching.map((p) => (
                        <div key={p.id} className="rounded-xl bg-gray-50 border border-gray-100 p-2.5 flex flex-col items-center text-center">
                          <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs mb-1.5 overflow-hidden">
                            {p.profile_image ? <img src={p.profile_image} alt="" className="w-full h-full object-cover" /> : p.initial}
                          </div>
                          <p className="font-semibold text-gray-900 text-[10px] truncate w-full">{p.name}</p>
                          <p className="text-[9px] text-gray-400 truncate w-full mb-1.5">{p.role}</p>
                          <button type="button" className="w-full py-1 rounded-lg bg-[#9A6AE3] text-white text-[10px] font-semibold"
                            onClick={() => router.push('/client/session')}>Book</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </main>

        {/* ═══════════ DESKTOP LAYOUT (scrollable, original structure) ═══════════ */}
        <main className="hidden md:flex flex-1 min-h-0 overflow-y-auto flex-col px-4 md:px-6 py-3 md:py-4">
          <div className="flex flex-col lg:flex-row gap-3 md:gap-4 max-w-7xl mx-auto w-full min-w-0">

            {/* ── Left / Main column ── */}
            <div className="flex-1 min-w-0 flex flex-col gap-3 md:gap-4">

              {/* Welcome hero banner */}
              <section className="flex-shrink-0 relative overflow-hidden rounded-2xl bg-[#9A6AE3] text-white shadow-sm">
                <div className="absolute top-2 left-16 w-10 h-10 rounded-full bg-white/20" aria-hidden />
                <div className="absolute bottom-4 left-24 w-8 h-8 rounded-full bg-white/15" aria-hidden />
                <div className="absolute top-4 right-1/3 w-6 h-6 rounded-full bg-white/10" aria-hidden />
                <div className="flex flex-row min-h-[150px]">
                  <div className="relative w-36 flex-shrink-0 flex items-end justify-center overflow-hidden">
                    <img src={profileImage || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=320&q=80"} alt="" className="h-full w-full object-cover object-bottom scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#9A6AE3] to-transparent opacity-60" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center px-5 py-4 pr-4">
                    <p className="text-white/80 text-xs font-medium uppercase tracking-widest mb-0.5">{greeting}</p>
                    <h2 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                      {user?.name ? user.name.split(' ')[0] : 'Welcome back'}!
                    </h2>
                    <p className="text-white/85 text-sm mt-1 leading-snug max-w-xl line-clamp-2">{progressSummary}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <button onClick={() => router.push('/client/session')}
                        className="inline-flex items-center gap-1.5 bg-white text-[#9A6AE3] hover:bg-white/95 font-semibold px-3 py-2 rounded-xl text-xs transition-colors shadow-sm">
                        <FaVideo className="text-sm" /> Schedule a Session
                      </button>
                      <button onClick={() => router.push('/client/fireteam')}
                        className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white font-semibold px-3 py-2 rounded-xl text-xs transition-colors border border-white/20">
                        <FaFire className="text-sm" /> FireTeam
                      </button>
                    </div>
                  </div>
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
                <h3 className="text-sm font-semibold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>Quick access</h3>
                <div className="grid grid-cols-6 gap-2">
                  <QuickActionCard icon={FaUsers}     title="Community"    href="/client/community"  iconBg="bg-blue-50 text-blue-600" />
                  <QuickActionCard icon={FaPenFancy}  title="Journal"      href="/client/journal"    iconBg="bg-purple-50 text-purple-600" />
                  <QuickActionCard icon={FaRobot}     title="AI Assistant" href="/client/aichatbot"  iconBg="bg-pink-50 text-pink-600" />
                  <QuickActionCard icon={FaChartLine} title="Life Score"   href="/client/lifescores" iconBg="bg-amber-50 text-amber-600" />
                  <QuickActionCard icon={FaFire}      title="FireTeam"     href="/client/fireteam"   iconBg="bg-orange-50 text-orange-600" />
                  <QuickActionCard icon={FaCalendar}  title="Sessions"     href="/client/session"    iconBg="bg-indigo-50 text-indigo-600" />
                </div>
              </section>

              {/* Content Grid */}
              <section className="flex-1 min-h-0 grid grid-cols-3 gap-3 overflow-hidden">
                {/* Upcoming Sessions */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col min-h-0 overflow-hidden">
                  <div className="flex items-center justify-between mb-3 flex-shrink-0">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                      <FaVideo className="text-indigo-500 text-xs" /> Upcoming Sessions
                    </h3>
                    <button className="text-[10px] font-semibold text-gray-400 hover:text-[#9A6AE3] flex items-center gap-0.5" onClick={() => router.push('/client/session')}>
                      View all <FaArrowRight className="text-[8px]" />
                    </button>
                  </div>
                  <div className="flex-1 min-h-0 overflow-y-auto space-y-2">
                    {sessionsLoading ? (
                      [1,2].map(i => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)
                    ) : upcomingSessions.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full py-4 text-center">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center mb-2"><FaCalendar className="text-indigo-400 text-sm" /></div>
                        <p className="text-xs text-gray-500 font-medium">No sessions scheduled</p>
                        <button onClick={() => router.push('/client/session')} className="mt-2 text-xs font-semibold text-[#9A6AE3] hover:underline">Book a session →</button>
                      </div>
                    ) : (
                      upcomingSessions.slice(0, 4).map((session) => {
                        const dt = formatSessionDate(session.scheduled_at);
                        const isToday = dt?.dayLabel === 'Today';
                        return (
                          <div key={session.id} className={`p-2.5 rounded-xl border text-xs ${isToday ? 'bg-indigo-50 border-indigo-100' : 'bg-gray-50 border-gray-100'}`}>
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="font-semibold text-gray-900 truncate">{session.title || session.topic || 'Coaching Session'}</p>
                                {session.coach?.user?.name && <p className="text-gray-500 truncate mt-0.5">with {session.coach.user.name}</p>}
                              </div>
                              {dt && (
                                <div className={`flex-shrink-0 text-right ${isToday ? 'text-indigo-600' : 'text-gray-500'}`}>
                                  <p className="font-bold">{dt.dayLabel}</p><p className="text-[10px]">{dt.time}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Life Score */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col min-h-0 overflow-hidden">
                  <div className="flex items-center justify-between mb-3 flex-shrink-0">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                      <FaChartLine className="text-amber-500 text-xs" /> Life Score
                    </h3>
                    {avgScore !== null && <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-100 rounded-full px-2 py-0.5">{avgScore}/10 avg</span>}
                  </div>
                  <div className="flex-1 min-h-0 overflow-y-auto space-y-2">
                    {scoreEntries.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full py-4 text-center">
                        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center mb-2"><FaChartLine className="text-amber-400 text-sm" /></div>
                        <p className="text-xs text-gray-500 font-medium">No score data yet</p>
                      </div>
                    ) : (
                      scoreEntries.map(([category, score]) => {
                        const num = Number(score);
                        const colors = getScoreColor(num);
                        return (
                          <div key={category}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="capitalize font-medium text-gray-700 text-xs truncate pr-2">{category.replace(/_/g, ' ')}</span>
                              <span className={`text-[10px] font-bold flex-shrink-0 px-1.5 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>{num}/10</span>
                            </div>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className={`h-full bg-gradient-to-r ${colors.bar} rounded-full transition-all duration-500`} style={{ width: `${num * 10}%` }} />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                  <button className="mt-2 text-xs font-semibold text-[#9A6AE3] hover:underline flex-shrink-0" onClick={() => router.push('/client/lifescores')}>View detailed analysis →</button>
                </div>

                {/* Journal Prompt */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col min-h-0 overflow-hidden">
                  <div className="flex items-center justify-between mb-3 flex-shrink-0">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                      <FaPenFancy className="text-purple-500 text-xs" /> Journal Prompt
                    </h3>
                    <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 border border-purple-100 rounded-full px-2 py-0.5">Today</span>
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
                      return prompts.length === 0 ? <p className="text-gray-400 text-xs">No prompts available.</p> : (
                        <div className="space-y-2">
                          {prompts.map((p, i) => (
                            <div key={`${p.number}-${i}`} className={`rounded-xl p-3 ${i === 0 ? 'bg-purple-50 border border-purple-100' : 'bg-gray-50 border border-gray-100'}`}>
                              <span className={`text-[10px] font-bold uppercase tracking-wide ${i === 0 ? 'text-purple-600' : 'text-gray-400'}`}>{p.dayLabel} · Prompt #{p.number}</span>
                              <p className={`text-xs leading-relaxed ${i === 0 ? 'text-gray-700' : 'text-gray-400'} line-clamp-3`}>{p.text}</p>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                  <button className="mt-2 text-xs font-semibold text-[#9A6AE3] hover:underline flex-shrink-0" onClick={() => router.push('/client/journal')}>Open Journal →</button>
                </div>
              </section>
            </div>

            {/* ── Right sidebar (desktop only) ── */}
            <aside className="w-full lg:w-64 xl:w-72 flex-shrink-0 min-w-0 flex flex-col gap-3">
              {/* User profile */}
              <div className="flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-200 border border-amber-300 flex items-center justify-center overflow-hidden flex-shrink-0 text-amber-800 font-bold text-sm">
                  {user?.profile_image ? <img src={user.profile_image} alt="" className="w-full h-full object-cover" /> :
                    <span>{(user?.name || 'A').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <button onClick={() => router.push('/client/accountsettings')} className="text-left min-w-0 w-full">
                    <p className="font-bold text-gray-900 truncate text-sm">{user?.name || 'Your Profile'}</p>
                    <p className="text-[10px] text-gray-400">View & edit profile</p>
                  </button>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => router.push('/client/accountsettings')} className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 text-xs"><FaCog /></button>
                  <button className="relative w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 text-xs" onClick={() => router.push('/client/accountsettings')}>
                    <FaBell />
                    {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center text-[8px] font-bold text-white">{unreadCount > 9 ? '9+' : unreadCount}</span>}
                  </button>
                </div>
              </div>

              {/* Schedule */}
              <div className="flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900">Schedule</h3>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => setCalendarMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1))} className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 text-xs"><FaChevronLeft /></button>
                    <span className="px-2 py-0.5 rounded-lg bg-[#9A6AE3] text-white text-xs font-semibold">{calendarMonth.toLocaleString('default', { month: 'short', year: '2-digit' })}</span>
                    <button type="button" onClick={() => setCalendarMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1))} className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 text-xs"><FaChevronRight /></button>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {(() => {
                    const start = new Date(calendarMonth); start.setDate(start.getDate() - start.getDay() + 1);
                    return [0,1,2,3,4].map((i) => {
                      const d = new Date(start); d.setDate(start.getDate() + i);
                      const isSelected = selectedDay.toDateString() === d.toDateString();
                      const isToday = d.toDateString() === new Date().toDateString();
                      const hasSession = upcomingSessions.some(s => { const sd = s.scheduled_at ? new Date(s.scheduled_at) : null; return sd && sd.toDateString() === d.toDateString(); });
                      return (
                        <button key={i} type="button" onClick={() => setSelectedDay(d)}
                          className={`relative py-2 rounded-xl text-center text-xs font-medium transition-colors ${isSelected ? 'bg-[#9A6AE3] text-white shadow-sm' : isToday ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
                          <div className="text-[10px] opacity-70">{d.toLocaleDateString('en-GB', { weekday: 'short' })}</div>
                          <div className="font-bold">{d.getDate()}</div>
                          {hasSession && <div className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-[#9A6AE3]'}`} />}
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
                    { icon: FaFileAlt, label: 'Application materials', href: '/client/mycareercompass', color: 'bg-purple-50 text-purple-600' },
                    { icon: FaCalendar, label: 'Appointments', href: '/client/mycareercompass', color: 'bg-indigo-50 text-indigo-600' },
                    { icon: FaSearch, label: 'Research tools', href: '/client/mycareercompass/researchtools', color: 'bg-sky-50 text-sky-600' },
                    { icon: FaClipboardList, label: 'Assignments', href: '/client/myeducationcompass', color: 'bg-amber-50 text-amber-600' },
                  ].map(({ icon: Icon, label, href, color }) => (
                    <button key={label} type="button" onClick={() => router.push(href)} className="flex items-center gap-2 p-2 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 text-left transition-colors">
                      <div className={`w-6 h-6 rounded-lg ${color} flex items-center justify-center flex-shrink-0`}><Icon className="text-[10px]" /></div>
                      <span className="font-medium text-gray-700 text-[11px] truncate leading-tight">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Coaches */}
              <div className="flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900">Book a Coach</h3>
                  <button type="button" onClick={() => router.push('/client/session')} className="text-[10px] font-semibold text-[#9A6AE3] hover:underline">View all</button>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-0.5">
                  {availableForCoaching.length === 0 ? <p className="text-[11px] text-gray-400 py-1">No coaches available.</p> :
                    availableForCoaching.map((p) => (
                      <div key={p.id} className="flex-shrink-0 w-24 rounded-xl bg-gray-50 border border-gray-100 p-2 flex flex-col items-center text-center">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs mb-1.5 overflow-hidden">
                          {p.profile_image ? <img src={p.profile_image} alt="" className="w-full h-full object-cover" /> : p.initial}
                        </div>
                        <p className="font-semibold text-gray-900 text-[10px] truncate w-full">{p.name}</p>
                        <p className="text-[9px] text-gray-400 truncate w-full mb-1.5">{p.role}</p>
                        <button type="button" className="w-full py-1 rounded-lg bg-[#9A6AE3] text-white text-[10px] font-semibold" onClick={() => router.push('/client/session')}>Book</button>
                      </div>
                    ))}
                </div>
              </div>

              {/* FireTeam */}
              <div className="flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5"><FaFire className="text-orange-500 text-xs" /> FireTeam Sessions</h3>
                  <button type="button" onClick={() => router.push('/client/fireteam')} className="text-[10px] font-semibold text-[#9A6AE3] hover:underline">View all</button>
                </div>
                <div className="space-y-1.5">
                  {upcomingExperiences.length === 0 ? <p className="text-[11px] text-gray-400 py-1">No upcoming fireteam sessions.</p> :
                    upcomingExperiences.slice(0, 3).map((exp) => (
                      <button key={exp.id} type="button" onClick={() => router.push('/client/fireteam')}
                        className="w-full text-left p-2.5 rounded-xl bg-orange-50 border border-orange-100 hover:bg-orange-100/60 transition-colors">
                        <p className="font-semibold text-gray-900 text-[11px] truncate">{exp.title || exp.name || 'Group session'}</p>
                        <p className="text-[10px] text-orange-600 truncate mt-0.5">{exp.fireteam?.title || 'FireTeam'}</p>
                      </button>
                    ))}
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
