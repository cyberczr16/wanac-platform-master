"use client";
import { useState, useEffect, useMemo } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Sidebar from "../../../../../../components/dashboardcomponents/sidebar";
import { fireteamService } from "../../../../../services/api/fireteam.service";
import { experienceService } from "../../../../../services/api/experience.service";
import { isUserInMemberList } from "../../../../../lib/fireteamAccess";

/* ─────────────────────────────────────────────────────────────────────────────
   Inline icons
   ───────────────────────────────────────────────────────────────────────────── */
function ChevronRight({ cls = "" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      className={cls}>
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
function CheckIcon({ size = 14 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function ChatBubble() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function ClockIcon({ size = 16 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function CalendarIcon({ size = 16 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function UsersIcon({ size = 16 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function BookIcon({ size = 16 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}
function ListIcon({ size = 16 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}
function VideoIcon({ size = 16 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Avatar
   ───────────────────────────────────────────────────────────────────────────── */
const avatarColors = ["bg-orange-400", "bg-blue-400", "bg-green-400", "bg-purple-400", "bg-pink-400", "bg-teal-400"];

function Avatar({ name, color = "bg-orange-300", size = "w-9 h-9" }) {
  const initials = (name ?? "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className={`${size} rounded-full ${color} flex items-center justify-center
                     text-xs font-bold text-white border-2 border-white shadow-sm`}>
      {initials}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Countdown hook
   ───────────────────────────────────────────────────────────────────────────── */
function useCountdown(targetDate) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!targetDate) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (!targetDate) return null;

  const diff = new Date(targetDate).getTime() - now;
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isLive: true };

  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    isLive: false,
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
   Countdown display
   ───────────────────────────────────────────────────────────────────────────── */
function CountdownUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-14 h-14 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
        <span className="text-2xl font-bold text-gray-900 tabular-nums">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[10px] text-gray-400 uppercase tracking-wider mt-1.5 font-medium">{label}</span>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═════════════════════════════════════════════════════════════════════════════ */
export default function ExperienceOverviewPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const experienceId = params?.experienceid;
  const fireteamId = searchParams?.get("fireteamId");
  const meetingLink = searchParams?.get("link");

  const [collapsed, setCollapsed] = useState(true);
  const [experience, setExperience] = useState(null);
  const [fireteam, setFireteam] = useState(null);
  const [members, setMembers] = useState([]);
  const [agenda, setAgenda] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const resolvedMeetingLink = meetingLink || experience?.link || null;

  useEffect(() => {
    if (!experienceId || !fireteamId) return;
    (async () => {
      try {
        setLoading(true);
        const [exp, ft, mems] = await Promise.all([
          experienceService.getExperience?.(experienceId).catch(() => null),
          fireteamService.getFireteam?.(fireteamId).catch(() => null),
          fireteamService.getFireteamMembers?.(fireteamId).catch(() => []),
        ]);
        // Verify the current client is a member of this fireteam
        const membersList = mems ?? [];
        if (!isUserInMemberList(membersList)) {
          setError("You are not a member of this fireteam.");
          setLoading(false);
          return;
        }

        setExperience(exp);
        setFireteam(ft);
        setMembers(membersList);

        // Extract agenda from experience if present
        const agendaData = exp?.agenda ?? exp?.agenda_steps ?? [];
        setAgenda(Array.isArray(agendaData) ? agendaData : []);
      } catch {
        setError("Failed to load experience details.");
      } finally {
        setLoading(false);
      }
    })();
  }, [experienceId, fireteamId]);

  /* ── Derived state ── */
  const isCompleted = experience?.status === "completed";
  const expTitle = experience?.title ?? "Experience";
  const ftTitle = fireteam?.title ?? "FireTeam";

  // Build session datetime from available data
  const sessionDateTime = useMemo(() => {
    if (experience?.session_date) {
      const d = experience.session_date;
      const t = experience?.session_time ?? "12:00";
      return new Date(`${d}T${t}`);
    }
    if (experience?.available_from) return new Date(experience.available_from);
    return null;
  }, [experience]);

  const countdown = useCountdown(isCompleted ? null : sessionDateTime);

  /* ── Navigation ── */
  const goToSession = () => {
    let url = `/client/fireteam/experience/${experienceId}?id=${experienceId}&fireteamId=${fireteamId}`;
    if (resolvedMeetingLink) url += `&link=${encodeURIComponent(resolvedMeetingLink)}`;
    router.push(url);
  };

  const goToResults = () => {
    router.push(`/client/fireteam/experience/${experienceId}/evaluation?experienceId=${experienceId}&fireteamId=${fireteamId}`);
  };

  const goToQuiz = () => {
    router.push(`/client/fireteam/experience/${experienceId}/quiz?experienceId=${experienceId}&fireteamId=${fireteamId}`);
  };

  /* ── Formatted dates ── */
  const sessionDateFormatted = sessionDateTime
    ? sessionDateTime.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
    : null;
  const sessionTimeFormatted = sessionDateTime
    ? sessionDateTime.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    : experience?.session_time ?? null;

  return (
    <div className="h-screen flex bg-[#f5f5f5] overflow-hidden">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main className="flex-1 min-w-0 overflow-y-auto px-6 md:px-10 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mb-3" />
            <p className="text-sm">Loading experience...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <p className="text-red-500 font-semibold mb-2">{error}</p>
            <button onClick={() => router.back()} className="text-sm text-gray-500 underline">Go back</button>
          </div>
        ) : (
          <>
            {/* ── Breadcrumb ── */}
            <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-2">
              <button onClick={() => router.push("/client/fireteam")}
                className="hover:text-gray-700 transition-colors">
                Home
              </button>
              <ChevronRight />
              <span className="text-gray-600 font-medium truncate max-w-xs">{expTitle}</span>
            </nav>

            {/* ── Page title + status ── */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <h1 className="text-[1.7rem] font-bold text-gray-900 leading-tight max-w-2xl">
                {expTitle}
              </h1>
              {isCompleted && (
                <div className="flex items-center gap-1.5 px-4 py-2 bg-green-50 border border-green-200 rounded-xl text-sm font-semibold text-green-600 flex-shrink-0">
                  <CheckIcon /> Completed
                </div>
              )}
            </div>

            {/* ── Three-column layout ── */}
            <div className="flex gap-5 flex-col lg:flex-row">

              {/* ═══════════════════════════════════════════════════════════════
                 LEFT COLUMN — Main info
                 ═══════════════════════════════════════════════════════════════ */}
              <div className="flex-1 flex flex-col gap-5 min-w-0">

                {/* ── Countdown / status hero card ── */}
                {!isCompleted && (
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <div>
                        <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-1">
                          {countdown?.isLive ? "Happening now" : "Session starts in"}
                        </p>
                        {sessionDateFormatted && (
                          <p className="text-sm text-blue-100 mt-1">
                            {sessionDateFormatted}
                            {sessionTimeFormatted && ` at ${sessionTimeFormatted}`}
                          </p>
                        )}
                      </div>
                      {experience?.duration_mins && (
                        <div className="bg-white/15 rounded-xl px-3 py-2 text-center flex-shrink-0 backdrop-blur-sm">
                          <p className="text-lg font-bold leading-none">{experience.duration_mins}</p>
                          <p className="text-[10px] text-blue-200 mt-0.5">mins</p>
                        </div>
                      )}
                    </div>

                    {countdown && !countdown.isLive ? (
                      <div className="flex gap-3 mb-5">
                        {countdown.days > 0 && <CountdownUnit value={countdown.days} label="Days" />}
                        <CountdownUnit value={countdown.hours} label="Hours" />
                        <CountdownUnit value={countdown.minutes} label="Mins" />
                        <CountdownUnit value={countdown.seconds} label="Secs" />
                      </div>
                    ) : countdown?.isLive ? (
                      <div className="flex items-center gap-2 mb-5">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400" />
                        </span>
                        <span className="text-sm font-medium text-green-200">Session is live now</span>
                      </div>
                    ) : null}

                    <button
                      onClick={goToSession}
                      disabled={countdown && !countdown.isLive && countdown.days > 0}
                      className="w-full py-3 rounded-xl font-semibold text-sm transition-all
                                 bg-white text-blue-700 hover:bg-blue-50 shadow-sm
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 flex items-center justify-center gap-2"
                    >
                      <VideoIcon size={16} />
                      {countdown?.isLive ? "Join Session Now" : "Join Session"}
                    </button>
                    {countdown && !countdown.isLive && countdown.days > 0 && (
                      <p className="text-center text-xs text-blue-200 mt-2">
                        The session link will become available closer to the start time
                      </p>
                    )}
                  </div>
                )}

                {/* ── Experience details card ── */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  {/* Card header */}
                  <div className="px-6 py-5 border-b border-gray-100 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-lg font-bold text-blue-500">
                      {expTitle[0]}
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-bold text-base text-gray-900 truncate">{ftTitle}</h2>
                      <p className="text-sm text-gray-500 mt-0.5">{fireteam?.coach_name ?? "Coach"}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="px-6 py-5">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      Experience Description
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {experience?.description
                        ?? "In this experience, you'll collaborate with your FireTeam to discuss key concepts, share insights, and grow together through structured discussion and guided learning."}
                    </p>
                  </div>

                  {/* Footer: dates + course materials */}
                  <div className="border-t border-gray-100 flex flex-wrap">
                    <div className="px-6 py-4 flex-1 min-w-[200px]">
                      {experience?.available_from && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                          <CalendarIcon size={14} />
                          Available:{" "}
                          <strong className="text-gray-800">
                            {new Date(experience.available_from).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </strong>
                        </div>
                      )}
                      {experience?.due_date && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <ClockIcon size={14} />
                          Due:{" "}
                          <strong className="text-gray-800">
                            {new Date(experience.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </strong>
                        </div>
                      )}
                    </div>
                    <div className="border-l border-gray-100 px-6 py-4 flex items-center">
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                          <BookIcon size={14} /> Course Materials
                        </p>
                        <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors font-medium">
                          View Details <ChevronRight />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Agenda / session outline ── */}
                {agenda.length > 0 && (
                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                      <ListIcon size={16} />
                      <h3 className="font-bold text-sm text-gray-900">Session Agenda</h3>
                      <span className="ml-auto text-xs text-gray-400">{agenda.length} items</span>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {agenda.map((step, i) => (
                        <div key={step.id ?? i} className="px-6 py-3.5 flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-blue-600">{i + 1}</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-800">{step.title}</p>
                            {step.description && (
                              <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
                            )}
                          </div>
                          {step.duration && (
                            <span className="text-xs text-gray-400 flex-shrink-0 flex items-center gap-1">
                              <ClockIcon size={12} /> {step.duration}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Preparation tips (shown for upcoming sessions) ── */}
                {!isCompleted && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                    <h3 className="font-bold text-sm text-amber-900 mb-3 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                      </svg>
                      How to Prepare
                    </h3>
                    <ul className="space-y-2.5">
                      {[
                        "Review the course materials before the session",
                        "Test your microphone and camera",
                        "Find a quiet space with a stable internet connection",
                        "Prepare any questions you'd like to discuss with your team",
                      ].map((tip, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-amber-800">
                          <span className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-[10px] font-bold text-amber-700">{i + 1}</span>
                          </span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* ═══════════════════════════════════════════════════════════════
                 RIGHT COLUMN — Team + actions sidebar
                 ═══════════════════════════════════════════════════════════════ */}
              <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-5">

                {/* ── Team members card ── */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                    <UsersIcon size={16} />
                    <h3 className="font-bold text-sm text-gray-900">Your FireTeam</h3>
                    {members.length > 0 && (
                      <span className="ml-auto text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                        {members.length} member{members.length !== 1 && "s"}
                      </span>
                    )}
                  </div>

                  <div className="px-5 py-4">
                    {/* Coach */}
                    {fireteam?.coach_name && (
                      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                        <Avatar name={fireteam.coach_name} color="bg-blue-500" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{fireteam.coach_name}</p>
                          <p className="text-xs text-blue-600 font-medium">Coach</p>
                        </div>
                      </div>
                    )}

                    {/* Members list */}
                    {members.length > 0 ? (
                      <div className="space-y-3">
                        {members.map((m, i) => (
                          <div key={m.id ?? i} className="flex items-center gap-3">
                            <Avatar
                              name={m.name ?? m.first_name ?? "Member"}
                              color={avatarColors[i % avatarColors.length]}
                            />
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">
                                {m.name ?? (`${m.first_name ?? ""} ${m.last_name ?? ""}`.trim() || "Team Member")}
                              </p>
                              {m.email && (
                                <p className="text-xs text-gray-400 truncate">{m.email}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 text-center py-2">
                        Team members will appear here
                      </p>
                    )}
                  </div>

                  {/* Chat button */}
                  <div className="px-5 pb-5">
                    <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors w-full justify-center">
                      <ChatBubble /> Chat with Team
                    </button>
                  </div>
                </div>

                {/* ── Pre-work quiz card (if available) ── */}
                {!isCompleted && (
                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100">
                      <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
                        </svg>
                        Pre-Session Quiz
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Complete before the session to get the most out of your experience
                      </p>
                    </div>
                    <div className="px-5 py-4">
                      <button
                        onClick={goToQuiz}
                        className="w-full py-2.5 bg-blue-50 text-blue-700 rounded-xl text-sm font-semibold
                                   hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                      >
                        Start Quiz <ChevronRight />
                      </button>
                    </div>
                  </div>
                )}

                {/* ── Quiz results (completed sessions) ── */}
                {isCompleted && experience?.quiz_score != null && (
                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100">
                      <h3 className="font-bold text-sm text-gray-900">Quiz Results</h3>
                    </div>
                    <div className="px-5 py-5 text-center">
                      <p className="text-5xl font-black text-gray-900 leading-none mb-1">
                        {experience.quiz_score}%
                      </p>
                      <p className="text-xs text-gray-400 mb-3">Your score</p>
                      <button
                        onClick={goToResults}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 mx-auto transition-colors font-medium"
                      >
                        View Details <ChevronRight />
                      </button>
                    </div>
                  </div>
                )}

                {/* ── Session info card ── */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <h3 className="font-bold text-sm text-gray-900">Session Details</h3>
                  </div>
                  <div className="px-5 py-4 space-y-3">
                    {sessionDateFormatted && (
                      <div className="flex items-start gap-3">
                        <CalendarIcon size={16} />
                        <div>
                          <p className="text-sm font-medium text-gray-800">{sessionDateFormatted}</p>
                          {sessionTimeFormatted && (
                            <p className="text-xs text-gray-500">{sessionTimeFormatted}</p>
                          )}
                        </div>
                      </div>
                    )}
                    {experience?.duration_mins && (
                      <div className="flex items-center gap-3">
                        <ClockIcon size={16} />
                        <p className="text-sm text-gray-700">{experience.duration_mins} minutes</p>
                      </div>
                    )}
                    {members.length > 0 && (
                      <div className="flex items-center gap-3">
                        <UsersIcon size={16} />
                        <p className="text-sm text-gray-700">{members.length} participant{members.length !== 1 && "s"}</p>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="px-5 pb-5 flex gap-2">
                    {isCompleted ? (
                      <>
                        <button
                          onClick={goToSession}
                          className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold
                                     text-gray-700 hover:bg-gray-50 transition-colors text-center"
                        >
                          View Experience
                        </button>
                        <button
                          onClick={goToResults}
                          className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold
                                     text-gray-700 hover:bg-gray-50 transition-colors text-center"
                        >
                          View Summary
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={goToSession}
                        className="flex-1 px-3 py-2.5 bg-blue-600 rounded-xl text-sm font-semibold
                                   text-white hover:bg-blue-700 transition-colors text-center
                                   flex items-center justify-center gap-2"
                      >
                        <VideoIcon size={14} />
                        Join Session
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
