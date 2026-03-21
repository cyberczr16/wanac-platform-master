"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CoachSidebar from '../../../../components/dashboardcomponents/CoachSidebar';
import ClientTopbar from '../../../../components/dashboardcomponents/clienttopbar';
import {
  FaCalendar, FaVideo, FaRobot, FaBookOpen, FaSpinner,
  FaChevronRight, FaCheck, FaClock, FaPlus
} from 'react-icons/fa';
import { sessionsService } from '../../../services/api/sessions.service';
import { normalizeSessions } from '../../../lib/sessions';

export default function CoachSessionsPage() {
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const router = useRouter();
  const [user, setUser] = useState({ name: "Coach" });
  const [showBooking, setShowBooking] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("wanacUser");
    if (userData) {
      try { setUser(JSON.parse(userData)); } catch (e) { setUser({ name: "Coach" }); }
    } else {
      setUser({ name: "Coach" });
    }
    setMinDate(new Date().toISOString().split("T")[0]);

    const fetchSessions = async () => {
      setLoading(true);
      setFetchError("");
      try {
        const response = await sessionsService.getSessions();
        const sessions = normalizeSessions(response);
        setUpcomingSessions(sessions);
      } catch (error) {
        console.error("Error fetching sessions:", error);
        setFetchError("Could not load sessions. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const handleBookSession = async (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value.trim();
    const notes = form.notes.value.trim();
    const dateValue = form.date.value;
    const scheduled_at = dateValue ? new Date(dateValue).toISOString() : new Date().toISOString();

    try {
      const sessionData = { title: title || "Session", description: notes || "", scheduled_at };
      const newSession = await sessionsService.addSession(sessionData);
      const id = newSession?.id ?? newSession?.session?.id;
      const normalized = normalizeSessions([newSession])[0] || {
        ...newSession, title: title || "Session", notes, status: "Scheduled",
      };
      setUpcomingSessions((prev) => [normalized, ...prev]);
      setShowBooking(false);
      setSuccessMessage("Session scheduled successfully!");
      form.reset();
      setTimeout(() => setSuccessMessage(""), 3000);
      setTimeout(() => { if (id) router.push(`/coach/sessions/fullviewsession/${id}`); }, 1000);
    } catch (error) {
      console.error("Error booking session:", error);
      alert("Failed to book session. Please try again.");
    }
  };

  const statusColor = (status) => {
    if (status === "Completed") return "bg-green-100 text-green-700";
    if (status === "Cancelled") return "bg-red-100 text-red-700";
    return "bg-blue-100 text-blue-700";
  };

  const upcoming = upcomingSessions.filter(s => s.status !== "Completed").length;
  const completed = upcomingSessions.filter(s => s.status === "Completed").length;

  return (
    <div className="min-h-screen h-screen flex bg-[#f8f9fb] font-body overflow-x-hidden">
      <CoachSidebar />
      <div className="flex-1 flex flex-col h-full min-h-0 transition-all duration-300">
        <ClientTopbar user={user || { name: "Coach" }} />
        <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-4 sm:px-6 md:px-8 py-6 bg-[#f8f9fb]">
          <div className="max-w-5xl mx-auto space-y-5">

            {/* Header Banner */}
            <div className="bg-gradient-to-r from-[#002147] via-[#002d63] to-[#003875] rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-white">Coaching Sessions</h1>
                  <p className="text-white/70 text-sm mt-1">Manage, schedule, and run your coaching sessions</p>
                </div>
                {!loading && (
                  <div className="flex gap-3">
                    <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5 text-center border border-white/10">
                      <div className="text-2xl font-bold text-white">{upcoming}</div>
                      <div className="text-[11px] text-white/65">Upcoming</div>
                    </div>
                    <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5 text-center border border-white/10">
                      <div className="text-2xl font-bold text-white">{completed}</div>
                      <div className="text-[11px] text-white/65">Completed</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Main Layout: 2/3 sessions + 1/3 sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

              {/* Sessions List Panel */}
              <div className="lg:col-span-2">
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden h-full">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <FaCalendar className="text-[#002147] text-sm" />
                      <h2 className="font-semibold text-[#002147] text-sm">Scheduled Sessions</h2>
                      {upcomingSessions.length > 0 && (
                        <span className="bg-[#002147] text-white text-[10px] font-bold px-2 py-0.5 rounded-full ml-1">
                          {upcomingSessions.length}
                        </span>
                      )}
                    </div>
                    {upcomingSessions.length > 5 && (
                      <button
                        onClick={() => router.push("/coach/sessions/all")}
                        className="text-xs text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1 transition-colors"
                      >
                        View all <FaChevronRight className="text-[10px]" />
                      </button>
                    )}
                  </div>

                  <div className="p-4">
                    {loading ? (
                      <div className="flex items-center gap-2 py-10 text-gray-400 justify-center text-xs">
                        <FaSpinner className="animate-spin" />
                        Loading sessions…
                      </div>
                    ) : fetchError ? (
                      <p className="text-amber-700 text-xs py-4 text-center">{fetchError}</p>
                    ) : upcomingSessions.length === 0 ? (
                      <div className="py-10 text-center">
                        <FaCalendar className="text-gray-200 text-4xl mx-auto mb-3" />
                        <p className="text-gray-500 text-sm font-semibold">No sessions yet</p>
                        <p className="text-gray-400 text-xs mt-1">Use the panel on the right to schedule your first session.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {upcomingSessions.slice(0, 5).map((session) => (
                          <div
                            key={session.id}
                            className="group flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-[#002147]/20 hover:bg-blue-50/40 transition-all cursor-pointer"
                            onClick={() => router.push(`/coach/sessions/fullviewsession/${session.id}`)}
                          >
                            {/* Date Block */}
                            <div className="shrink-0 w-11 h-11 rounded-xl bg-[#002147]/5 border border-[#002147]/10 flex flex-col items-center justify-center">
                              <span className="text-sm font-bold text-[#002147] leading-tight">
                                {session.date?.split("-")[2] || "—"}
                              </span>
                              <span className="text-[9px] text-gray-400 uppercase leading-tight">
                                {session.date
                                  ? new Date(session.date + "T00:00:00").toLocaleString("default", { month: "short" })
                                  : ""}
                              </span>
                            </div>
                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 text-sm truncate">{session.title}</p>
                              <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                                <FaClock className="text-[9px]" />
                                {session.time || "Time TBD"}
                              </p>
                            </div>
                            {/* Status + Arrow */}
                            <div className="flex items-center gap-2 shrink-0">
                              <span className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full ${statusColor(session.status)}`}>
                                {session.status || "Scheduled"}
                              </span>
                              <FaChevronRight className="text-gray-300 group-hover:text-[#002147] text-[10px] transition-colors" />
                            </div>
                          </div>
                        ))}
                        {upcomingSessions.length > 5 && (
                          <button
                            onClick={() => router.push("/coach/sessions/all")}
                            className="w-full mt-1 py-2.5 text-xs text-center text-[#002147] hover:text-orange-500 font-medium border border-dashed border-gray-200 rounded-xl hover:border-orange-300 transition-all"
                          >
                            View all {upcomingSessions.length} sessions →
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Action Sidebar */}
              <div className="space-y-4">

                {/* Schedule Session Card */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3.5 border-b border-gray-100">
                    <FaBookOpen className="text-orange-500 text-sm" />
                    <h2 className="font-semibold text-[#002147] text-sm">Schedule Session</h2>
                  </div>
                  <div className="p-4">
                    {successMessage && (
                      <div className="mb-3 p-2.5 bg-green-50 border border-green-200 rounded-xl text-green-800 text-xs flex items-center gap-1.5">
                        <FaCheck className="text-green-500 shrink-0" />
                        {successMessage}
                      </div>
                    )}
                    {!showBooking ? (
                      <button
                        onClick={() => { setShowBooking(true); setSuccessMessage(""); }}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-orange-500 text-white rounded-xl text-xs font-semibold hover:bg-orange-600 transition-colors shadow-sm"
                      >
                        <FaPlus className="text-[11px]" /> New Session
                      </button>
                    ) : (
                      <form onSubmit={handleBookSession} className="space-y-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Session Title *</label>
                          <input
                            name="title"
                            placeholder="e.g. Career Planning"
                            required
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:border-[#002147] focus:ring-1 focus:ring-[#002147]/20 focus:outline-none transition-all bg-gray-50 focus:bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Description</label>
                          <textarea
                            name="notes"
                            placeholder="Add notes (optional)"
                            rows={2}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:border-[#002147] focus:ring-1 focus:ring-[#002147]/20 focus:outline-none transition-all bg-gray-50 focus:bg-white resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Date & Time *</label>
                          <input
                            name="date"
                            type="datetime-local"
                            required
                            min={minDate}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:border-[#002147] focus:ring-1 focus:ring-[#002147]/20 focus:outline-none transition-all bg-gray-50 focus:bg-white"
                          />
                        </div>
                        <div className="flex gap-2 pt-1">
                          <button
                            type="submit"
                            className="flex-1 py-2.5 bg-[#002147] text-white rounded-xl text-xs font-semibold hover:bg-[#003875] transition-colors shadow-sm"
                          >
                            Confirm
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowBooking(false)}
                            className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-xs font-medium hover:bg-gray-200 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>

                {/* Live Video Card */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3.5 border-b border-gray-100">
                    <FaVideo className="text-blue-500 text-sm" />
                    <h2 className="font-semibold text-[#002147] text-sm">Live Video</h2>
                  </div>
                  <div className="p-4">
                    <p className="text-[11px] text-gray-500 mb-3 leading-relaxed">
                      Start a live video coaching session instantly without scheduling.
                    </p>
                    <button
                      onClick={() => router.push("/coach/sessions/live-session")}
                      className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <FaVideo className="text-[11px]" /> Start Meeting
                    </button>
                  </div>
                </div>

                {/* AI Insights Card */}
                <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 border border-purple-100 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <FaRobot className="text-purple-500 text-sm" />
                    <h2 className="font-semibold text-[#002147] text-sm">AI Insights</h2>
                  </div>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    Upload session recordings to generate AI-powered transcripts and personalized coaching insights.
                  </p>
                  <div className="mt-3 px-3 py-2 bg-purple-100 rounded-xl text-[10px] text-purple-700 font-semibold text-center tracking-wide uppercase">
                    Coming Soon
                  </div>
                </div>

              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
