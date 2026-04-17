"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

/* ─────────────────────────────────────────────────────────────────────────────
   Icons — inline SVGs matching Breakout Learning's icon style
   ───────────────────────────────────────────────────────────────────────────── */
function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
      <path d="M21 21l-4.486-4.494M19 10.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0z" />
    </svg>
  );
}

function FilterLinesIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M3 6h18M6 12h12m-9 6h6" />
    </svg>
  );
}

function SortChevron({ active, asc }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24"
      fill="currentColor" stroke="none" aria-hidden="true"
      className={`shrink-0 transition-transform ${active ? "opacity-100 text-gray-800" : "opacity-30 text-gray-500"}
        ${active && asc ? "-rotate-90" : "rotate-90"}`}>
      <path d="M8 6a1 1 0 0 1 1.6-.8l8 6a1 1 0 0 1 0 1.6l-8 6A1 1 0 0 1 8 18V6z" />
    </svg>
  );
}

function ChatBubbleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Filter Dropdown — matches Breakout's "Filter: Current Assignments" pill
   ───────────────────────────────────────────────────────────────────────────── */
const FILTERS = ["Current Assignments", "All Assignments", "Upcoming", "Completed"];

function FilterDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(p => !p)}
        className="flex items-center gap-2 h-[3.25rem] px-4 rounded-2xl bg-white border border-gray-200
                   text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap
                   focus:outline-none focus:ring-2 focus:ring-gray-300"
        aria-expanded={open}
      >
        <span>Filter: {value}</span>
        <FilterLinesIcon />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-30 py-1 overflow-hidden">
          {FILTERS.map(f => (
            <button
              key={f}
              type="button"
              onClick={() => { onChange(f); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                ${f === value ? "bg-gray-100 font-semibold text-gray-900" : "text-gray-700 hover:bg-gray-50"}`}
            >
              {f}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Chat Modal
   ───────────────────────────────────────────────────────────────────────────── */
function ChatModal({ isOpen, onClose, experience }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, sender: "Coach", text: "Welcome to the experience chat! Feel free to ask any questions.", time: "10:30 AM", isCoach: true },
  ]);
  const backdropRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    const onKey = (e) => {
      if (e.key === "Escape") { e.stopPropagation(); onClose(); }
    };
    window.addEventListener("keydown", onKey);
    return () => { clearTimeout(t); window.removeEventListener("keydown", onKey); };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const send = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setMessages(p => [...p, { id: Date.now(), sender: "You", text: message, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), isCoach: false }]);
    setMessage("");
    inputRef.current?.focus();
  };

  return (
    <div
      ref={backdropRef}
      onMouseDown={e => { if (e.target === backdropRef.current) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog" aria-modal="true"
    >
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden max-h-[580px]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-lg text-gray-900">Experience Chat</h3>
            <p className="text-sm text-gray-500">{experience?.title || "Discussion"}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500" aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-gray-50">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.isCoach ? "justify-start" : "justify-end"}`}>
              <div className={`max-w-[72%] rounded-2xl px-4 py-3 text-sm
                ${msg.isCoach ? "bg-white border border-gray-100 text-gray-800" : "bg-gray-900 text-white"}`}>
                <p className="font-semibold text-xs mb-1 opacity-70">{msg.sender} · {msg.time}</p>
                <p className="leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <form onSubmit={send} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Type your message…"
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                         focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className={`p-2.5 rounded-xl transition-all ${message.trim() ? "bg-gray-900 text-white hover:bg-gray-800" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
            >
              <SendIcon />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Experience icon placeholder (like Breakout's colored circle icon)
   ───────────────────────────────────────────────────────────────────────────── */
function ExperienceIcon({ title }) {
  const colors = ["bg-blue-200", "bg-orange-200", "bg-green-200", "bg-purple-200", "bg-yellow-200"];
  const c = colors[(title?.charCodeAt(0) ?? 0) % colors.length];
  return (
    <div className={`w-8 h-8 rounded-full ${c} flex items-center justify-center flex-shrink-0 text-xs font-bold text-gray-700`}>
      {title?.[0] ?? "E"}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Main HomePage component
   ───────────────────────────────────────────────────────────────────────────── */
export default function HomePage({ assignments = [], loading = false, error = "", onRetry, isMobile = false }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Current Assignments");
  const [sortKey, setSortKey] = useState("dueDate");
  const [sortAsc, setSortAsc] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatExp, setChatExp] = useState(null);
  const [mobileFilter, setMobileFilter] = useState("current");
  const router = useRouter();

  /* ── Filter ── */
  const filtered = assignments.filter(a => {
    const q = search.toLowerCase();
    const matchSearch = a.experience.title.toLowerCase().includes(q)
      || a.course.toLowerCase().includes(q)
      || a.instructor.toLowerCase().includes(q);

    const matchFilter =
      filter === "All Assignments" ||
      (filter === "Current Assignments" && a.status === "Upcoming") ||
      (filter === "Upcoming" && a.status === "Upcoming") ||
      (filter === "Completed" && a.status === "Completed");

    return matchSearch && matchFilter;
  });

  /* ── Sort ── */
  const sorted = [...filtered].sort((a, b) => {
    const key = {
      course: a => a.course,
      instructor: a => a.instructor,
      experience: a => a.experience.title,
      dueDate: a => a.dueDate,
      sessionDate: a => a.sessionDate,
    }[sortKey] ?? (_ => "");
    const cmp = String(key(a)).localeCompare(String(key(b)));
    return sortAsc ? cmp : -cmp;
  });

  const toggleSort = k => {
    if (sortKey === k) setSortAsc(p => !p);
    else { setSortKey(k); setSortAsc(true); }
  };

  /* Row click → Overview page (like Breakout's detail card page) */
  const buildUrl = a => {
    const base = `/client/fireteam/overview/${a.experienceId}?fireteamId=${a.fireteamId}`;
    return a.meetingLink ? `${base}&link=${encodeURIComponent(a.meetingLink)}` : base;
  };

  /* ── Column header ── */
  const Th = ({ label, k, cls = "" }) => (
    <th scope="col" className={`px-4 py-3 text-left ${cls}`}>
      <button
        type="button"
        onClick={() => toggleSort(k)}
        className="flex items-center gap-1.5 group focus:outline-none"
      >
        <span className={`text-sm font-semibold select-none transition-colors
          ${sortKey === k ? "text-gray-900 font-bold" : "text-gray-400 group-hover:text-gray-600"}`}>
          {label}
        </span>
        <SortChevron active={sortKey === k} asc={sortAsc} />
      </button>
    </th>
  );

  /* ── Mobile filtered list ── */
  const mobileFiltered = assignments.filter(a => {
    const q = search.toLowerCase();
    const matchSearch = !q || a.experience.title.toLowerCase().includes(q)
      || a.course.toLowerCase().includes(q)
      || a.instructor.toLowerCase().includes(q);
    const matchFilter =
      mobileFilter === "all" ||
      (mobileFilter === "current" && a.status === "Upcoming") ||
      (mobileFilter === "completed" && a.status === "Completed");
    return matchSearch && matchFilter;
  });

  const MOBILE_FILTER_TABS = [
    { key: "current", label: "Current", count: assignments.filter(a => a.status === "Upcoming").length },
    { key: "completed", label: "Completed", count: assignments.filter(a => a.status === "Completed").length },
    { key: "all", label: "All", count: assignments.length },
  ];

  /* ── MOBILE LAYOUT ── */
  if (isMobile) {
    return (
      <>
        {/* Error banner */}
        {error && (
          <div className="mx-3 mt-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center justify-between text-[11px]">
            <span>⚠ {error}</span>
            <button onClick={onRetry} className="ml-2 underline font-semibold text-red-600">Retry</button>
          </div>
        )}

        {/* Search Bar */}
        <div className="px-3 pt-2 pb-1">
          <div className="relative">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search experiences..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 bg-white text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 px-3 py-1.5">
          {MOBILE_FILTER_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setMobileFilter(tab.key)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${
                mobileFilter === tab.key
                  ? 'bg-[#002147] text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
              <span className={`rounded-full px-1.5 py-0.5 text-[8px] font-bold ${
                mobileFilter === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Card List */}
        <div className="flex-1 min-h-0 overflow-y-auto px-3 pb-3 space-y-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-gray-400 mb-2" />
              <p className="text-xs">Loading experiences...</p>
            </div>
          ) : mobileFiltered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                  <path d="M21 21l-4.486-4.494M19 10.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0z" />
                </svg>
              </div>
              <p className="text-xs font-bold text-gray-700 mb-0.5">
                {assignments.length === 0 ? "No assignments yet" : "No matching experiences"}
              </p>
              <p className="text-[10px] text-gray-400">
                {assignments.length === 0 ? "Assignments appear when assigned by your coach." : "Try adjusting your search or filter."}
              </p>
            </div>
          ) : (
            mobileFiltered.map(a => {
              const url = buildUrl(a);
              return (
                <div
                  key={a.id}
                  onClick={() => router.push(url)}
                  className="bg-white border border-gray-200 rounded-xl p-3 active:bg-gray-50 transition-colors cursor-pointer"
                >
                  {/* Top row: icon + title + status badge */}
                  <div className="flex items-start gap-2.5 mb-2">
                    <ExperienceIcon title={a.experience.title} />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[12px] text-gray-900 leading-tight truncate">{a.experience.title}</p>
                      <p className="text-[10px] text-gray-400 truncate mt-0.5">{a.experience.subtitle}</p>
                    </div>
                    <span className={`shrink-0 text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      a.status === "Completed"
                        ? "bg-green-50 text-green-600 border border-green-200"
                        : "bg-amber-50 text-amber-600 border border-amber-200"
                    }`}>
                      {a.status}
                    </span>
                  </div>

                  {/* Course + Instructor */}
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-[10px] font-semibold text-[#002147]">{a.course}</span>
                    <span className="text-[10px] text-gray-300">·</span>
                    <span className="text-[10px] text-gray-500">{a.instructor}</span>
                  </div>

                  {/* Date row */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-400">
                        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      <span className="text-[10px] text-gray-600">Due: <span className="font-semibold text-gray-800">{a.dueDate}</span></span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-400">
                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                      </svg>
                      <span className="text-[10px] text-gray-600">Session: <span className="font-semibold text-gray-800">{a.sessionDate}</span></span>
                    </div>
                  </div>

                  {/* Bottom action row */}
                  <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-gray-100">
                    {a.chat ? (
                      <button
                        onClick={e => { e.stopPropagation(); setChatExp(a); setChatOpen(true); }}
                        className="flex items-center gap-1 text-[10px] font-semibold text-gray-500 hover:text-gray-800 transition-colors"
                      >
                        <ChatBubbleIcon /> Chat
                      </button>
                    ) : (
                      <span />
                    )}
                    <button
                      onClick={e => { e.stopPropagation(); router.push(url); }}
                      className="flex items-center gap-1 text-[11px] font-bold text-[#002147] hover:text-orange-500 transition-colors"
                    >
                      {a.action}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <ChatModal
          isOpen={chatOpen}
          onClose={() => { setChatOpen(false); setChatExp(null); }}
          experience={chatExp?.experience}
        />
      </>
    );
  }

  /* ── DESKTOP LAYOUT (unchanged) ── */
  return (
    <>
      {/* ── Error banner ── */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center justify-between text-sm">
          <span>⚠ {error}</span>
          <button onClick={onRetry} className="ml-4 underline font-semibold text-red-600 hover:text-red-800">Retry</button>
        </div>
      )}

      {/* ── Search + Filter row ── */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search Experiences"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-[3.25rem] pl-10 pr-4 rounded-2xl border border-gray-200 bg-white
                       text-sm text-gray-800 placeholder:text-gray-400
                       focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
          />
        </div>
        <FilterDropdown value={filter} onChange={setFilter} />
      </div>

      {/* ── Table card ── */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mb-3" />
            <p className="text-sm">Loading experiences…</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <Th label="Course" k="course" />
                  <Th label="Instructor" k="instructor" />
                  <Th label="Experience" k="experience" />
                  <Th label="Due Date" k="dueDate" cls="w-32" />
                  <Th label="Session Date" k="sessionDate" cls="w-32" />
                  <th scope="col" className="px-4 py-3 text-center w-16">
                    <span className="text-sm font-semibold text-gray-400">Chat</span>
                  </th>
                  <th scope="col" className="px-4 py-3 text-center w-28">
                    <span className="text-sm font-semibold text-gray-400">Action</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sorted.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div className="flex flex-col items-center justify-center py-20 text-center">
                        <p className="text-base font-bold text-gray-800 mb-1">
                          {assignments.length === 0
                            ? "You have no current or upcoming assignments."
                            : "No matching experiences."}
                        </p>
                        <p className="text-sm text-gray-400">
                          {assignments.length === 0
                            ? "Assignments will appear here when assigned by your coach."
                            : "Try adjusting your search or filter."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sorted.map(a => {
                    const url = buildUrl(a);
                    const go = () => router.push(url);
                    return (
                      <tr
                        key={a.id}
                        role="button"
                        tabIndex={0}
                        onClick={go}
                        onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } }}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <td className="px-4 py-4 align-middle">
                          <p className="font-semibold text-sm text-gray-900">{a.course}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{a.courseNum}</p>
                        </td>
                        <td className="px-4 py-4 align-middle">
                          <p className="text-sm text-gray-700">{a.instructor}</p>
                        </td>
                        <td className="px-4 py-4 align-middle">
                          <div className="flex items-center gap-2.5">
                            <ExperienceIcon title={a.experience.title} />
                            <div className="min-w-0">
                              <p className="font-semibold text-sm text-gray-900 truncate max-w-[200px]">{a.experience.title}</p>
                              <p className="text-xs text-gray-400 truncate max-w-[200px]">{a.experience.subtitle}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 align-middle w-32">
                          <p className="text-sm font-medium text-gray-800">{a.dueDate}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{a.dueTime}</p>
                        </td>
                        <td className="px-4 py-4 align-middle w-32">
                          <p className="text-sm font-medium text-gray-800">{a.sessionDate}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{a.sessionTime}</p>
                        </td>
                        <td className="px-4 py-4 align-middle text-center w-16">
                          {a.chat ? (
                            <button
                              onClick={e => { e.stopPropagation(); setChatExp(a); setChatOpen(true); }}
                              className="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-800"
                              title="Open chat"
                              aria-label={`Chat for ${a.experience?.title}`}
                            >
                              <ChatBubbleIcon />
                            </button>
                          ) : (
                            <span className="inline-block w-5 h-5 border-2 border-gray-200 rounded-full opacity-40" />
                          )}
                        </td>
                        <td className="px-4 py-4 align-middle text-center w-28">
                          <button
                            onClick={e => { e.stopPropagation(); router.push(url); }}
                            className="text-sm font-semibold text-gray-800 hover:text-gray-500 flex items-center gap-1 mx-auto transition-colors"
                            aria-label={`${a.action} — ${a.experience?.title}`}
                          >
                            {a.action}
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                              fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M9 18l6-6-6-6" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Chat Modal ── */}
      <ChatModal
        isOpen={chatOpen}
        onClose={() => { setChatOpen(false); setChatExp(null); }}
        experience={chatExp?.experience}
      />
    </>
  );
}
