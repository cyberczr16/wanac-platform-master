"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import CoachSidebar from "../../../components/dashboardcomponents/CoachSidebar";
import ClientTopbar from "../../../components/dashboardcomponents/clienttopbar";
import ScheduleSessionModal from "../../../components/dashboardcomponents/ScheduleSessionModal";
import { sessionsService } from "../../services/api/sessions.service";
import { clientsService } from "../../services/api/clients.service";

// ─────────────────────────────────────────────
// Inline SVG Icons
// ─────────────────────────────────────────────
const UsersIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const CalendarIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const ClipboardIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
  </svg>
);
const ChartIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);
const BookIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);
const PaperclipIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
  </svg>
);
const LinkIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);
const PenIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>
);
const TrashIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);
const CheckIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const XIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const SearchIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const ArrowRightIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const FireIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z"/>
  </svg>
);
const ChevronRightIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
const UploadIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
  </svg>
);
const ActivityIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);
const PlusIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function normalizeClient(raw) {
  const id = raw?.id ?? raw?.user_id;
  const u = raw?.user;
  return {
    id,
    name: u?.name ?? raw?.name ?? '—',
    email: u?.email ?? raw?.email ?? '—',
    phone: u?.phone ?? raw?.phone ?? '—',
    status: raw?.status ?? 'Active',
  };
}

function getInitials(name = "") {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "??";
}
function fmtDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function fmtTime(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return "";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function statusColor(status = "") {
  const s = status.toLowerCase();
  if (s === "completed" || s === "done") return "bg-green-100 text-green-700";
  if (s === "scheduled" || s === "upcoming") return "bg-blue-100 text-blue-700";
  if (s === "pending") return "bg-amber-100 text-amber-700";
  if (s === "cancelled") return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-600";
}
const PALETTE = ["#9A6AE3","#002147","#f97316","#0ea5e9","#10b981","#f59e0b","#ef4444","#8b5cf6"];
function avatarColor(name = "") {
  return PALETTE[name.charCodeAt(0) % PALETTE.length];
}

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────
function Avatar({ name, size = 36 }) {
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-bold shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.36, background: avatarColor(name) }}
    >
      {getInitials(name)}
    </div>
  );
}

// ── Notes Panel ──────────────────────────────
function NotesPanel({ sessions, clientName }) {
  const [noteText, setNoteText] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [toast, setToast] = useState("");

  // Collect all notes from all client sessions
  useEffect(() => {
    const allNotes = [];
    sessions.forEach(s => {
      if (Array.isArray(s.session_notes)) {
        s.session_notes.forEach(n => allNotes.push({ ...n, sessionTitle: s.title || `Session ${s.id}`, sessionId: s.id }));
      }
    });
    allNotes.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    setNotes(allNotes);
  }, [sessions]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const handleSave = async () => {
    const sid = selectedSession || sessions[0]?.id;
    if (!sid) return showToast("Please select a session first.");
    if (!noteText.trim()) return showToast("Note content is required.");
    setSaving(true);
    try {
      if (editingNote) {
        const updated = await sessionsService.updateNote(editingNote.id, { content: noteText, title: noteTitle || undefined });
        setNotes(prev => prev.map(n => n.id === editingNote.id ? { ...n, ...updated, content: noteText, title: noteTitle } : n));
        showToast("Note updated!");
        setEditingNote(null);
      } else {
        const created = await sessionsService.addNote({ session_id: sid, content: noteText, title: noteTitle || undefined });
        const sess = sessions.find(s => String(s.id) === String(sid));
        setNotes(prev => [{ ...created, sessionTitle: sess?.title || `Session ${sid}`, sessionId: sid }, ...prev]);
        showToast("Note saved!");
      }
      setNoteText(""); setNoteTitle(""); setSelectedSession("");
    } catch {
      showToast("Failed to save note.");
    } finally { setSaving(false); }
  };

  const handleDelete = async (noteId) => {
    try {
      await sessionsService.deleteNote(noteId);
      setNotes(prev => prev.filter(n => n.id !== noteId));
      showToast("Note deleted.");
    } catch { showToast("Failed to delete."); }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setNoteText(note.content || "");
    setNoteTitle(note.title || "");
    setSelectedSession(String(note.sessionId));
  };

  return (
    <div className="space-y-4">
      {toast && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
          <CheckIcon size={13} /> {toast}
        </div>
      )}

      {/* Create / Edit form */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-3">
          {editingNote ? "Edit Note" : `New Note for ${clientName}`}
        </p>
        <div className="space-y-2.5">
          <input
            type="text"
            value={noteTitle}
            onChange={e => setNoteTitle(e.target.value)}
            placeholder="Note title (optional)"
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#002147]/10 focus:border-[#002147]"
          />
          {sessions.length > 0 && (
            <select
              value={selectedSession}
              onChange={e => setSelectedSession(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#002147]/10 focus:border-[#002147] bg-white"
            >
              <option value="">Link to session (optional)</option>
              {sessions.map(s => (
                <option key={s.id} value={s.id}>{s.title || `Session ${s.id}`} — {fmtDate(s.date || s.scheduled_at)}</option>
              ))}
            </select>
          )}
          <textarea
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
            rows={4}
            placeholder="Write your session notes here…"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#002147]/10 focus:border-[#002147]"
          />
          <div className="flex gap-2">
            {editingNote && (
              <button onClick={() => { setEditingNote(null); setNoteText(""); setNoteTitle(""); setSelectedSession(""); }}
                className="px-4 py-2 text-xs rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-100 font-semibold">
                Cancel
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={saving || !noteText.trim()}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-bold transition-all ${
                !saving && noteText.trim() ? "bg-[#002147] text-white hover:bg-[#003875]" : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              <PenIcon size={13} /> {saving ? "Saving…" : editingNote ? "Update Note" : "Save Note"}
            </button>
          </div>
        </div>
      </div>

      {/* Notes list */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
          Past Notes ({notes.length})
        </p>
        {notes.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <ClipboardIcon size={28} className="mx-auto mb-2 opacity-40" />
            <p className="text-xs">No notes yet. Write your first note above.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notes.map(note => (
              <div key={note.id} className="bg-white border border-gray-100 rounded-xl p-3.5 group hover:shadow-sm transition-all">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    {note.title && <p className="text-sm font-semibold text-[#002147] mb-0.5">{note.title}</p>}
                    <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap line-clamp-3">{note.content}</p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-[10px] text-gray-400">{fmtDate(note.created_at)}</span>
                      {note.sessionTitle && <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">{note.sessionTitle}</span>}
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button onClick={() => handleEdit(note)} className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                      <PenIcon size={12} />
                    </button>
                    <button onClick={() => handleDelete(note.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                      <TrashIcon size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Progress Panel ─────────────────────────────
function ProgressPanel({ client, sessions }) {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!client?.id) { setLoading(false); return; }
    clientsService.getClientProgress(client.id).then(data => {
      setProgress(data);
      setLoading(false);
    });
  }, [client?.id]);

  const completedSessions = sessions.filter(s => ["completed", "done"].includes((s.status || "").toLowerCase()));
  const upcomingSessions = sessions.filter(s => ["scheduled", "upcoming", "pending"].includes((s.status || "").toLowerCase()));

  // Extract life scores from progress data
  const lifeScores = progress?.life_scores || progress?.lifeScores || progress?.scores || null;
  const journalActivity = progress?.journal_entries || progress?.journals || progress?.journal_count || null;

  const SYSTEM_FIELDS = new Set(["id","user_id","client_id","coach_id","fire_team_id","cohort_id","created_at","updated_at","deleted_at","date","week","month","year"]);
  const scoreEntries = lifeScores && typeof lifeScores === "object" && !Array.isArray(lifeScores)
    ? Object.entries(lifeScores).filter(([k, v]) => !SYSTEM_FIELDS.has(k) && typeof v === "number" && v >= 0 && v <= 10)
    : null;

  function scoreColor(v) {
    if (v >= 8) return { bar: "bg-green-500", text: "text-green-700", bg: "bg-green-50" };
    if (v >= 5) return { bar: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50" };
    return { bar: "bg-red-500", text: "text-red-700", bg: "bg-red-50" };
  }

  return (
    <div className="space-y-4">
      {/* Session History */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Session History</p>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-3 bg-blue-50 rounded-xl">
            <p className="text-xl font-bold text-[#002147]">{sessions.length}</p>
            <p className="text-[10px] text-gray-500">Total</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-xl">
            <p className="text-xl font-bold text-green-700">{completedSessions.length}</p>
            <p className="text-[10px] text-gray-500">Completed</p>
          </div>
          <div className="text-center p-3 bg-amber-50 rounded-xl">
            <p className="text-xl font-bold text-amber-700">{upcomingSessions.length}</p>
            <p className="text-[10px] text-gray-500">Upcoming</p>
          </div>
        </div>
        {sessions.length > 0 && (
          <div className="space-y-1.5">
            {sessions.slice(0, 4).map(s => (
              <div key={s.id} className="flex items-center justify-between text-xs py-1 border-b border-gray-50 last:border-0">
                <span className="text-gray-700 truncate pr-2">{s.title || `Session ${s.id}`}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-gray-400">{fmtDate(s.date || s.scheduled_at)}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColor(s.status)}`}>{s.status || "—"}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Life Score Trends */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Life Score</p>
        {loading ? (
          <div className="flex items-center gap-2 py-4">
            <div className="w-5 h-5 border-2 border-[#002147] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-gray-400">Loading scores…</span>
          </div>
        ) : scoreEntries && scoreEntries.length > 0 ? (
          <div className="space-y-2.5">
            {scoreEntries.map(([key, val]) => {
              const c = scoreColor(val);
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600 capitalize">{key.replace(/_/g, " ")}</span>
                    <span className={`text-xs font-bold ${c.text}`}>{val}/10</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full transition-all duration-500 ${c.bar}`} style={{ width: `${val * 10}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-400">
            <ActivityIcon size={24} className="mx-auto mb-1.5 opacity-40" />
            <p className="text-xs">No life score data available yet.</p>
          </div>
        )}
      </div>

      {/* Journal Activity */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Journal Activity</p>
        {loading ? (
          <div className="flex items-center gap-2 py-2">
            <div className="w-4 h-4 border-2 border-[#002147] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-gray-400">Loading…</span>
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
            <BookIcon size={24} className="mx-auto mb-1.5 opacity-40" />
            <p className="text-xs">No journal activity data yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Resources Panel ──────────────────────────
function ResourcesPanel({ sessions, clientName }) {
  const [resName, setResName] = useState("");
  const [resDesc, setResDesc] = useState("");
  const [resLink, setResLink] = useState("");
  const [resFile, setResFile] = useState(null);
  const [selectedSession, setSelectedSession] = useState("");
  const [saving, setSaving] = useState(false);
  const [resources, setResources] = useState([]);
  const [toast, setToast] = useState("");
  const fileRef = useRef(null);

  useEffect(() => {
    const allRes = [];
    sessions.forEach(s => {
      if (Array.isArray(s.session_resources)) {
        s.session_resources.forEach(r => allRes.push({ ...r, sessionTitle: s.title || `Session ${s.id}`, sessionId: s.id }));
      }
    });
    allRes.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    setResources(allRes);
  }, [sessions]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const handleShare = async () => {
    const sid = selectedSession || sessions[0]?.id;
    if (!sid) return showToast("Please select a session to link this resource.");
    if (!resName.trim()) return showToast("Resource name is required.");
    if (!resLink.trim() && !resFile) return showToast("Please add a link or file.");
    setSaving(true);
    try {
      const created = await sessionsService.addSessionResource({
        session_id: sid,
        name: resName,
        description: resDesc || undefined,
        file: resFile || null,
        link: resLink || undefined,
      });
      const sess = sessions.find(s => String(s.id) === String(sid));
      setResources(prev => [{ ...created, sessionTitle: sess?.title || `Session ${sid}`, sessionId: sid }, ...prev]);
      showToast("Resource shared!");
      setResName(""); setResDesc(""); setResLink(""); setResFile(null); setSelectedSession("");
      if (fileRef.current) fileRef.current.value = "";
    } catch {
      showToast("Failed to share resource.");
    } finally { setSaving(false); }
  };

  const handleDelete = async (resId) => {
    try {
      await sessionsService.deleteResource(resId);
      setResources(prev => prev.filter(r => r.id !== resId));
      showToast("Resource removed.");
    } catch { showToast("Failed to remove."); }
  };

  return (
    <div className="space-y-4">
      {toast && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
          <CheckIcon size={13} /> {toast}
        </div>
      )}

      {/* Share form */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-3">Share with {clientName}</p>
        <div className="space-y-2.5">
          <input
            type="text"
            value={resName}
            onChange={e => setResName(e.target.value)}
            placeholder="Resource name *"
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#002147]/10 focus:border-[#002147]"
          />
          <input
            type="text"
            value={resDesc}
            onChange={e => setResDesc(e.target.value)}
            placeholder="Description (optional)"
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#002147]/10 focus:border-[#002147]"
          />
          <div className="flex gap-2">
            <div className="relative flex-1">
              <LinkIcon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="url"
                value={resLink}
                onChange={e => setResLink(e.target.value)}
                placeholder="Paste a link…"
                className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002147]/10 focus:border-[#002147]"
              />
            </div>
            <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-600 cursor-pointer hover:border-[#002147] transition-colors whitespace-nowrap">
              <UploadIcon size={13} className="text-gray-500" />
              {resFile ? resFile.name.slice(0, 12) + "…" : "Upload file"}
              <input ref={fileRef} type="file" className="hidden" onChange={e => setResFile(e.target.files?.[0] || null)} />
            </label>
          </div>
          {sessions.length > 0 && (
            <select
              value={selectedSession}
              onChange={e => setSelectedSession(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#002147]/10 focus:border-[#002147] bg-white"
            >
              <option value="">Link to a session *</option>
              {sessions.map(s => (
                <option key={s.id} value={s.id}>{s.title || `Session ${s.id}`} — {fmtDate(s.date || s.scheduled_at)}</option>
              ))}
            </select>
          )}
          <button
            onClick={handleShare}
            disabled={saving || !resName.trim() || (!resLink.trim() && !resFile)}
            className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              !saving && resName.trim() && (resLink.trim() || resFile)
                ? "bg-[#002147] text-white hover:bg-[#003875]"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <PaperclipIcon size={13} /> {saving ? "Sharing…" : "Share Resource"}
          </button>
        </div>
      </div>

      {/* Resources list */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Shared Resources ({resources.length})</p>
        {resources.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <PaperclipIcon size={28} className="mx-auto mb-2 opacity-40" />
            <p className="text-xs">No resources shared yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {resources.map(r => (
              <div key={r.id} className="bg-white border border-gray-100 rounded-xl p-3.5 group hover:shadow-sm transition-all">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 flex-1 min-w-0">
                    <div className="p-2 rounded-lg bg-blue-50 shrink-0">
                      {r.link ? <LinkIcon size={13} className="text-blue-600" /> : <PaperclipIcon size={13} className="text-blue-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#002147] truncate">{r.name}</p>
                      {r.description && <p className="text-xs text-gray-500 line-clamp-1">{r.description}</p>}
                      {r.link && (
                        <a href={r.link} target="_blank" rel="noopener noreferrer"
                          className="text-[10px] text-blue-500 hover:underline truncate block">
                          {r.link}
                        </a>
                      )}
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-[10px] text-gray-400">{fmtDate(r.created_at)}</span>
                        {r.sessionTitle && <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">{r.sessionTitle}</span>}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                    <TrashIcon size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────────
export default function CoachDashboard() {
  const [coachUser, setCoachUser] = useState(null);
  const [clients, setClients] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [allSessions, setAllSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Client detail panel
  const [selectedClient, setSelectedClient] = useState(null);
  const [activeTab, setActiveTab] = useState("notes"); // 'notes' | 'progress' | 'resources'
  const [clientSessions, setClientSessions] = useState([]);
  const [loadingClientSessions, setLoadingClientSessions] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem("wanacUser");
    if (u) { try { setCoachUser(JSON.parse(u)); } catch {} }
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [sessRes, clientsRes] = await Promise.all([
        sessionsService.getSessions().catch(() => []),
        clientsService.getClients().catch(() => []),
      ]);
      const rawSessions = Array.isArray(sessRes) ? sessRes : (sessRes?.data || sessRes?.sessions?.data || []);
      const rawClients = Array.isArray(clientsRes) ? clientsRes : (clientsRes?.clients || clientsRes?.data || []);
      setAllSessions(rawSessions);
      setSessions(
        rawSessions
          .filter(s => ["scheduled", "upcoming", "pending"].includes((s.status || "").toLowerCase()))
          .sort((a, b) => new Date(a.date || a.scheduled_at || 0) - new Date(b.date || b.scheduled_at || 0))
          .slice(0, 6)
      );
      setClients((rawClients || []).map(normalizeClient));
    } catch {
      setError("Failed to load data. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // When a client is selected, load their sessions
  useEffect(() => {
    if (!selectedClient) { setClientSessions([]); return; }
    setLoadingClientSessions(true);
    // Filter sessions where this client is a member
    const cid = String(selectedClient.id);
    const filtered = allSessions.filter(s =>
      Array.isArray(s.session_members) && s.session_members.some(m =>
        String(m.client_id || m.id) === cid || String(m.user_id) === cid
      )
    );
    setClientSessions(filtered);
    setLoadingClientSessions(false);
  }, [selectedClient, allSessions]);

  const filteredClients = search.trim()
    ? clients.filter(c => (c.name || "").toLowerCase().includes(search.toLowerCase()) || (c.email || "").toLowerCase().includes(search.toLowerCase()))
    : clients;

  const completedCount = allSessions.filter(s => ["completed", "done"].includes((s.status || "").toLowerCase())).length;

  const CLIENT_TABS = [
    { key: "notes", label: "Session Notes", icon: ClipboardIcon },
    { key: "progress", label: "Progress", icon: ChartIcon },
    { key: "resources", label: "Resources", icon: PaperclipIcon },
  ];

  return (
    <div className="h-screen flex bg-[#f5f5f5] font-body overflow-hidden">
      <CoachSidebar />
      <div className="flex-1 flex flex-col h-full min-w-0">
        <ClientTopbar user={coachUser} />

        <main className="flex-1 flex flex-col h-0 px-4 md:px-6 py-3 gap-3">
          <div className="max-w-7xl mx-auto w-full shrink-0">

            {/* ── Hero ── */}
            <div className="bg-gradient-to-br from-[#002147] via-[#003a7a] to-[#002147] rounded-2xl px-5 py-3 relative overflow-hidden shadow-sm">
              <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_80%_20%,white,transparent)] pointer-events-none" />
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <p className="text-white/60 text-[10px] font-medium uppercase tracking-widest">Coach Dashboard</p>
                  <h1 className="text-xl font-bold text-white">
                    Welcome back{coachUser?.name ? `, ${coachUser.name.split(" ")[0]}` : ""}
                  </h1>
                  <p className="text-white/70 text-xs">Manage sessions, track client progress, and share resources.</p>
                </div>
                <button
                  onClick={() => setShowScheduleModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-semibold transition-all border border-white/20 self-start sm:self-auto"
                >
                  <CalendarIcon size={14} /> Schedule Session
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center justify-between gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                <span>⚠ {error}</span>
                <button onClick={loadData} className="underline text-xs font-semibold">Retry</button>
              </div>
            )}

            {/* ── Stats ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
              {[
                { label: "Total Clients", value: loading ? "…" : clients.length, icon: UsersIcon, color: "bg-purple-100 text-purple-600" },
                { label: "Upcoming Sessions", value: loading ? "…" : sessions.length, icon: CalendarIcon, color: "bg-blue-100 text-blue-600" },
                { label: "Completed", value: loading ? "…" : completedCount, icon: CheckIcon, color: "bg-green-100 text-green-600" },
                { label: "Fireteams", value: "—", icon: FireIcon, color: "bg-orange-100 text-orange-600" },
              ].map(stat => (
                <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-2.5 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`p-1.5 rounded-lg ${stat.color}`}>
                      <stat.icon size={12} />
                    </div>
                    <span className="text-[11px] text-gray-500 font-medium">{stat.label}</span>
                  </div>
                  <p className="text-xl font-bold text-[#002147]">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

            {/* ── Main 3-column grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 max-w-7xl mx-auto w-full flex-1 min-h-0">

              {/* LEFT: Upcoming Sessions + Client List */}
              <div className="lg:col-span-2 space-y-3 overflow-y-auto">

                {/* Upcoming Sessions */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-bold text-[#002147] flex items-center gap-2">
                      <CalendarIcon size={14} className="text-blue-500" /> Upcoming Sessions
                    </h2>
                    <a href="/coach/sessions" className="text-xs text-[#002147] hover:text-orange-500 font-semibold flex items-center gap-1">
                      All <ChevronRightIcon size={12} />
                    </a>
                  </div>

                  {loading ? (
                    <div className="py-6 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-[#002147] border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : sessions.length === 0 ? (
                    <div className="text-center py-6">
                      <CalendarIcon size={28} className="mx-auto mb-2 text-gray-300" />
                      <p className="text-xs text-gray-500 font-medium">No upcoming sessions</p>
                      <button onClick={() => setShowScheduleModal(true)}
                        className="mt-2 text-xs text-[#002147] hover:text-orange-500 underline font-semibold">
                        Schedule one →
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {sessions.map(s => {
                        const dt = s.date || s.scheduled_at;
                        return (
                          <div key={s.id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="text-center bg-white rounded-xl border border-gray-200 p-2 w-12 shrink-0 shadow-sm">
                              <p className="text-[10px] text-gray-500 font-medium leading-tight">{dt ? new Date(dt).toLocaleDateString("en-US", { month: "short" }) : "—"}</p>
                              <p className="text-lg font-bold text-[#002147] leading-tight">{dt ? new Date(dt).getDate() : "?"}</p>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-800 truncate">{s.title || "Session"}</p>
                              <p className="text-xs text-gray-500">{fmtTime(dt)} {s.mode ? `· ${s.mode}` : ""}</p>
                              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${statusColor(s.status)}`}>{s.status || "—"}</span>
                              </div>
                            </div>
                            <a href={`/coach/sessions/fullviewsession/${s.id}`}
                              className="p-1.5 rounded-lg hover:bg-white text-gray-400 hover:text-[#002147] transition-colors shrink-0 self-center">
                              <ArrowRightIcon size={14} />
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Client List */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-bold text-[#002147] flex items-center gap-2">
                      <UsersIcon size={14} className="text-purple-500" /> Clients
                      <span className="text-xs font-normal text-gray-400">({clients.length})</span>
                    </h2>
                    <a href="/coach/clients" className="text-xs text-[#002147] hover:text-orange-500 font-semibold flex items-center gap-1">
                      All <ChevronRightIcon size={12} />
                    </a>
                  </div>

                  {/* Search */}
                  <div className="relative mb-3">
                    <SearchIcon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search clients…"
                      className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002147]/10 focus:border-[#002147]"
                    />
                  </div>

                  {loading ? (
                    <div className="py-4 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-[#002147] border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : filteredClients.length === 0 ? (
                    <div className="text-center py-6">
                      <UsersIcon size={24} className="mx-auto mb-2 text-gray-300" />
                      <p className="text-xs text-gray-500">{search ? "No clients match your search." : "No clients yet."}</p>
                    </div>
                  ) : (
                    <div className="space-y-1" style={{ maxHeight: "200px", overflowY: "auto" }}>
                      {filteredClients.map(c => (
                        <button
                          key={c.id}
                          onClick={() => { setSelectedClient(c); setActiveTab("notes"); }}
                          className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${
                            selectedClient?.id === c.id
                              ? "bg-[#002147] shadow-sm"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <Avatar name={c.name || c.email || "?"} size={32} />
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-semibold truncate ${selectedClient?.id === c.id ? "text-white" : "text-gray-800"}`}>
                              {c.name || "Unnamed"}
                            </p>
                            <p className={`text-[10px] truncate ${selectedClient?.id === c.id ? "text-white/70" : "text-gray-500"}`}>
                              {c.email || "No email"}
                            </p>
                          </div>
                          <ChevronRightIcon size={12} className={selectedClient?.id === c.id ? "text-white/60" : "text-gray-400"} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT: Client Detail Panel */}
              <div className="lg:col-span-3 overflow-y-auto">
                {!selectedClient ? (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 h-full flex flex-col items-center justify-center text-center min-h-[400px]">
                    <div className="p-4 rounded-2xl bg-gray-50 mb-4">
                      <UsersIcon size={32} className="text-gray-300" />
                    </div>
                    <h3 className="text-base font-bold text-gray-700 mb-1">Select a Client</h3>
                    <p className="text-sm text-gray-400 max-w-xs">
                      Choose a client from the list to view their session notes, progress summary, and share resources.
                    </p>
                    <div className="mt-6 grid grid-cols-3 gap-3 w-full max-w-xs">
                      {[
                        { icon: ClipboardIcon, label: "Notes", color: "bg-blue-50 text-blue-600" },
                        { icon: ChartIcon, label: "Progress", color: "bg-green-50 text-green-600" },
                        { icon: PaperclipIcon, label: "Resources", color: "bg-purple-50 text-purple-600" },
                      ].map(item => (
                        <div key={item.label} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl ${item.color}`}>
                          <item.icon size={18} />
                          <span className="text-xs font-semibold">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
                    {/* Client header */}
                    <div className="bg-gradient-to-r from-[#002147] to-[#003875] p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar name={selectedClient.name || selectedClient.email || "?"} size={40} />
                          <div>
                            <p className="text-white font-bold text-sm">{selectedClient.name || "Unnamed"}</p>
                            <p className="text-white/70 text-xs">{selectedClient.email || ""}</p>
                            {selectedClient.phone && <p className="text-white/60 text-[10px]">{selectedClient.phone}</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <p className="text-white/60 text-[10px]">Sessions linked</p>
                            <p className="text-white font-bold text-sm">{loadingClientSessions ? "…" : clientSessions.length}</p>
                          </div>
                          <button
                            onClick={() => setSelectedClient(null)}
                            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                          >
                            <XIcon size={14} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-100 px-1 pt-1 bg-gray-50/50">
                      {CLIENT_TABS.map(tab => (
                        <button
                          key={tab.key}
                          onClick={() => setActiveTab(tab.key)}
                          className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold transition-all rounded-t-xl border-b-2 ${
                            activeTab === tab.key
                              ? "text-[#002147] border-[#002147] bg-white"
                              : "text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <tab.icon size={12} /> {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Tab content */}
                    <div className="p-5 overflow-y-auto flex-1 min-h-0">
                      {loadingClientSessions ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="w-6 h-6 border-2 border-[#002147] border-t-transparent rounded-full animate-spin" />
                        </div>
                      ) : activeTab === "notes" ? (
                        <NotesPanel sessions={clientSessions} clientName={selectedClient.name || "Client"} />
                      ) : activeTab === "progress" ? (
                        <ProgressPanel client={selectedClient} sessions={clientSessions} />
                      ) : (
                        <ResourcesPanel sessions={clientSessions} clientName={selectedClient.name || "Client"} />
                      )}
                    </div>
                  </div>
                )}
              </div>

            </div>

        </main>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <ScheduleSessionModal
          onClose={() => setShowScheduleModal(false)}
          onSubmit={async (data) => {
            try {
              await sessionsService.addSession(data);
              setShowScheduleModal(false);
              loadData();
            } catch { console.error("Failed to schedule session"); }
          }}
        />
      )}
    </div>
  );
}
