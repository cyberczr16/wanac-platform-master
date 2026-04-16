"use client";
import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Sidebar from "../../../../../../components/dashboardcomponents/sidebar";
import { fireteamService } from "../../../../../services/api/fireteam.service";
import { experienceService } from "../../../../../services/api/experience.service";

/* ─────────────────────────────────────────────────────────────────────────────
   Small inline icons
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

/* Avatar initials circle */
function Avatar({ name, color = "bg-orange-300" }) {
  const initials = (name ?? "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center
                     text-xs font-bold text-white border-2 border-white`}>
      {initials}
    </div>
  );
}

const avatarColors = ["bg-orange-400", "bg-blue-400", "bg-green-400", "bg-purple-400", "bg-pink-400"];

/* ─────────────────────────────────────────────────────────────────────────────
   Overview Page — matches Breakout's "Assignment Detail" layout
   ───────────────────────────────────────────────────────────────────────────── */
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const resolvedMeetingLink = meetingLink || experience?.link || null;

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

  /* ── Navigate to live session ── */
  const goToSession = () => {
    let url = `/client/fireteam/experience/${experienceId}?id=${experienceId}&fireteamId=${fireteamId}`;
    if (resolvedMeetingLink) url += `&link=${encodeURIComponent(resolvedMeetingLink)}`;
    router.push(url);
  };

  /* ── Navigate to results ── */
  const goToResults = () => {
    router.push(`/client/fireteam/experience/${experienceId}/evaluation?experienceId=${experienceId}&fireteamId=${fireteamId}`);
  };

  const isCompleted = experience?.status === "completed";
  const expTitle = experience?.title ?? "Experience";
  const ftTitle = fireteam?.title ?? "FireTeam";

  return (
    <div className="h-screen flex bg-[#f5f5f5] overflow-hidden">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main className="flex-1 min-w-0 overflow-y-auto px-10 py-8">

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mb-3" />
            <p className="text-sm">Loading…</p>
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
              <button onClick={() => router.push("/client/fireteam")} className="hover:text-gray-700 transition-colors">
                Home
              </button>
              <ChevronRight />
              <span className="text-gray-600 font-medium truncate max-w-xs">{expTitle}</span>
            </nav>

            {/* ── Page title + status badge ── */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <h1 className="text-[1.7rem] font-bold text-gray-900 leading-tight max-w-2xl">
                {expTitle}
              </h1>
              {isCompleted && (
                <div className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-green-600 flex-shrink-0">
                  <CheckIcon />
                  Completed
                </div>
              )}
            </div>

            {/* ── Two-column layout — matches Breakout ── */}
            <div className="flex gap-5">

              {/* ── LEFT card: description + dates + materials ── */}
              <div className="flex-1 bg-white rounded-2xl border border-gray-200 flex flex-col overflow-hidden">
                {/* Card header */}
                <div className="px-6 py-5 border-b border-gray-100 flex items-start gap-4">
                  {/* Experience icon */}
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

                {/* Description */}
                <div className="px-6 py-5 flex-1">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Experience Description
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {experience?.description
                      ?? "In this experience, you'll collaborate with your FireTeam to discuss key concepts, share insights, and grow together through structured discussion and guided learning."}
                  </p>
                </div>

                {/* Footer: dates + course materials */}
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

              {/* ── RIGHT card: group + quiz + actions ── */}
              <div className="w-72 flex-shrink-0 bg-white rounded-2xl border border-gray-200 flex flex-col divide-y divide-gray-100 overflow-hidden">

                {/* Group info */}
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

                  {/* Member avatars */}
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

                  {/* Chat button */}
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors w-full justify-center">
                    <ChatBubble /> Chat
                  </button>
                </div>

                {/* Quiz results (if completed) */}
                {isCompleted && experience?.quiz_score != null && (
                  <div className="px-5 py-5 text-center">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Quiz Results</p>
                    <p className="text-5xl font-black text-gray-900 leading-none mb-2">
                      {experience.quiz_score}%
                    </p>
                    <button
                      onClick={goToResults}
                      className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 mx-auto transition-colors"
                    >
                      View Details <ChevronRight />
                    </button>
                  </div>
                )}

                {/* Experience status + actions */}
                <div className="px-5 py-5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 text-center">
                    Experience
                  </p>
                  <div className="flex items-center justify-center gap-1.5 mb-4 text-sm font-semibold text-green-600">
                    {isCompleted ? (
                      <><CheckIcon /> Completed</>
                    ) : (
                      <span className="text-blue-600">Upcoming</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={goToSession}
                      className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold
                                 text-gray-700 hover:bg-gray-50 transition-colors text-center"
                    >
                      {isCompleted ? "View Experience" : "Join Session"}
                    </button>
                    {isCompleted && (
                      <button
                        onClick={goToResults}
                        className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold
                                   text-gray-700 hover:bg-gray-50 transition-colors text-center"
                      >
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
  );
}
