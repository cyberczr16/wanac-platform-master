"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import CoachSidebar from "../../../../components/dashboardcomponents/CoachSidebar";
import ClientTopbar from "../../../../components/dashboardcomponents/clienttopbar";
import { sessionsService } from "../../../services/api/sessions.service";
import { clientsService } from "../../../services/api/clients.service";
import { programEnrollmentsService } from "../../../services/api/programEnrollments.service";
import { ProgramsService } from "../../../services/api/programs.service";

// ─── Icons ──────────────────────────────────────
const BarChartIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);
const UsersIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const CalendarIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const CheckIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const ClockIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const TrendUpIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
  </svg>
);
const BookIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

// ─── Helpers ────────────────────────────────────
function normalizeClient(raw) {
  const u = raw?.user;
  return { id: raw?.id ?? raw?.user_id, name: u?.name ?? raw?.name ?? "—", email: u?.email ?? raw?.email ?? "—" };
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getInitials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "??";
}
const PALETTE = ["#9A6AE3", "#002147", "#f97316", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
function colorFor(name = "") {
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return PALETTE[sum % PALETTE.length];
}

// Simple horizontal bar
function HBar({ value, max, color = "bg-blue-500" }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="w-full bg-gray-100 rounded-full h-2">
      <div className={`h-2 rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function CoachAnalyticsPage() {
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [clients, setClients] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = localStorage.getItem("wanacUser");
    if (u) try { setUser(JSON.parse(u)); } catch {}
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [sessRes, clientsRes, progsRes] = await Promise.all([
        sessionsService.getSessions().catch(() => []),
        clientsService.getClients().catch(() => []),
        ProgramsService.getAll().catch(() => []),
      ]);
      const rawSess = Array.isArray(sessRes) ? sessRes : (sessRes?.data || sessRes?.sessions?.data || []);
      const rawClients = Array.isArray(clientsRes) ? clientsRes : (clientsRes?.clients || clientsRes?.data || []);
      const rawProgs = Array.isArray(progsRes) ? progsRes : (progsRes?.data || progsRes?.programs || []);
      setSessions(rawSess);
      setClients((rawClients || []).map(normalizeClient));
      setPrograms(rawProgs);
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Computed metrics ──
  const totalSessions = sessions.length;
  const completedSessions = sessions.filter((s) => ["completed", "done"].includes((s.status || "").toLowerCase())).length;
  const upcomingSessions = sessions.filter((s) => ["scheduled", "upcoming", "pending"].includes((s.status || "").toLowerCase())).length;
  const cancelledSessions = sessions.filter((s) => (s.status || "").toLowerCase() === "cancelled").length;
  const completionRate = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

  // Estimated hours (assume ~1h per session)
  const estimatedHours = sessions.reduce((sum, s) => sum + (s.duration_minutes ? s.duration_minutes / 60 : 1), 0);

  // Sessions per month (last 6 months)
  const sessionsPerMonth = useMemo(() => {
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = d.getMonth();
      const year = d.getFullYear();
      const count = sessions.filter((s) => {
        const sd = new Date(s.date || s.scheduled_at);
        return sd.getMonth() === month && sd.getFullYear() === year;
      }).length;
      months.push({ label: `${MONTHS[month]} ${year}`, count });
    }
    return months;
  }, [sessions]);

  const maxMonthly = Math.max(...sessionsPerMonth.map((m) => m.count), 1);

  // Client engagement: sessions per client
  const clientEngagement = useMemo(() => {
    const map = {};
    sessions.forEach((s) => {
      if (Array.isArray(s.session_members)) {
        s.session_members.forEach((m) => {
          const cid = String(m.client_id || m.id || m.user_id);
          map[cid] = (map[cid] || 0) + 1;
        });
      }
    });
    return clients.map((c) => ({ ...c, sessionCount: map[String(c.id)] || 0 }))
      .sort((a, b) => b.sessionCount - a.sessionCount);
  }, [sessions, clients]);

  const maxClientSessions = Math.max(...clientEngagement.map((c) => c.sessionCount), 1);

  // Status distribution
  const statusDist = [
    { label: "Completed", count: completedSessions, color: "bg-green-500", textColor: "text-green-700", bgColor: "bg-green-50" },
    { label: "Upcoming", count: upcomingSessions, color: "bg-blue-500", textColor: "text-blue-700", bgColor: "bg-blue-50" },
    { label: "Cancelled", count: cancelledSessions, color: "bg-red-500", textColor: "text-red-700", bgColor: "bg-red-50" },
  ];

  return (
    <div className="h-screen flex bg-[#f5f5f5] font-body overflow-hidden">
      <CoachSidebar />
      <div className="flex-1 flex flex-col h-full min-w-0">
        <ClientTopbar user={user} />

        <main className="flex-1 h-0 overflow-y-auto px-4 md:px-6 py-5">
          <div className="max-w-7xl mx-auto space-y-5">

            {/* ── Header ── */}
            <div className="bg-gradient-to-br from-[#002147] via-[#003a7a] to-[#002147] rounded-2xl px-6 py-5 relative overflow-hidden shadow-sm">
              <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_80%_20%,white,transparent)] pointer-events-none" />
              <div className="relative z-10">
                <p className="text-white/60 text-[10px] font-medium uppercase tracking-widest">Coaching Analytics</p>
                <h1 className="text-xl font-bold text-white">Performance Overview</h1>
                <p className="text-white/70 text-xs mt-0.5">Track your sessions, client engagement, and coaching metrics.</p>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-3 border-[#002147] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* ── KPI Cards ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { label: "Total Sessions", value: totalSessions, icon: CalendarIcon, color: "bg-blue-50 text-blue-600", valueColor: "text-[#002147]" },
                    { label: "Completed", value: completedSessions, icon: CheckIcon, color: "bg-green-50 text-green-600", valueColor: "text-green-700", sub: `${completionRate}% rate` },
                    { label: "Active Clients", value: clients.length, icon: UsersIcon, color: "bg-purple-50 text-purple-600", valueColor: "text-purple-700" },
                    { label: "Hours Coached", value: estimatedHours.toFixed(1), icon: ClockIcon, color: "bg-amber-50 text-amber-600", valueColor: "text-amber-700" },
                  ].map((kpi) => (
                    <div key={kpi.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-2 rounded-xl ${kpi.color}`}><kpi.icon size={14} /></div>
                        <span className="text-[11px] text-gray-500 font-medium">{kpi.label}</span>
                      </div>
                      <p className={`text-2xl font-bold ${kpi.valueColor}`}>{kpi.value}</p>
                      {kpi.sub && <p className="text-[10px] text-gray-400 mt-0.5">{kpi.sub}</p>}
                    </div>
                  ))}
                </div>

                {/* ── Charts Row ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                  {/* Sessions Over Time */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendUpIcon size={14} className="text-blue-500" />
                      <h3 className="text-sm font-bold text-[#002147]">Sessions Over Time</h3>
                    </div>
                    <div className="space-y-3">
                      {sessionsPerMonth.map((m) => (
                        <div key={m.label} className="flex items-center gap-3">
                          <span className="text-[10px] text-gray-500 font-medium w-16 shrink-0">{m.label.split(" ")[0]}</span>
                          <div className="flex-1"><HBar value={m.count} max={maxMonthly} color="bg-blue-500" /></div>
                          <span className="text-xs font-bold text-[#002147] w-6 text-right">{m.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Session Status Distribution */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <BarChartIcon size={14} className="text-green-500" />
                      <h3 className="text-sm font-bold text-[#002147]">Session Status</h3>
                    </div>
                    <div className="space-y-4">
                      {statusDist.map((s) => (
                        <div key={s.label}>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs text-gray-600 font-medium">{s.label}</span>
                            <span className={`text-xs font-bold ${s.textColor}`}>{s.count}</span>
                          </div>
                          <HBar value={s.count} max={totalSessions} color={s.color} />
                        </div>
                      ))}
                    </div>
                    {/* Completion ring */}
                    <div className="mt-5 flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                      <div className="relative w-14 h-14 shrink-0">
                        <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="15" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                          <circle cx="18" cy="18" r="15" fill="none" stroke="#10b981" strokeWidth="3"
                            strokeDasharray={`${completionRate * 0.94} 100`} strokeLinecap="round" />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-green-700">{completionRate}%</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#002147]">Completion Rate</p>
                        <p className="text-xs text-gray-500">{completedSessions} of {totalSessions} sessions completed</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Client Engagement ── */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <UsersIcon size={14} className="text-purple-500" />
                    <h3 className="text-sm font-bold text-[#002147]">Client Engagement</h3>
                    <span className="text-[10px] text-gray-400 ml-1">Sessions per client</span>
                  </div>
                  {clientEngagement.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <UsersIcon size={24} className="mx-auto mb-1.5 opacity-40" />
                      <p className="text-xs">No client data available.</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {clientEngagement.slice(0, 10).map((c) => (
                        <div key={c.id} className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0" style={{ background: colorFor(c.name) }}>
                            {getInitials(c.name)}
                          </div>
                          <span className="text-xs text-gray-700 font-medium w-28 truncate shrink-0">{c.name}</span>
                          <div className="flex-1"><HBar value={c.sessionCount} max={maxClientSessions} color="bg-purple-500" /></div>
                          <span className="text-xs font-bold text-purple-700 w-6 text-right">{c.sessionCount}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ── Programs Summary ── */}
                {programs.length > 0 && (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <BookIcon size={14} className="text-amber-500" />
                      <h3 className="text-sm font-bold text-[#002147]">Programs</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {programs.map((p) => (
                        <div key={p.id} className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                          <p className="text-sm font-semibold text-gray-800 truncate">{p.title || p.name}</p>
                          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{p.description || "No description"}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
