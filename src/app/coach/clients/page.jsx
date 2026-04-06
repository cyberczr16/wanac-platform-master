"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import CoachSidebar from "../../../../components/dashboardcomponents/CoachSidebar";
import ClientTopbar from "../../../../components/dashboardcomponents/clienttopbar";
import { clientsService } from "../../../services/api/clients.service";
import { sessionsService } from "../../../services/api/sessions.service";
import { journalService } from "../../../services/api/journal.service";
import { tasksService } from "../../../services/api/tasks.service";

// ─── Inline SVG Icons ───────────────────────────
const SearchIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const UsersIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const MailIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
  </svg>
);
const PhoneIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const CalendarIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const MessageIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const UserIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const CheckCircleIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const XIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const ActivityIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);
const BookIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);
const ClipboardIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
);
const EyeIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);

// ─── Helpers ────────────────────────────────────
function normalizeClient(raw) {
  const id = raw?.id ?? raw?.user_id;
  const u = raw?.user;
  return {
    id,
    name: u?.name ?? raw?.name ?? "—",
    email: u?.email ?? raw?.email ?? "—",
    phone: u?.phone ?? raw?.phone ?? "—",
    status: raw?.status ?? "Active",
  };
}

function getInitials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "??";
}

const PALETTE = ["#9A6AE3", "#002147", "#f97316", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
function avatarColor(name = "") {
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return PALETTE[sum % PALETTE.length];
}

function statusBadge(status = "") {
  const s = status.toLowerCase();
  if (s === "active") return { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-500" };
  if (s === "inactive" || s === "paused") return { bg: "bg-gray-50 border-gray-200", text: "text-gray-600", dot: "bg-gray-400" };
  if (s === "pending") return { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", dot: "bg-amber-500" };
  return { bg: "bg-blue-50 border-blue-200", text: "text-blue-700", dot: "bg-blue-500" };
}

function fmtDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function statusColor(status = "") {
  const s = status.toLowerCase();
  if (s === "completed" || s === "done") return "bg-green-100 text-green-700";
  if (s === "scheduled" || s === "upcoming") return "bg-blue-100 text-blue-700";
  if (s === "pending") return "bg-amber-100 text-amber-700";
  if (s === "cancelled") return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-600";
}

// ─── Avatar Component ───────────────────────────
function Avatar({ name, size = 48 }) {
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-bold shrink-0 shadow-sm"
      style={{ width: size, height: size, fontSize: size * 0.36, background: avatarColor(name) }}
    >
      {getInitials(name)}
    </div>
  );
}

// ─── Client Profile Modal ───────────────────────
function ClientProfileModal({ client, onClose }) {
  const [sessions, setSessions] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [journals, setJournals] = useState([]);
  const [loadingJournals, setLoadingJournals] = useState(true);
  const [actionItems, setActionItems] = useState([]);
  const [loadingActions, setLoadingActions] = useState(true);
  const [newAction, setNewAction] = useState("");
  const [addingAction, setAddingAction] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!client?.id) return;

    // Fetch action items / tasks
    tasksService.getTasks().then((res) => {
      const all = Array.isArray(res) ? res : (res?.data || res?.tasks || []);
      const cid = String(client.id);
      const clientTasks = all.filter((t) =>
        String(t.client_id || t.user_id || t.assigned_to) === cid
      );
      setActionItems(clientTasks.length > 0 ? clientTasks : all);
      setLoadingActions(false);
    }).catch(() => setLoadingActions(false));

    // Fetch journals
    journalService.getJournals().then((res) => {
      const all = Array.isArray(res) ? res : (res?.data || res?.journals || []);
      const cid = String(client.id);
      const clientJournals = all.filter((j) =>
        String(j.client_id || j.user_id) === cid
      );
      setJournals(clientJournals.length > 0 ? clientJournals : all);
      setLoadingJournals(false);
    }).catch(() => setLoadingJournals(false));

    // Fetch sessions for this client
    sessionsService.getSessions().then((res) => {
      const raw = Array.isArray(res) ? res : (res?.data || res?.sessions?.data || []);
      const cid = String(client.id);
      const clientSessions = raw.filter((s) =>
        Array.isArray(s.session_members) &&
        s.session_members.some((m) => String(m.client_id || m.id) === cid || String(m.user_id) === cid)
      );
      setSessions(clientSessions);
      setLoadingSessions(false);
    }).catch(() => setLoadingSessions(false));

    // Fetch progress
    clientsService.getClientProgress(client.id).then((data) => {
      setProgress(data);
      setLoadingProgress(false);
    }).catch(() => setLoadingProgress(false));
  }, [client?.id]);

  const completedSessions = sessions.filter((s) => ["completed", "done"].includes((s.status || "").toLowerCase()));
  const upcomingSessions = sessions.filter((s) => ["scheduled", "upcoming", "pending"].includes((s.status || "").toLowerCase()));

  // Life scores
  const lifeScores = progress?.life_scores || progress?.lifeScores || progress?.scores || null;
  const SYSTEM_FIELDS = new Set(["id", "user_id", "client_id", "coach_id", "fire_team_id", "cohort_id", "created_at", "updated_at", "deleted_at", "date", "week", "month", "year"]);
  const scoreEntries = lifeScores && typeof lifeScores === "object" && !Array.isArray(lifeScores)
    ? Object.entries(lifeScores).filter(([k, v]) => !SYSTEM_FIELDS.has(k) && typeof v === "number" && v >= 0 && v <= 10)
    : null;

  const journalActivity = progress?.journal_entries || progress?.journals || progress?.journal_count || null;

  function scoreColor(v) {
    if (v >= 8) return { bar: "bg-green-500", text: "text-green-700" };
    if (v >= 5) return { bar: "bg-amber-500", text: "text-amber-700" };
    return { bar: "bg-red-500", text: "text-red-700" };
  }

  const badge = statusBadge(client.status);

  const TABS = [
    { key: "overview", label: "Overview", icon: UserIcon },
    { key: "sessions", label: "Sessions", icon: CalendarIcon },
    { key: "journal", label: "Journal", icon: BookIcon },
    { key: "actions", label: "Action Items", icon: ClipboardIcon },
    { key: "progress", label: "Progress", icon: ActivityIcon },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#002147] to-[#003875] p-6 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <XIcon size={16} />
          </button>
          <div className="flex items-center gap-4">
            <Avatar name={client.name} size={64} />
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-white truncate">{client.name}</h2>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                {client.email !== "—" && (
                  <div className="flex items-center gap-1.5 text-white/70 text-sm">
                    <MailIcon size={13} /> {client.email}
                  </div>
                )}
                {client.phone !== "—" && (
                  <div className="flex items-center gap-1.5 text-white/70 text-sm">
                    <PhoneIcon size={13} /> {client.phone}
                  </div>
                )}
              </div>
              <div className="mt-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badge.bg} ${badge.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                  {client.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-3 border-b border-gray-100 shrink-0">
          <div className="text-center py-3 border-r border-gray-100">
            <p className="text-lg font-bold text-[#002147]">{loadingSessions ? "..." : sessions.length}</p>
            <p className="text-[10px] text-gray-500 font-medium">Total Sessions</p>
          </div>
          <div className="text-center py-3 border-r border-gray-100">
            <p className="text-lg font-bold text-green-700">{loadingSessions ? "..." : completedSessions.length}</p>
            <p className="text-[10px] text-gray-500 font-medium">Completed</p>
          </div>
          <div className="text-center py-3">
            <p className="text-lg font-bold text-amber-700">{loadingSessions ? "..." : upcomingSessions.length}</p>
            <p className="text-[10px] text-gray-500 font-medium">Upcoming</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-2 pt-1 bg-gray-50/50 shrink-0">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold transition-all rounded-t-xl border-b-2 ${
                activeTab === tab.key
                  ? "text-[#002147] border-[#002147] bg-white"
                  : "text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              <tab.icon size={13} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5">

          {/* ── Overview Tab ── */}
          {activeTab === "overview" && (
            <div className="space-y-5">
              {/* Contact Info */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Contact Information</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-100">
                    <div className="p-2 rounded-lg bg-blue-50"><MailIcon size={14} className="text-blue-600" /></div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-gray-400 font-medium uppercase">Email</p>
                      <p className="text-sm text-gray-800 truncate">{client.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-100">
                    <div className="p-2 rounded-lg bg-green-50"><PhoneIcon size={14} className="text-green-600" /></div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-gray-400 font-medium uppercase">Phone</p>
                      <p className="text-sm text-gray-800">{client.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-100">
                    <div className="p-2 rounded-lg bg-purple-50"><UserIcon size={14} className="text-purple-600" /></div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-gray-400 font-medium uppercase">Status</p>
                      <p className="text-sm text-gray-800">{client.status}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-100">
                    <div className="p-2 rounded-lg bg-amber-50"><CalendarIcon size={14} className="text-amber-600" /></div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-gray-400 font-medium uppercase">Sessions</p>
                      <p className="text-sm text-gray-800">{loadingSessions ? "..." : sessions.length} total</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Life Scores Summary */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Life Scores</p>
                {loadingProgress ? (
                  <div className="flex items-center gap-2 py-3">
                    <div className="w-4 h-4 border-2 border-[#002147] border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-gray-400">Loading...</span>
                  </div>
                ) : scoreEntries && scoreEntries.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {scoreEntries.map(([key, val]) => {
                      const c = scoreColor(val);
                      return (
                        <div key={key} className="bg-white rounded-lg p-3 border border-gray-100">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs text-gray-600 capitalize">{key.replace(/_/g, " ")}</span>
                            <span className={`text-xs font-bold ${c.text}`}>{val}/10</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full ${c.bar}`} style={{ width: `${val * 10}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-400">
                    <ActivityIcon size={22} className="mx-auto mb-1 opacity-40" />
                    <p className="text-xs">No life score data yet.</p>
                  </div>
                )}
              </div>

              {/* Journal Activity */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Journal Activity</p>
                {loadingProgress ? (
                  <div className="flex items-center gap-2 py-2">
                    <div className="w-4 h-4 border-2 border-[#002147] border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-gray-400">Loading...</span>
                  </div>
                ) : journalActivity !== null && journalActivity !== undefined ? (
                  <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-100">
                    <div className="p-2.5 rounded-xl bg-purple-50">
                      <BookIcon size={18} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-[#002147]">
                        {typeof journalActivity === "number" ? journalActivity : Array.isArray(journalActivity) ? journalActivity.length : "—"}
                      </p>
                      <p className="text-xs text-gray-500">Journal entries written</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-400">
                    <BookIcon size={22} className="mx-auto mb-1 opacity-40" />
                    <p className="text-xs">No journal activity yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Sessions Tab ── */}
          {activeTab === "sessions" && (
            <div className="space-y-4">
              {loadingSessions ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-6 h-6 border-2 border-[#002147] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : sessions.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <CalendarIcon size={28} className="mx-auto mb-2 opacity-40" />
                  <p className="text-sm font-medium text-gray-500">No sessions found for this client.</p>
                  <a href={`/coach/sessions?client=${client.id}`} className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#002147] font-semibold hover:text-orange-500">
                    <CalendarIcon size={12} /> Schedule a session
                  </a>
                </div>
              ) : (
                <div className="space-y-2">
                  {sessions
                    .sort((a, b) => new Date(b.date || b.scheduled_at || 0) - new Date(a.date || a.scheduled_at || 0))
                    .map((s) => (
                    <a key={s.id} href={`/coach/sessions/fullviewsession/${s.id}`}
                      className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-100 transition-colors group">
                      <div className="text-center bg-white rounded-xl border border-gray-200 p-2 w-12 shrink-0 shadow-sm">
                        <p className="text-[10px] text-gray-500 font-medium leading-tight">
                          {(s.date || s.scheduled_at) ? new Date(s.date || s.scheduled_at).toLocaleDateString("en-US", { month: "short" }) : "—"}
                        </p>
                        <p className="text-lg font-bold text-[#002147] leading-tight">
                          {(s.date || s.scheduled_at) ? new Date(s.date || s.scheduled_at).getDate() : "?"}
                        </p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{s.title || "Session"}</p>
                        <p className="text-xs text-gray-500">{fmtDate(s.date || s.scheduled_at)}</p>
                      </div>
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold shrink-0 ${statusColor(s.status)}`}>
                        {s.status || "—"}
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Journal Tab ── */}
          {activeTab === "journal" && (
            <div className="space-y-4">
              {loadingJournals ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-6 h-6 border-2 border-[#002147] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : journals.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <BookIcon size={28} className="mx-auto mb-2 opacity-40" />
                  <p className="text-sm font-medium text-gray-500">No journal entries found.</p>
                  <p className="text-xs text-gray-400 mt-1">Journal entries will appear here when the client starts writing.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      {journals.length} {journals.length === 1 ? "Entry" : "Entries"}
                    </p>
                  </div>
                  <div className="space-y-3">
                    {journals
                      .sort((a, b) => new Date(b.created_at || b.date || 0) - new Date(a.created_at || a.date || 0))
                      .map((entry, idx) => {
                        const date = entry.created_at || entry.date || entry.updated_at;
                        return (
                          <div key={entry.id || idx} className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white">
                              <div className="p-2 rounded-lg bg-purple-50 shrink-0">
                                <BookIcon size={14} className="text-purple-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-[#002147] truncate">
                                  {entry.title || `Journal Entry ${entry.day_number ? `- Day ${entry.day_number}` : ""}`}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  {date && <p className="text-[10px] text-gray-400">{fmtDate(date)}</p>}
                                  {entry.prompt_number && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-medium">
                                      Prompt #{entry.prompt_number}
                                    </span>
                                  )}
                                  {entry.day_number && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 font-medium">
                                      Day {entry.day_number}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            {entry.content && (
                              <div className="px-4 py-3">
                                <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap line-clamp-4">
                                  {entry.content}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── Action Items Tab ── */}
          {activeTab === "actions" && (
            <div className="space-y-4">
              {/* Add new action item */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Add Action Item</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Complete life assessment worksheet..."
                    value={newAction}
                    onChange={(e) => setNewAction(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newAction.trim()) {
                        setAddingAction(true);
                        tasksService.addTask({
                          title: newAction.trim(),
                          client_id: client.id,
                          status: "pending",
                        }).then((created) => {
                          setActionItems((prev) => [created, ...prev]);
                          setNewAction("");
                        }).catch(() => {}).finally(() => setAddingAction(false));
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#002147]/10 focus:border-[#002147]"
                  />
                  <button
                    disabled={!newAction.trim() || addingAction}
                    onClick={() => {
                      if (!newAction.trim()) return;
                      setAddingAction(true);
                      tasksService.addTask({
                        title: newAction.trim(),
                        client_id: client.id,
                        status: "pending",
                      }).then((created) => {
                        setActionItems((prev) => [created, ...prev]);
                        setNewAction("");
                      }).catch(() => {}).finally(() => setAddingAction(false));
                    }}
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#002147] hover:bg-[#003875] disabled:opacity-50 transition-all shrink-0"
                  >
                    {addingAction ? "..." : "Add"}
                  </button>
                </div>
              </div>

              {/* Action items list */}
              {loadingActions ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-6 h-6 border-2 border-[#002147] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : actionItems.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <ClipboardIcon size={28} className="mx-auto mb-2 opacity-40" />
                  <p className="text-sm font-medium text-gray-500">No action items yet.</p>
                  <p className="text-xs text-gray-400 mt-1">Add follow-up tasks for this client above.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="px-2 py-1 rounded-full bg-amber-50 text-amber-700 font-semibold">
                      {actionItems.filter((t) => (t.status || "").toLowerCase() !== "completed" && (t.status || "").toLowerCase() !== "done").length} pending
                    </span>
                    <span className="px-2 py-1 rounded-full bg-green-50 text-green-700 font-semibold">
                      {actionItems.filter((t) => (t.status || "").toLowerCase() === "completed" || (t.status || "").toLowerCase() === "done").length} completed
                    </span>
                  </div>
                  <div className="space-y-2">
                    {actionItems
                      .sort((a, b) => {
                        const aD = (a.status || "").toLowerCase() === "completed" || (a.status || "").toLowerCase() === "done" ? 1 : 0;
                        const bD = (b.status || "").toLowerCase() === "completed" || (b.status || "").toLowerCase() === "done" ? 1 : 0;
                        if (aD !== bD) return aD - bD;
                        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
                      })
                      .map((item) => {
                        const isDone = (item.status || "").toLowerCase() === "completed" || (item.status || "").toLowerCase() === "done";
                        return (
                          <div key={item.id} className={`flex items-start gap-3 p-3.5 rounded-xl border transition-colors ${isDone ? "bg-gray-50 border-gray-100" : "bg-white border-gray-200 hover:border-gray-300"}`}>
                            <button
                              onClick={() => {
                                const newStatus = isDone ? "pending" : "completed";
                                tasksService.updateTask(String(item.id), { status: newStatus }).then(() => {
                                  setActionItems((prev) =>
                                    prev.map((t) => t.id === item.id ? { ...t, status: newStatus } : t)
                                  );
                                }).catch(() => {});
                              }}
                              className={`mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                isDone ? "bg-green-500 border-green-500 text-white" : "border-gray-300 hover:border-[#002147]"
                              }`}
                            >
                              {isDone && <CheckCircleIcon size={10} className="text-white" />}
                            </button>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm ${isDone ? "line-through text-gray-400" : "text-gray-800 font-medium"}`}>
                                {item.title || item.description || "Untitled task"}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                {item.created_at && (
                                  <p className="text-[10px] text-gray-400">{fmtDate(item.created_at)}</p>
                                )}
                                {item.due_date && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-50 text-red-600 font-medium">
                                    Due {fmtDate(item.due_date)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                tasksService.deleteTask(String(item.id)).then(() => {
                                  setActionItems((prev) => prev.filter((t) => t.id !== item.id));
                                }).catch(() => {});
                              }}
                              className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            >
                              <XIcon size={12} />
                            </button>
                          </div>
                        );
                      })}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── Progress Tab ── */}
          {activeTab === "progress" && (
            <div className="space-y-4">
              {/* Session breakdown */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-blue-50 rounded-xl">
                  <p className="text-xl font-bold text-[#002147]">{loadingSessions ? "..." : sessions.length}</p>
                  <p className="text-[10px] text-gray-500">Total</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-xl">
                  <p className="text-xl font-bold text-green-700">{loadingSessions ? "..." : completedSessions.length}</p>
                  <p className="text-[10px] text-gray-500">Completed</p>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-xl">
                  <p className="text-xl font-bold text-amber-700">{loadingSessions ? "..." : upcomingSessions.length}</p>
                  <p className="text-[10px] text-gray-500">Upcoming</p>
                </div>
              </div>

              {/* Life Scores Full */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Life Score Breakdown</p>
                {loadingProgress ? (
                  <div className="flex items-center gap-2 py-3">
                    <div className="w-4 h-4 border-2 border-[#002147] border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-gray-400">Loading...</span>
                  </div>
                ) : scoreEntries && scoreEntries.length > 0 ? (
                  <div className="space-y-3">
                    {scoreEntries.map(([key, val]) => {
                      const c = scoreColor(val);
                      return (
                        <div key={key}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-600 capitalize">{key.replace(/_/g, " ")}</span>
                            <span className={`text-xs font-bold ${c.text}`}>{val}/10</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className={`h-2 rounded-full transition-all duration-500 ${c.bar}`} style={{ width: `${val * 10}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-400">
                    <ActivityIcon size={22} className="mx-auto mb-1 opacity-40" />
                    <p className="text-xs">No life score data yet.</p>
                  </div>
                )}
              </div>

              {/* Journal */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Journal Activity</p>
                {loadingProgress ? (
                  <div className="flex items-center gap-2 py-2">
                    <div className="w-4 h-4 border-2 border-[#002147] border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-gray-400">Loading...</span>
                  </div>
                ) : journalActivity !== null && journalActivity !== undefined ? (
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-purple-50">
                      <BookIcon size={20} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-[#002147]">
                        {typeof journalActivity === "number" ? journalActivity : Array.isArray(journalActivity) ? journalActivity.length : "—"}
                      </p>
                      <p className="text-xs text-gray-500">Journal entries written</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-400">
                    <BookIcon size={22} className="mx-auto mb-1 opacity-40" />
                    <p className="text-xs">No journal activity yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-100 p-4 bg-gray-50/50 flex items-center gap-3 shrink-0">
          <a
            href={`/coach/messages?client=${client.id}`}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-600 hover:text-white transition-all"
          >
            <MessageIcon size={14} /> Message
          </a>
          <a
            href={`/coach/sessions?client=${client.id}`}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#002147] hover:bg-[#003875] transition-all"
          >
            <CalendarIcon size={14} /> Schedule Session
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────
export default function CoachClientsPage() {
  const [clients, setClients] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    async function fetchClients() {
      setLoading(true);
      setError(null);
      try {
        const data = await clientsService.getClients();
        const rawList = data?.clients ?? data?.data ?? (Array.isArray(data) ? data : []);
        setClients((rawList || []).map(normalizeClient));
      } catch {
        setError("Unable to load clients. Please try again.");
        setClients([]);
      } finally {
        setLoading(false);
      }
    }
    fetchClients();
    const userData = localStorage.getItem("wanacUser");
    if (userData) {
      try { setUser(JSON.parse(userData)); } catch { setUser(null); }
    }
  }, []);

  const filteredClients = useMemo(() => {
    if (!search.trim()) return clients;
    const q = search.trim().toLowerCase();
    return clients.filter(
      (c) =>
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.phone && String(c.phone).toLowerCase().includes(q))
    );
  }, [clients, search]);

  const activeCount = clients.filter((c) => (c.status || "").toLowerCase() === "active").length;

  return (
    <div className="h-screen flex bg-[#f5f5f5] font-body overflow-hidden">
      <CoachSidebar />
      <div className="flex-1 flex flex-col h-full min-w-0">
        <ClientTopbar user={user || { name: "Coach" }} />

        <main className="flex-1 h-0 overflow-y-auto px-4 md:px-6 py-5">
          <div className="max-w-7xl mx-auto space-y-5">

            {/* ── Page Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-[#002147] flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-100">
                    <UsersIcon size={20} className="text-purple-600" />
                  </div>
                  My Clients
                </h1>
                <p className="text-sm text-gray-500 mt-1 ml-12">Manage and connect with your coaching clients.</p>
              </div>
              <div className="relative">
                <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search clients..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full sm:w-72 pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#002147]/10 focus:border-[#002147] shadow-sm"
                  aria-label="Search clients"
                />
              </div>
            </div>

            {/* ── Stats Strip ── */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50">
                  <UsersIcon size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Total Clients</p>
                  <p className="text-xl font-bold text-[#002147]">{loading ? "..." : clients.length}</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50">
                  <CheckCircleIcon size={18} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Active</p>
                  <p className="text-xl font-bold text-emerald-700">{loading ? "..." : activeCount}</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-50">
                  <UserIcon size={18} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Showing</p>
                  <p className="text-xl font-bold text-[#002147]">
                    {loading ? "..." : filteredClients.length}
                    {search && <span className="text-sm font-normal text-gray-400"> / {clients.length}</span>}
                  </p>
                </div>
              </div>
            </div>

            {/* ── Client Cards Grid ── */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-200" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-100 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="h-px bg-gray-100" />
                    <div className="flex gap-2">
                      <div className="h-8 bg-gray-100 rounded-lg flex-1" />
                      <div className="h-8 bg-gray-100 rounded-lg flex-1" />
                      <div className="h-8 bg-gray-100 rounded-lg flex-1" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-8 text-center">
                <div className="p-3 rounded-full bg-red-50 inline-block mb-3">
                  <UsersIcon size={28} className="text-red-400" />
                </div>
                <p className="text-red-600 font-semibold">{error}</p>
                <p className="text-gray-500 text-sm mt-1">Check your connection and refresh the page.</p>
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
                <div className="p-4 rounded-2xl bg-gray-50 inline-block mb-4">
                  <UsersIcon size={36} className="text-gray-300" />
                </div>
                <p className="text-gray-700 font-semibold text-lg">
                  {search ? "No clients match your search" : "No clients yet"}
                </p>
                <p className="text-gray-500 text-sm mt-1 max-w-sm mx-auto">
                  {search ? "Try a different search term." : "Clients will appear here when they are assigned to you."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredClients.map((client) => {
                  const badge = statusBadge(client.status);
                  return (
                    <div
                      key={client.id}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all group"
                    >
                      {/* Card Top */}
                      <div className="p-5 pb-3">
                        <div className="flex items-start gap-3.5">
                          <Avatar name={client.name} size={48} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <h3 className="text-sm font-bold text-[#002147] truncate">{client.name}</h3>
                              <span className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badge.bg} ${badge.text}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                                {client.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-500">
                              <MailIcon size={11} className="shrink-0 text-gray-400" />
                              <span className="truncate">{client.email}</span>
                            </div>
                            {client.phone !== "—" && (
                              <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
                                <PhoneIcon size={11} className="shrink-0 text-gray-400" />
                                <span>{client.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="mx-5 border-t border-gray-100" />

                      {/* Quick Actions */}
                      <div className="p-3 flex items-center gap-2">
                        <button
                          onClick={() => setSelectedClient(client)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-[#002147] bg-gray-50 hover:bg-[#002147] hover:text-white transition-all"
                        >
                          <EyeIcon size={12} /> View Profile
                        </button>
                        <a
                          href={`/coach/messages?client=${client.id}`}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-600 hover:text-white transition-all"
                        >
                          <MessageIcon size={12} /> Message
                        </a>
                        <a
                          href={`/coach/sessions?client=${client.id}`}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-orange-700 bg-orange-50 hover:bg-orange-500 hover:text-white transition-all"
                        >
                          <CalendarIcon size={12} /> Schedule
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Client Profile Modal */}
      {selectedClient && (
        <ClientProfileModal
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
        />
      )}
    </div>
  );
}
