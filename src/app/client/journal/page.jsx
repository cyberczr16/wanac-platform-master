"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Sidebar from "../../../../components/dashboardcomponents/sidebar";
import ClientTopbar from "../../../../components/dashboardcomponents/clienttopbar";
import { journalService } from "../../../services/api/journal.service";
import journalPrompts from "../../../data/journalPrompts.json";
import weeklyActions from "../../../data/weeklyActions.json";
import selfiePrompts from "../../../data/selfiePrompts.json";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function formatTimeRemaining(hours) {
  if (hours === null) return "";
  const h = Math.floor(hours);
  const m = Math.floor((hours - h) * 60);
  return `${h}h ${m}m`;
}
function formatDaysRemaining(days) {
  if (days === null) return "";
  const d = Math.floor(days);
  const h = Math.floor((days - d) * 24);
  return d > 0 ? `${d}d ${h}h` : `${h}h`;
}

// ─────────────────────────────────────────────
// SVG Icons
// ─────────────────────────────────────────────
const BookIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);
const PenIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);
const CameraIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" />
  </svg>
);
const CalendarIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const LightbulbIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="9" y1="18" x2="15" y2="18" /><line x1="10" y1="22" x2="14" y2="22" /><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
  </svg>
);
const CheckIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const LockIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const ClockIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const SearchIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const DownloadIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);
const EditIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const TrashIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);
const SparkleIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z" />
  </svg>
);
const GridIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
  </svg>
);
const ListIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

// ─────────────────────────────────────────────
// Tab Config
// ─────────────────────────────────────────────
const TABS = [
  { key: "growth", label: "365 Growth Journal", shortLabel: "Growth", icon: BookIcon, color: "amber" },
  { key: "weekly", label: "Weekly Actions", shortLabel: "Weekly", icon: SparkleIcon, color: "purple" },
  { key: "selfie", label: "101 Selfie Journal", shortLabel: "Selfie", icon: CameraIcon, color: "rose" },
];

const TAB_COLORS = {
  growth: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", iconBg: "bg-amber-100", iconText: "text-amber-600", badge: "bg-amber-100 text-amber-700", active: "bg-[#002147] text-white", bar: "bg-amber-500" },
  weekly: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", iconBg: "bg-purple-100", iconText: "text-purple-600", badge: "bg-purple-100 text-purple-700", active: "bg-[#9A6AE3] text-white", bar: "bg-purple-500" },
  selfie: { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700", iconBg: "bg-rose-100", iconText: "text-rose-600", badge: "bg-rose-100 text-rose-700", active: "bg-rose-500 text-white", bar: "bg-rose-500" },
};

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export default function JournalPage() {
  const [selectedTab, setSelectedTab] = useState("growth");
  const [entry, setEntry] = useState("");
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [editingEntry, setEditingEntry] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [wordCount, setWordCount] = useState(0);
  const [viewingEntry, setViewingEntry] = useState(null);
  const [selfieImage, setSelfieImage] = useState(null);

  // Cooldown / day tracking
  const [currentUserDay, setCurrentUserDay] = useState(1);
  const [canWriteToday, setCanWriteToday] = useState(true);
  const [timeUntilNext, setTimeUntilNext] = useState(null);
  const [showGrowthCooldown, setShowGrowthCooldown] = useState(true);
  const growthCooldownRef = useRef(false);

  const [currentUserWeek, setCurrentUserWeek] = useState(1);
  const [canWriteWeekly, setCanWriteWeekly] = useState(true);
  const [timeUntilNextWeek, setTimeUntilNextWeek] = useState(null);
  const [showWeeklyCooldown, setShowWeeklyCooldown] = useState(true);
  const weeklyCooldownRef = useRef(false);

  const [currentUserSelfieDay, setCurrentUserSelfieDay] = useState(1);
  const [canWriteSelfieToday, setCanWriteSelfieToday] = useState(true);
  const [timeUntilNextSelfie, setTimeUntilNextSelfie] = useState(null);
  const [showSelfieCooldown, setShowSelfieCooldown] = useState(true);
  const selfieCooldownRef = useRef(false);

  // ── Computed entries with day numbers ──
  const entriesWithDayNumbers = useMemo(() => {
    if (selectedTab !== "growth") return entries;
    return [...entries]
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      .map((e, i) => ({ ...e, day_number: i + 1, prompt_number: (i % journalPrompts.length) + 1 }));
  }, [entries, selectedTab]);

  const weeklyEntriesWithWeekNumbers = useMemo(() => {
    if (selectedTab !== "weekly") return entries;
    return [...entries]
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      .map((e, i) => ({ ...e, week_number: i + 1 }));
  }, [entries, selectedTab]);

  const selfieEntriesWithDayNumbers = useMemo(() => {
    if (selectedTab !== "selfie") return entries;
    return [...entries]
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      .map((e, i) => ({ ...e, day_number: i + 1 }));
  }, [entries, selectedTab]);

  // ── Day / week tracking effects ──
  useEffect(() => {
    if (selectedTab === "growth") setCurrentUserDay(entries.length + 1);
  }, [selectedTab, entries]);

  useEffect(() => {
    if (selectedTab === "growth" && entries.length > 0) {
      const last = [...entries].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
      const hours = (Date.now() - new Date(last.created_at)) / 3600000;
      if (hours < 24) { setCanWriteToday(false); setTimeUntilNext(24 - hours); }
      else { setCanWriteToday(true); setTimeUntilNext(null); }
    } else if (selectedTab === "growth") {
      setCanWriteToday(true); setTimeUntilNext(null);
    }
  }, [selectedTab, entries]);

  useEffect(() => {
    if (!canWriteToday) { growthCooldownRef.current = false; setShowGrowthCooldown(true); return; }
    if (selectedTab === "growth" && !canWriteToday && timeUntilNext !== null && !growthCooldownRef.current) {
      setShowGrowthCooldown(true);
      const t = setTimeout(() => { setShowGrowthCooldown(false); growthCooldownRef.current = true; }, 5000);
      return () => clearTimeout(t);
    }
  }, [selectedTab, canWriteToday, timeUntilNext]);

  useEffect(() => {
    if (selectedTab === "growth" && !canWriteToday) {
      const t = setInterval(() => setTimeUntilNext(p => p <= 0 ? (setCanWriteToday(true), null) : p - 1/60), 60000);
      return () => clearInterval(t);
    }
  }, [selectedTab, canWriteToday]);

  useEffect(() => {
    if (selectedTab === "weekly") setCurrentUserWeek(entries.length + 1);
  }, [selectedTab, entries]);

  useEffect(() => {
    if (selectedTab === "weekly" && entries.length > 0) {
      const last = [...entries].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
      const days = (Date.now() - new Date(last.created_at)) / 86400000;
      if (days < 7) { setCanWriteWeekly(false); setTimeUntilNextWeek(7 - days); }
      else { setCanWriteWeekly(true); setTimeUntilNextWeek(null); }
    } else if (selectedTab === "weekly") {
      setCanWriteWeekly(true); setTimeUntilNextWeek(null);
    }
  }, [selectedTab, entries]);

  useEffect(() => {
    if (!canWriteWeekly) { weeklyCooldownRef.current = false; setShowWeeklyCooldown(true); return; }
    if (selectedTab === "weekly" && !canWriteWeekly && !weeklyCooldownRef.current) {
      setShowWeeklyCooldown(true);
      const t = setTimeout(() => { setShowWeeklyCooldown(false); weeklyCooldownRef.current = true; }, 5000);
      return () => clearTimeout(t);
    }
  }, [selectedTab, canWriteWeekly, timeUntilNextWeek]);

  useEffect(() => {
    if (selectedTab === "selfie") setCurrentUserSelfieDay(entries.length + 1);
  }, [selectedTab, entries]);

  useEffect(() => {
    if (selectedTab === "selfie" && entries.length > 0) {
      const last = [...entries].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
      const hours = (Date.now() - new Date(last.created_at)) / 3600000;
      if (hours < 24) { setCanWriteSelfieToday(false); setTimeUntilNextSelfie(24 - hours); }
      else { setCanWriteSelfieToday(true); setTimeUntilNextSelfie(null); }
    } else if (selectedTab === "selfie") {
      setCanWriteSelfieToday(true); setTimeUntilNextSelfie(null);
    }
  }, [selectedTab, entries]);

  useEffect(() => {
    if (!canWriteSelfieToday) { selfieCooldownRef.current = false; setShowSelfieCooldown(true); return; }
    if (selectedTab === "selfie" && !canWriteSelfieToday && !selfieCooldownRef.current) {
      setShowSelfieCooldown(true);
      const t = setTimeout(() => { setShowSelfieCooldown(false); selfieCooldownRef.current = true; }, 5000);
      return () => clearTimeout(t);
    }
  }, [selectedTab, canWriteSelfieToday, timeUntilNextSelfie]);

  useEffect(() => { if (selectedTab !== "selfie") setSelfieImage(null); }, [selectedTab]);

  // ── Current prompts ──
  const todayPrompt = useMemo(() => {
    const idx = (currentUserDay - 1) % journalPrompts.length;
    const p = journalPrompts[idx];
    return p ? { ...p, dayNumber: currentUserDay } : null;
  }, [currentUserDay]);

  const thisWeekAction = useMemo(() => {
    const idx = (currentUserWeek - 1) % weeklyActions.length;
    const a = weeklyActions[idx];
    return a ? { ...a, weekNumber: currentUserWeek } : null;
  }, [currentUserWeek]);

  const todaySelfiePrompt = useMemo(() => {
    if (currentUserSelfieDay < 1 || currentUserSelfieDay > 101) return null;
    return selfiePrompts.find(p => p.day === currentUserSelfieDay) || selfiePrompts[currentUserSelfieDay - 1] || null;
  }, [currentUserSelfieDay]);

  // ── Word count ──
  useEffect(() => {
    setWordCount(entry.trim() ? entry.trim().split(/\s+/).filter(w => w.length > 0).length : 0);
  }, [entry]);

  // ── Fetch entries ──
  const fetchEntries = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await journalService.getJournals();
      const filtered = data.filter(j => {
        if (selectedTab === "weekly") return j.title === "Weekly Actions" || j.title === "Weekly Review";
        if (selectedTab === "growth") return j.title === "365 Growth Journal" || j.title === "Growth Prompts";
        if (selectedTab === "selfie") return j.title === "101 Selfie Journal" || j.title === "100 Day Selfie Journal";
        return false;
      });
      setEntries(filtered);
    } catch {
      setError("Failed to load journal entries.");
    } finally {
      setLoading(false);
    }
  }, [selectedTab]);

  useEffect(() => { fetchEntries(); }, [selectedTab, fetchEntries]);

  // ── Submit ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedTab === "selfie" && !selfieImage && !entry.trim()) return;
    if (selectedTab !== "selfie" && !entry.trim()) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      let content = entry;
      let day_number;
      let prompt_number;
      const titleMap = { growth: "365 Growth Journal", weekly: "Weekly Actions", selfie: "101 Selfie Journal" };

      if (selectedTab === "growth" && todayPrompt) {
        day_number = todayPrompt.dayNumber;
        prompt_number = todayPrompt.number;
      }
      if (selectedTab === "weekly" && thisWeekAction) {
        day_number = thisWeekAction.weekNumber;
      }
      if (selectedTab === "selfie") {
        content = JSON.stringify({ note: entry.trim() || "", selfie: selfieImage || "" });
        day_number = currentUserSelfieDay;
      }

      const journalData = {
        title: titleMap[selectedTab],
        content,
        ...(day_number != null && { day_number }),
        ...(prompt_number != null && { prompt_number }),
      };

      if (editingEntry) {
        await journalService.updateJournal(editingEntry.id, journalData);
        setSuccess("Entry updated!");
        setEditingEntry(null);
      } else {
        await journalService.addJournal(journalData);
        setSuccess("Entry saved!");
      }
      setEntry("");
      setWordCount(0);
      setSelfieImage(null);
      await fetchEntries();
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError(editingEntry ? "Failed to update entry." : "Failed to save entry.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (j) => {
    if (selectedTab === "selfie") {
      try {
        const parsed = typeof j.content === "string" && j.content.startsWith("{") ? JSON.parse(j.content) : { note: j.content || "", selfie: "" };
        setEntry(parsed.note || "");
        setSelfieImage(parsed.selfie || null);
      } catch { setEntry(j.content || ""); setSelfieImage(null); }
    } else {
      setEntry(j.content || "");
    }
    setEditingEntry(j);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => { setEntry(""); setEditingEntry(null); setWordCount(0); setSelfieImage(null); };

  const handleDelete = async (id) => {
    try {
      await journalService.deleteJournal(id);
      setSuccess("Entry deleted.");
      setShowDeleteConfirm(null);
      await fetchEntries();
      setTimeout(() => setSuccess(""), 3000);
    } catch { setError("Failed to delete entry."); }
  };

  const handleExport = () => {
    const exportData = entries.map(e => ({ title: e.title, content: e.content, date: new Date(e.created_at).toLocaleString() }));
    const uri = "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const a = document.createElement("a");
    a.href = uri;
    a.download = `journal-${selectedTab}-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
  };

  // ── Display data ──
  const entriesToDisplay = selectedTab === "growth" ? entriesWithDayNumbers
    : selectedTab === "weekly" ? weeklyEntriesWithWeekNumbers
    : selectedTab === "selfie" ? selfieEntriesWithDayNumbers
    : entries;

  const filteredEntries = search.trim()
    ? entriesToDisplay.filter(j => {
        if (selectedTab === "selfie") {
          try { const p = JSON.parse(j.content); return (p.note || "").toLowerCase().includes(search.toLowerCase()); } catch { return false; }
        }
        return (j.content || "").toLowerCase().includes(search.toLowerCase());
      })
    : entriesToDisplay;

  const tc = TAB_COLORS[selectedTab];
  const currentTab = TABS.find(t => t.key === selectedTab);

  // ── Progress bar % ──
  const progressPct = selectedTab === "growth"
    ? Math.min(100, Math.round((entries.length / 365) * 100))
    : selectedTab === "weekly"
    ? Math.min(100, Math.round((entries.length / 52) * 100))
    : Math.min(100, Math.round((entries.length / 101) * 100));

  const progressMax = selectedTab === "growth" ? 365 : selectedTab === "weekly" ? 52 : 101;
  const progressUnit = selectedTab === "weekly" ? "week" : "day";

  const canWrite = (selectedTab === "growth" && canWriteToday)
    || (selectedTab === "weekly" && canWriteWeekly)
    || (selectedTab === "selfie" && canWriteSelfieToday && currentUserSelfieDay <= 101);

  const cooldownActive = (selectedTab === "growth" && !canWriteToday)
    || (selectedTab === "weekly" && !canWriteWeekly)
    || (selectedTab === "selfie" && !canWriteSelfieToday);

  const timeLabel = selectedTab === "growth" ? formatTimeRemaining(timeUntilNext)
    : selectedTab === "weekly" ? formatDaysRemaining(timeUntilNextWeek)
    : formatTimeRemaining(timeUntilNextSelfie);

  const showCooldown = selectedTab === "growth" ? showGrowthCooldown
    : selectedTab === "weekly" ? showWeeklyCooldown
    : showSelfieCooldown;

  const completedCount = selectedTab === "growth" ? currentUserDay - 1
    : selectedTab === "weekly" ? currentUserWeek - 1
    : currentUserSelfieDay - 1;

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <div className="h-screen flex bg-[#f5f5f5] font-body">
      <Sidebar className="w-56 bg-white border-r border-gray-200" collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 flex flex-col h-full transition-all duration-300 min-w-0">
        <ClientTopbar user={user} />

        <main className="flex-1 h-0 overflow-y-auto px-4 md:px-6 py-5">
          <div className="max-w-6xl mx-auto space-y-4">

            {/* ── Hero Banner ── */}
            <div className="bg-gradient-to-br from-[#002147] via-[#003a7a] to-[#002147] rounded-2xl p-5 relative overflow-hidden shadow-sm">
              <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_20%_80%,white,transparent)] pointer-events-none" />
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-white/60 text-xs font-medium uppercase tracking-widest mb-1">Your Journal</p>
                  <h1 className="text-2xl font-bold text-white leading-tight">Reflect &amp; Grow</h1>
                  <p className="text-white/70 text-sm mt-1">Daily prompts to fill your life with self-reflection, creativity &amp; direction.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode(v => v === "list" ? "card" : "list")}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white"
                    title={`Switch to ${viewMode === "list" ? "card" : "list"} view`}
                  >
                    {viewMode === "list" ? <GridIcon size={16} /> : <ListIcon size={16} />}
                  </button>
                  {entries.length > 0 && (
                    <button
                      onClick={handleExport}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-xs font-medium text-white"
                    >
                      <DownloadIcon size={13} /> Export
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ── Alerts ── */}
            {success && (
              <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
                <CheckIcon size={14} className="text-green-600 shrink-0" /> {success}
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                ⚠ {error}
              </div>
            )}

            {/* ── Tabs ── */}
            <div className="flex gap-2 flex-wrap">
              {TABS.map(tab => {
                const Icon = tab.icon;
                const isActive = selectedTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => { setSelectedTab(tab.key); setEntry(""); setEditingEntry(null); setWordCount(0); }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border-2 ${
                      isActive
                        ? "bg-[#002147] text-white border-[#002147] shadow-sm"
                        : "bg-white text-gray-700 border-gray-200 hover:border-[#002147]/30 hover:bg-gray-50"
                    }`}
                  >
                    <Icon size={14} />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.shortLabel}</span>
                  </button>
                );
              })}
            </div>

            {/* ── Two-column layout ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

              {/* ── LEFT COLUMN: Prompt + Write ── */}
              <div className="lg:col-span-2 space-y-4">

                {/* Progress Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">{currentTab?.label}</p>
                      <p className="text-xl font-bold text-[#002147]">
                        {completedCount} <span className="text-sm font-normal text-gray-500">/ {progressMax} {progressUnit}s</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${tc.badge}`}>
                        {progressPct}% complete
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${tc.bar}`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                {/* Prompt Card */}
                {selectedTab === "growth" && todayPrompt && (
                  <div className={`bg-white rounded-2xl border ${tc.border} shadow-sm p-5`}>
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-xl ${tc.iconBg} shrink-0`}>
                        <LightbulbIcon size={18} className={tc.iconText} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`text-xs font-bold uppercase tracking-wide ${tc.text}`}>Day {todayPrompt.dayNumber}</span>
                          <span className="text-gray-300">·</span>
                          <span className="text-xs text-gray-500">Prompt #{todayPrompt.number} from <em>365 Journal Writing Ideas</em></span>
                        </div>
                        <p className="text-gray-800 text-base leading-relaxed font-medium">{todayPrompt.text}</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedTab === "weekly" && thisWeekAction && (
                  <div className={`bg-white rounded-2xl border ${tc.border} shadow-sm p-5`}>
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-xl ${tc.iconBg} shrink-0`}>
                        <SparkleIcon size={18} className={tc.iconText} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`text-xs font-bold uppercase tracking-wide ${tc.text}`}>Week {thisWeekAction.weekNumber}</span>
                          <span className="text-gray-300">·</span>
                          <span className="text-xs text-gray-500">Action #{thisWeekAction.week} from <em>365 Journal Writing Ideas</em></span>
                        </div>
                        <p className="text-gray-800 text-base leading-relaxed font-medium">{thisWeekAction.text}</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedTab === "selfie" && todaySelfiePrompt && currentUserSelfieDay <= 101 && (
                  <div className={`bg-white rounded-2xl border ${tc.border} shadow-sm p-5`}>
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-xl ${tc.iconBg} shrink-0`}>
                        <CameraIcon size={18} className={tc.iconText} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`text-xs font-bold uppercase tracking-wide ${tc.text}`}>Day {todaySelfiePrompt.day} of 101</span>
                          <span className="text-gray-300">·</span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tc.badge}`}>{todaySelfiePrompt.theme}</span>
                        </div>
                        <p className="text-gray-800 text-base leading-relaxed font-medium">{todaySelfiePrompt.prompt}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cooldown State */}
                {cooldownActive && (
                  showCooldown ? (
                    <div className={`bg-white rounded-2xl border-2 ${tc.border} shadow-sm p-6 text-center`}>
                      <div className={`inline-flex p-3 rounded-full ${tc.iconBg} mb-3`}>
                        <LockIcon size={22} className={tc.iconText} />
                      </div>
                      <h3 className="text-lg font-bold text-[#002147] mb-1">
                        {selectedTab === "weekly" ? `Great work on Week ${completedCount}!` : `Great work on Day ${completedCount}!`} 🎉
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {selectedTab === "weekly"
                          ? "You've completed this week's action. Come back next week to continue."
                          : "You've completed today's entry. Come back tomorrow to continue your journey."}
                      </p>
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${tc.bg} ${tc.text} text-sm font-bold`}>
                        <ClockIcon size={14} /> Next available in: {timeLabel}
                      </div>
                    </div>
                  ) : (
                    <div className={`${tc.bg} ${tc.border} border rounded-xl px-4 py-2.5 flex items-center gap-2`}>
                      <ClockIcon size={13} className={tc.text} />
                      <p className="text-xs text-gray-600">Next {selectedTab === "weekly" ? "action" : "prompt"} available in: <span className="font-semibold">{timeLabel}</span></p>
                    </div>
                  )
                )}

                {/* Completed all */}
                {selectedTab === "selfie" && currentUserSelfieDay > 101 && (
                  <div className="bg-white rounded-2xl border border-green-200 shadow-sm p-6 text-center">
                    <div className="text-3xl mb-2">🎉</div>
                    <h3 className="text-lg font-bold text-[#002147] mb-1">You completed 101 days!</h3>
                    <p className="text-sm text-gray-600">Look back through your selfie journey below.</p>
                  </div>
                )}

                {/* Write Form */}
                {canWrite && (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    {editingEntry && (
                      <div className="mb-3 px-3 py-2 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5">
                          <EditIcon size={12} /> Editing entry from {new Date(editingEntry.created_at).toLocaleString()}
                        </span>
                        <button onClick={handleCancelEdit} className="underline font-semibold hover:text-blue-900">Cancel</button>
                      </div>
                    )}

                    <form onSubmit={handleSubmit}>
                      {/* Selfie upload */}
                      {selectedTab === "selfie" && (
                        <div className="mb-4">
                          <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Add your selfie</label>
                          <div className="flex items-start gap-3">
                            <label className={`cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 ${selfieImage ? "border-rose-300 bg-rose-50" : "border-gray-200 bg-gray-50 hover:border-rose-300"} text-sm font-semibold transition-colors text-gray-700`}>
                              <CameraIcon size={15} className="text-rose-500" />
                              {selfieImage ? "Change photo" : "Choose photo"}
                              <input type="file" accept="image/*" capture="user" className="hidden"
                                onChange={e => {
                                  const f = e.target.files?.[0];
                                  if (f) { const r = new FileReader(); r.onload = () => setSelfieImage(r.result); r.readAsDataURL(f); }
                                }} />
                            </label>
                            {selfieImage && (
                              <div className="relative">
                                <img src={selfieImage} alt="Selfie preview" className="h-16 w-16 object-cover rounded-xl border-2 border-rose-200" />
                                <button type="button" onClick={() => setSelfieImage(null)}
                                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600 shadow">×</button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Textarea */}
                      <div className="relative">
                        <textarea
                          value={entry}
                          onChange={e => setEntry(e.target.value)}
                          rows={5}
                          placeholder={
                            selectedTab === "growth" && todayPrompt ? "Reflect on today's prompt..."
                            : selectedTab === "weekly" && thisWeekAction ? "Reflect on this week's action..."
                            : selectedTab === "selfie" ? "Add a note for this selfie (optional)..."
                            : "What's on your mind today?"
                          }
                          className="w-full p-4 resize-none border-2 border-gray-200 focus:border-[#002147] focus:ring-2 focus:ring-[#002147]/10 focus:outline-none rounded-xl text-gray-800 leading-relaxed text-sm transition-colors"
                        />
                        <div className="absolute bottom-3 right-3 text-[10px] text-gray-400 bg-white px-2 py-0.5 rounded-lg">
                          {wordCount} {wordCount === 1 ? "word" : "words"}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <CalendarIcon size={12} className="text-gray-400" />
                          {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                        </div>
                        <div className="flex gap-2">
                          {editingEntry && (
                            <button type="button" onClick={handleCancelEdit}
                              className="px-4 py-2 text-xs rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-all font-semibold">
                              Cancel
                            </button>
                          )}
                          <button
                            type="submit"
                            disabled={(selectedTab === "selfie" ? !selfieImage && !entry.trim() : !entry.trim()) || loading}
                            className={`flex items-center gap-1.5 px-5 py-2 text-xs rounded-xl transition-all font-bold shadow-sm ${
                              ((selectedTab === "selfie" ? selfieImage || entry.trim() : entry.trim()) && !loading)
                                ? "bg-[#002147] text-white hover:bg-[#003875] shadow-md"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            <PenIcon size={12} />
                            {loading ? "Saving…" : editingEntry ? "Update Entry" : "Save Entry"}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}

                {/* Past Entries */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5" data-section="past-entries">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-[#002147] flex items-center gap-2">
                      <BookIcon size={14} className="text-gray-400" />
                      Past Entries
                      <span className="text-xs font-normal text-gray-500">({entries.length})</span>
                    </h2>
                    <div className="relative">
                      <SearchIcon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search…"
                        className="pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:border-[#002147] focus:ring-2 focus:ring-[#002147]/10 focus:outline-none w-40"
                      />
                    </div>
                  </div>

                  {loading ? (
                    <div className="text-center py-10">
                      <div className="w-8 h-8 border-2 border-[#002147] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      <p className="text-xs text-gray-400">Loading entries…</p>
                    </div>
                  ) : filteredEntries.length === 0 ? (
                    <div className="text-center py-10">
                      <div className={`inline-flex p-4 rounded-2xl ${tc.iconBg} mb-3`}>
                        {selectedTab === "selfie" ? <CameraIcon size={24} className={tc.iconText} /> : <BookIcon size={24} className={tc.iconText} />}
                      </div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">No entries yet</p>
                      <p className="text-xs text-gray-400">
                        {search ? "No entries match your search." : "Start writing to begin your journey!"}
                      </p>
                    </div>
                  ) : viewMode === "card" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {filteredEntries.map(j => (
                        <EntryCard key={j.id} j={j} selectedTab={selectedTab} tc={tc} onEdit={handleEdit} onDelete={id => setShowDeleteConfirm(id)} onView={setViewingEntry} />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredEntries.map(j => (
                        <EntryRow key={j.id} j={j} selectedTab={selectedTab} tc={tc} onEdit={handleEdit} onDelete={id => setShowDeleteConfirm(id)} onView={setViewingEntry} />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* ── RIGHT COLUMN: Stats + About ── */}
              <div className="space-y-4">

                {/* Stats card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">Your Stats</h3>
                  <div className="space-y-3">
                    {[
                      { label: "Entries written", value: entries.length },
                      { label: selectedTab === "weekly" ? "Weeks completed" : "Days completed", value: completedCount },
                      { label: "Streak goal", value: `${progressMax} ${progressUnit}s` },
                    ].map(stat => (
                      <div key={stat.label} className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{stat.label}</span>
                        <span className="text-sm font-bold text-[#002147]">{stat.value}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-gray-500">Progress</span>
                        <span className={`text-xs font-bold ${tc.text}`}>{progressPct}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${tc.bar} transition-all duration-500`} style={{ width: `${progressPct}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* About this journal */}
                <div className={`bg-white rounded-2xl border ${tc.border} shadow-sm p-5`}>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">About this journal</h3>
                  {selectedTab === "growth" && (
                    <div className="space-y-2">
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Based on <strong className="text-gray-800">365 Journal Writing Ideas</strong> by Rossi Fox — a year of daily prompts, questions &amp; actions to fill your journal with memories, self-reflection, creativity &amp; direction.
                      </p>
                      <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl ${tc.bg} text-xs ${tc.text} font-medium`}>
                        <LightbulbIcon size={12} /> One prompt per day, every day
                      </div>
                    </div>
                  )}
                  {selectedTab === "weekly" && (
                    <div className="space-y-2">
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Weekly actions from <strong className="text-gray-800">365 Journal Writing Ideas</strong> by Rossi Fox — 52 practical exercises to build habits, creativity &amp; meaningful reflection throughout the year.
                      </p>
                      <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl ${tc.bg} text-xs ${tc.text} font-medium`}>
                        <SparkleIcon size={12} /> One action per week, 52 total
                      </div>
                    </div>
                  )}
                  {selectedTab === "selfie" && (
                    <div className="space-y-2">
                      <p className="text-xs text-gray-600 leading-relaxed">
                        A 101-day visual self-portrait journey. Each day features a unique prompt to help you explore identity, growth, courage &amp; self-love through the lens.
                      </p>
                      <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl ${tc.bg} text-xs ${tc.text} font-medium`}>
                        <CameraIcon size={12} /> One selfie + reflection per day
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick tips */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Tips for journaling</h3>
                  <ul className="space-y-2">
                    {[
                      "Write without judgment — just let it flow.",
                      "Even 3 sentences count. Consistency beats perfection.",
                      "Re-read past entries to see your growth.",
                      "Don't skip days; make up missed entries later.",
                    ].map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="w-4 h-4 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ── Delete Confirm Modal ── */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-sm">
            <h3 className="text-base font-bold text-[#002147] mb-2">Delete Entry?</h3>
            <p className="text-sm text-gray-600 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-all text-sm font-semibold">
                Cancel
              </button>
              <button onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all text-sm font-semibold">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── View Entry Modal ── */}
      {viewingEntry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                  {selectedTab === "growth" ? `Day ${viewingEntry.day_number}` : selectedTab === "weekly" ? `Week ${viewingEntry.week_number}` : `Day ${viewingEntry.day_number}`}
                </p>
                <p className="text-sm font-bold text-[#002147]">{new Date(viewingEntry.created_at).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
              </div>
              <button onClick={() => setViewingEntry(null)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
            </div>

            {selectedTab === "selfie" ? (() => {
              try {
                const p = typeof viewingEntry.content === "string" && viewingEntry.content.startsWith("{") ? JSON.parse(viewingEntry.content) : { note: viewingEntry.content, selfie: "" };
                return (
                  <div className="space-y-3">
                    {p.selfie && <img src={p.selfie} alt="Selfie" className="w-full rounded-xl object-cover max-h-64" />}
                    {p.note && <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{p.note}</p>}
                  </div>
                );
              } catch { return <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{viewingEntry.content}</p>; }
            })() : (
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{viewingEntry.content}</p>
            )}
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
              <button onClick={() => setViewingEntry(null)}
                className="px-5 py-2 rounded-xl bg-[#002147] text-white text-sm font-semibold hover:bg-[#003875] transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Entry Row (list view)
// ─────────────────────────────────────────────
function EntryRow({ j, selectedTab, tc, onEdit, onDelete, onView }) {
  const date = new Date(j.created_at);
  const dayLabel = selectedTab === "growth" ? `Day ${j.day_number}` : selectedTab === "weekly" ? `Week ${j.week_number}` : `Day ${j.day_number}`;

  let preview = "";
  let selfieThumb = null;
  if (selectedTab === "selfie") {
    try {
      const p = typeof j.content === "string" && j.content.startsWith("{") ? JSON.parse(j.content) : { note: j.content, selfie: "" };
      preview = p.note || "";
      selfieThumb = p.selfie || null;
    } catch { preview = j.content || ""; }
  } else {
    preview = j.content || "";
  }

  return (
    <div className={`flex items-start gap-3 p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-all group`}>
      {selfieThumb && <img src={selfieThumb} alt="Selfie" className="w-12 h-12 rounded-xl object-cover shrink-0 border border-gray-200" />}
      {!selfieThumb && selectedTab === "selfie" && (
        <div className={`w-12 h-12 rounded-xl ${tc.iconBg} flex items-center justify-center shrink-0`}>
          <CameraIcon size={18} className={tc.iconText} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <span className={`text-xs font-bold ${tc.text}`}>{dayLabel}</span>
          <span className="text-xs text-gray-400">{date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
        </div>
        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
          {preview || <span className="text-gray-400 italic">No note</span>}
        </p>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button onClick={() => onView(j)} className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-500 hover:text-[#002147] transition-colors">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
        <button onClick={() => onEdit(j)} className="p-1.5 rounded-lg hover:bg-blue-100 text-gray-500 hover:text-blue-600 transition-colors">
          <EditIcon size={13} />
        </button>
        <button onClick={() => onDelete(j.id)} className="p-1.5 rounded-lg hover:bg-red-100 text-gray-500 hover:text-red-500 transition-colors">
          <TrashIcon size={13} />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Entry Card (grid view)
// ─────────────────────────────────────────────
function EntryCard({ j, selectedTab, tc, onEdit, onDelete, onView }) {
  const date = new Date(j.created_at);
  const dayLabel = selectedTab === "growth" ? `Day ${j.day_number}` : selectedTab === "weekly" ? `Week ${j.week_number}` : `Day ${j.day_number}`;

  let preview = "";
  let selfieThumb = null;
  if (selectedTab === "selfie") {
    try {
      const p = typeof j.content === "string" && j.content.startsWith("{") ? JSON.parse(j.content) : { note: j.content, selfie: "" };
      preview = p.note || "";
      selfieThumb = p.selfie || null;
    } catch { preview = j.content || ""; }
  } else {
    preview = j.content || "";
  }

  return (
    <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden hover:shadow-sm transition-all group">
      {selfieThumb && <img src={selfieThumb} alt="Selfie" className="w-full h-36 object-cover" />}
      <div className="p-3">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span className={`text-xs font-bold ${tc.text}`}>{dayLabel}</span>
          <span className="text-xs text-gray-400">{date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
        </div>
        <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed mb-3">
          {preview || <span className="text-gray-400 italic">No note</span>}
        </p>
        <div className="flex items-center gap-1">
          <button onClick={() => onView(j)} className="flex-1 py-1.5 text-xs rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 font-medium transition-colors">View</button>
          <button onClick={() => onEdit(j)} className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition-colors border border-gray-200 bg-white"><EditIcon size={12} /></button>
          <button onClick={() => onDelete(j.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors border border-gray-200 bg-white"><TrashIcon size={12} /></button>
        </div>
      </div>
    </div>
  );
}
