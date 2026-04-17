"use client";
import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Sidebar from "../../../../../../components/dashboardcomponents/sidebar";
import ClientTopbar from "../../../../../../components/dashboardcomponents/clienttopbar";
import { fireteamService } from "../../../../../services/api/fireteam.service";
import { experienceService } from "../../../../../services/api/experience.service";

/* ── Icons ─────────────────────────────────────────────────────────────────── */
function ChevronRight({ cls = "" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
function ChevronLeft() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
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
function CalendarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}
function BookIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  );
}
function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  );
}

/* Avatar initials circle */
function Avatar({ name, color = "bg-orange-300", size = "w-8 h-8" }) {
  const initials = (name ?? "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className={`${size} rounded-full ${color} flex items-center justify-center text-xs font-bold text-white border-2 border-white`}>
      {initials}
    </div>
  );
}

const avatarColors = ["bg-orange-400", "bg-blue-400", "bg-green-400", "bg-purple-400", "bg-pink-400"];

/* ── Page ──────────────────────────────────────────────────────────────────── */
export default function ExperienceOverviewPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const experienceId = params?.experienceid;
  const fireteamId = searchParams?.get("fireteamId");
  const meetingLink = searchParams?.get("link");

  const [collapsed, setCollapsed] = useState(true);
  const [user, setUser] = useState(null);
  const [experience, setExperience] = useState(null);
  const [fireteam, setFireteam] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const resolvedMeetingLink = meetingLink || experience?.link || null;

  useEffect(() => {
    const userData = localStorage.getItem("wanacUser");
    if (userData) {
      try { setUser(JSON.parse(userData)); } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    if (!experienceId || !fireteamId) return;
    (async () => {
      try {
        setLoading(true);
        const [exp, ft] = await Promise.all([
          experienceService.getExperience?.(experienceId).catch(() => null),
          fireteamService.getFireteam?.(fireteamId).catch(() => null),
        ]);
        setExperience(exp);
        setFireteam(ft);
        if (fireteamId) {
          const mems = await fireteamService.getFireteamMembers?.(fireteamId).catch(() => []);
          setMembers(mems ?? []);
        }
      } catch (e) {
        setError("Failed to load experience details.");
      } finally {
        setLoading(false);
      }
    })();
  }, [experienceId, fireteamId]);

  const goToSession = () => {
    let url = `/client/fireteam/experience/${experienceId}?id=${experienceId}&fireteamId=${fireteamId}`;
    if (resolvedMeetingLink) url += `&link=${encodeURIComponent(resolvedMeetingLink)}`;
    router.push(url);
  };

  const goToResults = () => {
    router.push(`/client/fireteam/experience/${experienceId}/evaluation?experienceId=${experienceId}&fireteamId=${fireteamId}`);
  };

  const isCompleted = experience?.status === "completed";
  const expTitle = experience?.title ?? "Experience";
  const ftTitle = fireteam?.title ?? "FireTeam";

  /* ── Loading / Error shared ── */
  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center flex-1 text-gray-400">
      <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-gray-400 mb-2" />
      <p className="text-xs">Loading...</p>
    </div>
  );

  const renderError = () => (
    <div className="flex flex-col items-center justify-center flex-1 text-center px-4">
      <p className="text-red-500 font-semibold text-sm mb-2">{error}</p>
      <button onClick={() => router.back()} className="text-xs text-gray-500 underline">Go back</button>
    </div>
  );

  return (
    <div className="h-screen flex bg-[#f5f5f5] overflow-hidden font-body">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="flex-1 flex flex-col h-full min-w-0">
        <ClientTopbar user={user} />

        {/* ========== MOBILE LAYOUT ========== */}
        <main className="md:hidden flex-1 flex flex-col h-0 bg-gray-50">
          {loading ? renderLoading() : error ? renderError() : (
            <>
              {/* Compact Header with back + title + status */}
              <div className="bg-gradient-to-r from-[#002147] to-[#003875] px-3 py-3">
                {/* Back + breadcrumb */}
                <button
                  onClick={() => router.push("/client/fireteam")}
                  className="flex items-center gap-1 text-white/60 text-[10px] mb-1.5 hover:text-white/90 transition-colors"
                >
                  <ChevronLeft /> Back to FireTeam
                </button>

                {/* Title + status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-sm font-bold text-white">
                      {expTitle[0]}
                    </div>
                    <div className="min-w-0">
                      <h1 className="text-sm font-bold text-white leading-tight truncate">{expTitle}</h1>
                      <p className="text-[10px] text-white/60 truncate">{ftTitle} · {fireteam?.coach_name ?? "Coach"}</p>
                    </div>
                  </div>
                  <span className={`shrink-0 text-[9px] font-bold px-2 py-1 rounded-full ${
                    isCompleted
                      ? "bg-green-400/20 text-green-300 border border-green-400/30"
                      : "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                  }`}>
                    {isCompleted ? "Completed" : "Upcoming"}
                  </span>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 min-h-0 overflow-y-auto px-3 py-3 space-y-2.5">

                {/* Primary Action Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={goToSession}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                        isCompleted
                          ? "bg-[#002147] text-white hover:bg-[#003875]"
                          : "bg-orange-500 text-white hover:bg-orange-600"
                      }`}
                    >
                      <PlayIcon />
                      {isCompleted ? "View Experience" : "Join Session"}
                    </button>
                    {isCompleted && (
                      <button
                        onClick={goToResults}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold bg-white border-2 border-[#002147] text-[#002147] hover:bg-gray-50 transition-all"
                      >
                        View Summary
                      </button>
                    )}
                    <button className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors shrink-0">
                      <ChatBubble />
                    </button>
                  </div>
                </div>

                {/* Date & Time Info */}
                <div className="grid grid-cols-2 gap-2">
                  {experience?.due_date && (
                    <div className="bg-white border border-gray-200 rounded-xl p-2.5">
                      <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                        <CalendarIcon />
                        <span className="text-[9px] font-semibold uppercase">Due Date</span>
                      </div>
                      <p className="text-xs font-bold text-gray-900">
                        {new Date(experience.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  )}
                  {experience?.session_date && (
                    <div className="bg-white border border-gray-200 rounded-xl p-2.5">
                      <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                        <ClockIcon />
                        <span className="text-[9px] font-semibold uppercase">Session</span>
                      </div>
                      <p className="text-xs font-bold text-gray-900">
                        {new Date(experience.session_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        {experience.session_time && ` · ${experience.session_time}`}
                      </p>
                    </div>
                  )}
                  {!experience?.due_date && !experience?.session_date && (
                    <>
                      <div className="bg-white border border-gray-200 rounded-xl p-2.5">
                        <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                          <CalendarIcon />
                          <span className="text-[9px] font-semibold uppercase">Due Date</span>
                        </div>
                        <p className="text-xs font-bold text-gray-400">TBD</p>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-xl p-2.5">
                        <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                          <ClockIcon />
                          <span className="text-[9px] font-semibold uppercase">Session</span>
                        </div>
                        <p className="text-xs font-bold text-gray-400">TBD</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Quiz Score (if completed) */}
                {isCompleted && experience?.quiz_score != null && (
                  <div className="bg-gradient-to-r from-[#002147] to-[#003875] rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-semibold text-white/60 uppercase">Quiz Score</p>
                      <p className="text-2xl font-black text-white leading-none mt-0.5">{experience.quiz_score}%</p>
                    </div>
                    <button
                      onClick={goToResults}
                      className="flex items-center gap-1 text-[10px] font-semibold text-white/80 hover:text-white transition-colors"
                    >
                      View Details <ChevronRight cls="text-white/60" />
                    </button>
                  </div>
                )}

                {/* Team Members */}
                {members.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <UsersIcon />
                      <span className="text-[11px] font-bold text-gray-900">Team Members</span>
                      <span className="text-[9px] bg-gray-100 text-gray-500 rounded-full px-1.5 py-0.5 font-bold">{members.length}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {members.map((m, i) => (
                        <div key={m.id ?? i} className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-2 py-1.5">
                          <Avatar name={m.name ?? m.first_name} color={avatarColors[i % avatarColors.length]} size="w-6 h-6" />
                          <span className="text-[10px] font-medium text-gray-700">{m.name ?? m.first_name ?? "Member"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="bg-white border border-gray-200 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <BookIcon />
                    <span className="text-[11px] font-bold text-gray-900">Experience Description</span>
                  </div>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    {experience?.description
                      ?? "In this experience, you'll collaborate with your FireTeam to discuss key concepts, share insights, and grow together through structured discussion and guided learning."}
                  </p>
                </div>

                {/* Course Materials */}
                <button className="w-full bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
                      <BookIcon />
                    </div>
                    <div className="text-left">
                      <p className="text-[11px] font-bold text-gray-900">Course Materials</p>
                      <p className="text-[9px] text-gray-400">View preparation resources</p>
                    </div>
                  </div>
                  <ChevronRight cls="text-gray-400" />
                </button>

                {/* Available From */}
                {experience?.available_from && (
                  <div className="bg-white border border-gray-200 rounded-xl p-3">
                    <p className="text-[10px] text-gray-500">
                      Available From:{" "}
                      <strong className="text-gray-800">
                        {new Date(experience.available_from).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </strong>
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </main>

        {/* ========== DESKTOP LAYOUT ========== */}
        <main className="hidden md:block flex-1 h-0 overflow-y-auto px-10 py-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mb-3" />
              <p className="text-sm">Loading...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
              <p className="text-red-500 font-semibold mb-2">{error}</p>
              <button onClick={() => router.back()} className="text-sm text-gray-500 underline">Go back</button>
            </div>
          ) : (
            <>
              {/* Breadcrumb */}
              <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-2">
                <button onClick={() => router.push("/client/fireteam")} className="hover:text-gray-700 transition-colors">Home</button>
                <ChevronRight />
                <span className="text-gray-600 font-medium truncate max-w-xs">{expTitle}</span>
              </nav>

              {/* Page title + status */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <h1 className="text-[1.7rem] font-bold text-gray-900 leading-tight max-w-2xl">{expTitle}</h1>
                {isCompleted && (
                  <div className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-green-600 flex-shrink-0">
                    <CheckIcon /> Completed
                  </div>
                )}
              </div>

              {/* Two-column layout */}
              <div className="flex gap-5">
                {/* LEFT card */}
                <div className="flex-1 bg-white rounded-2xl border border-gray-200 flex flex-col overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-lg font-bold text-blue-500">
                      {expTitle[0]}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <h2 className="font-bold text-base text-gray-900 truncate">{ftTitle}</h2>
                        {experience?.duration_mins && (
                          <div className="text-center flex-shrink-0">
                            <p className="text-xl font-bold text-gray-900 leading-none">{experience.duration_mins}</p>
                            <p className="text-[11px] text-gray-400">Mins</p>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">{fireteam?.coach_name ?? "Coach"}</p>
                    </div>
                  </div>
                  <div className="px-6 py-5 flex-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Experience Description</p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {experience?.description
                        ?? "In this experience, you'll collaborate with your FireTeam to discuss key concepts, share insights, and grow together through structured discussion and guided learning."}
                    </p>
                  </div>
                  <div className="border-t border-gray-100 flex">
                    <div className="px-6 py-4 flex-1">
                      {experience?.available_from && (
                        <p className="text-sm text-gray-500 mb-1">
                          Available From:{" "}
                          <strong className="text-gray-800">
                            {new Date(experience.available_from).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </strong>
                        </p>
                      )}
                      {experience?.due_date && (
                        <p className="text-sm text-gray-500">
                          Due Date:{" "}
                          <strong className="text-gray-800">
                            {new Date(experience.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </strong>
                        </p>
                      )}
                    </div>
                    <div className="border-l border-gray-100 px-6 py-4 flex items-center">
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">Course Materials</p>
                        <button className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 transition-colors">
                          View Details <ChevronRight />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT card */}
                <div className="w-72 flex-shrink-0 bg-white rounded-2xl border border-gray-200 flex flex-col divide-y divide-gray-100 overflow-hidden">
                  <div className="px-5 py-5">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <p className="font-bold text-base text-gray-900">{ftTitle}</p>
                        {experience?.session_date && (
                          <p className="text-sm text-gray-500 mt-0.5">
                            {new Date(experience.session_date).toLocaleDateString("en-US", { weekday: "long" })} at{" "}
                            {experience.session_time ?? "12:00 PM"}
                          </p>
                        )}
                        {experience?.session_date && (
                          <p className="text-xs text-gray-400">
                            {new Date(experience.session_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                          </p>
                        )}
                      </div>
                    </div>
                    {members.length > 0 && (
                      <div className="flex -space-x-2 mb-4">
                        {members.slice(0, 5).map((m, i) => (
                          <Avatar key={m.id ?? i} name={m.name ?? m.first_name} color={avatarColors[i % avatarColors.length]} />
                        ))}
                        {members.length > 5 && (
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 border-2 border-white">
                            +{members.length - 5}
                          </div>
                        )}
                      </div>
                    )}
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors w-full justify-center">
                      <ChatBubble /> Chat
                    </button>
                  </div>
                  {isCompleted && experience?.quiz_score != null && (
                    <div className="px-5 py-5 text-center">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Quiz Results</p>
                      <p className="text-5xl font-black text-gray-900 leading-none mb-2">{experience.quiz_score}%</p>
                      <button onClick={goToResults} className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 mx-auto transition-colors">
                        View Details <ChevronRight />
                      </button>
                    </div>
                  )}
                  <div className="px-5 py-5">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 text-center">Experience</p>
                    <div className="flex items-center justify-center gap-1.5 mb-4 text-sm font-semibold text-green-600">
                      {isCompleted ? (<><CheckIcon /> Completed</>) : (<span className="text-blue-600">Upcoming</span>)}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={goToSession} className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-center">
                        {isCompleted ? "View Experience" : "Join Session"}
                      </button>
                      {isCompleted && (
                        <button onClick={goToResults} className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-center">
                          View Summary
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
    </div>
  );
}
