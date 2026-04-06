'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../../components/dashboardcomponents/sidebar';
import ClientTopbar from '../../../../components/dashboardcomponents/clienttopbar';
import AIChatbot from '../../../../components/dashboardcomponents/AIChatbot';
import { sessionsService } from '../../../services/api/sessions.service';
import { habitsService } from '../../../services/api/habits.service';

// ─── Icons ───────────────────────────────────────────────────────────────────
const Ic = {
  Brain:    () => <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24A2.5 2.5 0 0 0 14.5 2Z"/></svg>,
  Chart:    () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  Target:   () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  Calendar: () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Clock:    () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Star:     () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Heart:    () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  Bolt:     () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  ArrowRight: () => <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Check:    () => <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Lightbulb:() => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>,
  Bot:      () => <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>,
};

// ─── Life score category config ───────────────────────────────────────────────
const CATEGORY_CONFIG = {
  health:          { label: 'Health',          color: '#ef4444', bg: 'bg-red-500' },
  career:          { label: 'Career',          color: '#3b82f6', bg: 'bg-blue-500' },
  finances:        { label: 'Finances',        color: '#22c55e', bg: 'bg-green-500' },
  relationship:    { label: 'Relationships',   color: '#a855f7', bg: 'bg-purple-500' },
  relationships:   { label: 'Relationships',   color: '#a855f7', bg: 'bg-purple-500' },
  personal_growth: { label: 'Personal Growth', color: '#6366f1', bg: 'bg-indigo-500' },
  recreation:      { label: 'Recreation',      color: '#f59e0b', bg: 'bg-amber-500' },
  spirituality:    { label: 'Spirituality',    color: '#14b8a6', bg: 'bg-teal-500' },
  community:       { label: 'Community',       color: '#06b6d4', bg: 'bg-cyan-500' },
};

const ACTIVITY_ICONS = {
  sessions: <Ic.Calendar />,
  lifescore: <Ic.Chart />,
  upcoming: <Ic.Clock />,
  habits: <Ic.Check />,
  start: <Ic.Bolt />,
};

const ACTIVITY_COLORS = {
  sessions: 'border-blue-400 bg-blue-50',
  lifescore: 'border-indigo-400 bg-indigo-50',
  upcoming: 'border-amber-400 bg-amber-50',
  habits: 'border-green-400 bg-green-50',
  start: 'border-gray-300 bg-gray-50',
};

const QUICK_TIPS = [
  { tip: 'Set 1 clear goal for this week and write it down.', icon: <Ic.Target /> },
  { tip: 'Ask your AI coach a specific question — vague in, vague out.', icon: <Ic.Bot /> },
  { tip: 'Review your Life Scores every Friday to spot trends.', icon: <Ic.Chart /> },
  { tip: 'Small daily habits compound into major life changes.', icon: <Ic.Bolt /> },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function timeAgo(date) {
  if (!date) return '—';
  const d = new Date(date);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  const hrs  = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return mins <= 1 ? 'Just now' : `${mins}m ago`;
  if (hrs  < 24) return `${hrs}h ago`;
  if (days < 7)  return `${days}d ago`;
  return d.toLocaleDateString();
}

function toArray(val) {
  if (Array.isArray(val)) return val;
  if (val?.data && Array.isArray(val.data)) return val.data;
  if (val?.sessions?.data && Array.isArray(val.sessions.data)) return val.sessions.data;
  return [];
}

function avg(vals) {
  const nums = vals.filter(v => typeof v === 'number' && !isNaN(v));
  return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : null;
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color = 'text-[#002147]' }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-3.5 shadow-sm">
      <p className={`text-xl font-bold ${color}`}>{value}</p>
      <p className="text-[11px] font-semibold text-gray-700 mt-0.5">{label}</p>
      {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── Score bar ────────────────────────────────────────────────────────────────
function ScoreBar({ category, score }) {
  const cfg = CATEGORY_CONFIG[category] || { label: category.replace(/_/g, ' '), color: '#6b7280', bg: 'bg-gray-500' };
  const pct = Math.min(100, Math.max(0, score * 10));
  const colorClass = score >= 7 ? 'text-green-600' : score >= 4 ? 'text-amber-600' : 'text-red-500';
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-semibold text-gray-700 capitalize">{cfg.label}</span>
        <span className={`text-[11px] font-bold ${colorClass}`}>{score.toFixed(1)}<span className="text-gray-400 font-normal">/10</span></span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, backgroundColor: cfg.color }}
        />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AIInsightsPage() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [wholeLifeHistory, setWholeLifeHistory] = useState([]);
  const [todayHabits, setTodayHabits] = useState(null);

  // Load user
  useEffect(() => {
    try { setUser(JSON.parse(localStorage.getItem('wanacUser') || 'null')); } catch { setUser(null); }
  }, []);

  // Fetch data
  useEffect(() => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    Promise.all([
      sessionsService.getSessions().catch(() => []),
      habitsService.getWholeLifeHistory().catch(() => []),
      habitsService.getTodayDailyHabit().catch(() => null),
    ]).then(([sessRes, histRes, habitRes]) => {
      setSessions(toArray(sessRes));
      setWholeLifeHistory(toArray(histRes));
      setTodayHabits(habitRes?.data ?? habitRes ?? null);
      setLoading(false);
    });
  }, [user?.id]);

  // ── Derived stats ────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const weekStart = new Date(Date.now() - 7 * 86400000);
    const upcoming  = sessions.filter(s => s.scheduled_at && new Date(s.scheduled_at) > new Date()).length;
    const completed = sessions.filter(s => ['completed','done'].includes((s.status||'').toLowerCase())).length;
    const dated     = sessions.filter(s => s.scheduled_at || s.date || s.updated_at).map(s => new Date(s.scheduled_at || s.date || s.updated_at));
    const lastDate  = dated.length ? new Date(Math.max(...dated.map(d => d.getTime()))) : null;
    const scoresThisWeek = wholeLifeHistory.filter(h => h.created_at && new Date(h.created_at) >= weekStart).length;
    return { upcoming, completed, lastActive: lastDate ? timeAgo(lastDate) : '—', scoresThisWeek };
  }, [sessions, wholeLifeHistory]);

  // ── Life score entry (most recent) ───────────────────────────────────────
  const lifeScoreEntry = useMemo(() => {
    if (!wholeLifeHistory.length) return null;
    const latest = wholeLifeHistory[0];
    if (!latest || typeof latest !== 'object') return null;
    const omit = new Set(['id', 'created_at', 'updated_at', 'user_id', 'client_id', 'score']);
    const out = {};
    Object.entries(latest).forEach(([k, v]) => {
      if (omit.has(k)) return;
      const n = typeof v === 'number' ? v : parseFloat(v);
      if (!isNaN(n)) out[k] = n;
    });
    return Object.keys(out).length ? out : null;
  }, [wholeLifeHistory]);

  const overallScore = useMemo(() => {
    if (!lifeScoreEntry) return null;
    return avg(Object.values(lifeScoreEntry));
  }, [lifeScoreEntry]);

  // ── Life score context for AI chatbot ────────────────────────────────────
  const lifeScoreContext = useMemo(() => {
    if (!lifeScoreEntry) return '';
    const parts = Object.entries(lifeScoreEntry).map(([k, v]) => {
      const cfg = CATEGORY_CONFIG[k];
      return `${cfg?.label ?? k}: ${v}/10`;
    });
    return parts.join(', ');
  }, [lifeScoreEntry]);

  // ── Activity insights feed ───────────────────────────────────────────────
  const activityInsights = useMemo(() => {
    const list = [];
    if (stats.completed > 0)
      list.push({ id: 'sessions', title: 'Coaching sessions', description: `You've completed ${stats.completed} coaching session${stats.completed !== 1 ? 's' : ''}. Every session builds momentum.` });
    if (lifeScoreEntry)
      list.push({ id: 'lifescore', title: 'Life Score tracked', description: `Overall average: ${overallScore?.toFixed(1)}/10. Keep logging weekly to see your trend.` });
    if (stats.upcoming > 0)
      list.push({ id: 'upcoming', title: 'Upcoming sessions', description: `${stats.upcoming} session${stats.upcoming !== 1 ? 's' : ''} scheduled. Prepare 2–3 topics you want to cover.` });
    if (todayHabits)
      list.push({ id: 'habits', title: 'Daily habits logged', description: `You've tracked your habits today. Consistency is the key to lasting change.` });
    if (list.length === 0)
      list.push({ id: 'start', title: 'Get started', description: 'Complete a session, log your Life Score, or ask your AI coach a question to begin generating insights.' });
    return list.slice(0, 4);
  }, [stats, lifeScoreEntry, overallScore, todayHabits]);

  const firstName = user?.name?.split(' ')[0] || user?.firstName || '';
  const scoreColor = overallScore == null ? 'text-gray-400' : overallScore >= 7 ? 'text-green-400' : overallScore >= 4 ? 'text-amber-400' : 'text-red-400';

  return (
    <div className="h-screen flex bg-gray-50 font-body">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 flex flex-col h-full">
        <ClientTopbar user={user} />

        <main className="flex-1 h-0 overflow-y-auto px-4 md:px-6 py-4 bg-gray-50">
          <div className="max-w-6xl mx-auto space-y-4">

            {/* ── Hero ──────────────────────────────────────────────────── */}
            <section className="bg-gradient-to-br from-[#002147] to-[#003875] rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white translate-x-24 -translate-y-24" />
                <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-white -translate-x-16 translate-y-16" />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 bg-white/20 rounded-lg"><Ic.Brain /></div>
                    <span className="text-white/70 text-xs font-semibold uppercase tracking-wider">AI Insights</span>
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-1">
                    {firstName ? `Welcome back, ${firstName}!` : 'Welcome back!'}
                  </h1>
                  <p className="text-white/80 text-sm">Your personal AI life coach is ready to help you grow.</p>
                </div>

                {/* Quick stats strip */}
                {!loading && (
                  <div className="flex gap-3 flex-wrap">
                    <div className="bg-white/10 rounded-xl px-4 py-2.5 text-center min-w-[80px]">
                      <p className={`text-xl font-bold ${scoreColor}`}>
                        {overallScore != null ? overallScore.toFixed(1) : '—'}
                      </p>
                      <p className="text-white/70 text-[10px] font-medium">Life Score</p>
                    </div>
                    <div className="bg-white/10 rounded-xl px-4 py-2.5 text-center min-w-[80px]">
                      <p className="text-xl font-bold text-white">{stats.completed}</p>
                      <p className="text-white/70 text-[10px] font-medium">Sessions</p>
                    </div>
                    <div className="bg-white/10 rounded-xl px-4 py-2.5 text-center min-w-[80px]">
                      <p className="text-xl font-bold text-white">{stats.upcoming}</p>
                      <p className="text-white/70 text-[10px] font-medium">Upcoming</p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <div className="flex flex-col lg:flex-row gap-4">
              {/* ── Main column ─────────────────────────────────────────── */}
              <div className="flex-1 space-y-4 min-w-0">

                {/* Life Score Snapshot */}
                <section className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600"><Ic.Chart /></div>
                      <h3 className="text-sm font-bold text-gray-900">Life Score Snapshot</h3>
                    </div>
                    {overallScore != null && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-gray-500">Overall</span>
                        <span className={`text-sm font-bold ${overallScore >= 7 ? 'text-green-600' : overallScore >= 4 ? 'text-amber-600' : 'text-red-500'}`}>
                          {overallScore.toFixed(1)}/10
                        </span>
                      </div>
                    )}
                  </div>

                  {loading ? (
                    <div className="space-y-3">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="animate-pulse">
                          <div className="h-3 bg-gray-100 rounded w-1/3 mb-1.5" />
                          <div className="h-2 bg-gray-100 rounded-full" />
                        </div>
                      ))}
                    </div>
                  ) : lifeScoreEntry && Object.keys(lifeScoreEntry).length > 0 ? (
                    <div className="space-y-3">
                      {Object.entries(lifeScoreEntry).map(([cat, val]) => (
                        <ScoreBar key={cat} category={cat} score={val} />
                      ))}
                      <button
                        onClick={() => router.push('/client/lifescores')}
                        className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-[#002147] hover:text-orange-500 transition-colors"
                      >
                        View full Life Scores <Ic.ArrowRight />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-3 text-indigo-400"><Ic.Chart /></div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">No life scores yet</p>
                      <p className="text-[11px] text-gray-400 mb-3">Track your balance across health, career, relationships, and more.</p>
                      <button
                        onClick={() => router.push('/client/lifescores')}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#002147] text-white rounded-xl text-xs font-semibold hover:bg-[#003875] transition-colors"
                      >
                        Add your first Life Score <Ic.ArrowRight />
                      </button>
                    </div>
                  )}
                </section>

                {/* AI Chat */}
                <section className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 bg-[#002147]/10 rounded-lg text-[#002147]"><Ic.Bot /></div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">AI Life Coach</h3>
                      <p className="text-[10px] text-gray-400">Powered by GPT — ask anything about your growth</p>
                    </div>
                  </div>
                  <AIChatbot lifeScoreContext={lifeScoreContext} />
                </section>

                {/* Recent Activity */}
                <section className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600"><Ic.Bolt /></div>
                    <h3 className="text-sm font-bold text-gray-900">Recent activity & insights</h3>
                  </div>
                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[1,2].map(i => <div key={i} className="h-20 bg-gray-50 rounded-xl animate-pulse" />)}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {activityInsights.map((item) => (
                        <div
                          key={item.id}
                          className={`border-l-4 rounded-xl p-4 ${ACTIVITY_COLORS[item.id] || 'border-gray-200 bg-gray-50'}`}
                        >
                          <div className="flex items-center gap-1.5 mb-1.5 text-gray-600">
                            {ACTIVITY_ICONS[item.id]}
                            <span className="text-[11px] font-bold text-gray-800">{item.title}</span>
                          </div>
                          <p className="text-[11px] text-gray-600 leading-relaxed">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>

              {/* ── Sidebar ─────────────────────────────────────────────── */}
              <aside className="w-full lg:w-64 shrink-0 space-y-4">

                {/* Stats grid */}
                <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                  <h5 className="text-xs font-bold text-gray-900 mb-3 flex items-center gap-1.5">
                    <Ic.Target /> Your stats
                  </h5>
                  {loading ? (
                    <div className="grid grid-cols-2 gap-2">
                      {[1,2,3,4].map(i => <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse" />)}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <StatCard label="Sessions done"     value={stats.completed}      color="text-[#002147]" />
                      <StatCard label="Upcoming"          value={stats.upcoming}        color="text-amber-600" />
                      <StatCard label="Score updates"     value={stats.scoresThisWeek} sub="this week" color="text-indigo-600" />
                      <StatCard label="Last active"       value={stats.lastActive}      color="text-green-600" />
                    </div>
                  )}
                </div>

                {/* Today's habits */}
                {!loading && (
                  <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                    <h5 className="text-xs font-bold text-gray-900 mb-3 flex items-center gap-1.5">
                      <Ic.Check /> Today's habits
                    </h5>
                    {todayHabits && Object.keys(todayHabits).length > 0 ? (
                      <div className="space-y-2">
                        {Object.entries(todayHabits)
                          .filter(([k]) => !['id','user_id','created_at','updated_at','date'].includes(k))
                          .slice(0, 5)
                          .map(([k, v]) => (
                            <div key={k} className="flex items-center justify-between">
                              <span className="text-[11px] text-gray-600 capitalize">{k.replace(/_/g, ' ')}</span>
                              <span className="text-[11px] font-bold text-[#002147]">{v}</span>
                            </div>
                          ))}
                        <button
                          onClick={() => router.push('/client/lifescores')}
                          className="mt-1 text-[10px] text-[#002147] hover:text-orange-500 font-semibold transition-colors"
                        >
                          Update habits →
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-2">
                        <p className="text-[11px] text-gray-400 mb-2">No habits logged today.</p>
                        <button
                          onClick={() => router.push('/client/lifescores')}
                          className="text-[10px] font-semibold text-[#002147] hover:text-orange-500 transition-colors"
                        >
                          Log today's habits →
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Quick tips */}
                <div className="bg-gradient-to-br from-[#002147] to-[#003875] rounded-2xl p-4 shadow-sm">
                  <h5 className="text-xs font-bold text-white mb-3 flex items-center gap-1.5">
                    <Ic.Lightbulb /> Quick tips
                  </h5>
                  <ul className="space-y-2.5">
                    {QUICK_TIPS.map((t, i) => (
                      <li key={i} className="flex gap-2 items-start">
                        <span className="text-white/60 mt-0.5 shrink-0">{t.icon}</span>
                        <span className="text-[11px] text-white/80 leading-relaxed">{t.tip}</span>
                      </li>
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
