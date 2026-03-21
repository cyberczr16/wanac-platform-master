"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CoachSidebar from "../../../../../components/dashboardcomponents/CoachSidebar";
import ClientTopbar from "../../../../../components/dashboardcomponents/clienttopbar";
import {
  FaCalendar, FaSpinner, FaChevronRight, FaClock, FaArrowLeft, FaSearch
} from "react-icons/fa";
import { sessionsService } from "../../../../services/api/sessions.service";
import { normalizeSessions } from "../../../../lib/sessions";

export default function AllCoachSessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [user, setUser] = useState({ name: "Coach" });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("wanacUser");
    if (userData) {
      try { setUser(JSON.parse(userData)); } catch (e) { setUser({ name: "Coach" }); }
    } else {
      setUser({ name: "Coach" });
    }
    const fetchSessions = async () => {
      setLoading(true);
      setFetchError("");
      try {
        const response = await sessionsService.getSessions();
        setSessions(normalizeSessions(response));
      } catch (error) {
        console.error("Error fetching sessions:", error);
        setFetchError("Could not load sessions. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const filtered = sessions.filter(s => {
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (s.title && s.title.toLowerCase().includes(q)) ||
      (s.description && s.description.toLowerCase().includes(q));
    const matchesStatus = statusFilter === "All" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusColor = (status) => {
    if (status === "Completed") return "bg-green-100 text-green-700";
    if (status === "Cancelled") return "bg-red-100 text-red-700";
    return "bg-blue-100 text-blue-700";
  };

  const counts = {
    All: sessions.length,
    Scheduled: sessions.filter(s => s.status === "Scheduled").length,
    Completed: sessions.filter(s => s.status === "Completed").length,
  };

  return (
    <div className="min-h-screen h-screen flex bg-[#f8f9fb] font-body overflow-x-hidden">
      <CoachSidebar />
      <div className="flex-1 flex flex-col h-full transition-all duration-300 min-h-0">
        <ClientTopbar user={user || { name: "Coach" }} />
        <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-4 sm:px-6 md:px-8 py-6 bg-[#f8f9fb]">
          <div className="max-w-3xl mx-auto space-y-5">

            {/* Page Header */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/coach/sessions")}
                className="p-2.5 rounded-xl hover:bg-white border border-transparent hover:border-gray-200 text-gray-400 hover:text-[#002147] transition-all"
              >
                <FaArrowLeft className="text-sm" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-[#002147]">All Sessions</h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  All scheduled, past, and upcoming coaching sessions
                </p>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="relative w-full sm:flex-1 sm:max-w-xs">
                <input
                  type="text"
                  placeholder="Search sessions…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-[#002147]/20 focus:border-[#002147] bg-gray-50 focus:bg-white transition"
                />
                <FaSearch className="absolute left-3 top-2.5 text-gray-400 text-[11px]" />
              </div>
              <div className="flex gap-1.5">
                {["All", "Scheduled", "Completed"].map(f => (
                  <button
                    key={f}
                    onClick={() => setStatusFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition flex items-center gap-1.5 ${
                      statusFilter === f
                        ? "bg-[#002147] text-white shadow-sm"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {f}
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                      statusFilter === f ? "bg-white/20 text-white" : "bg-gray-200 text-gray-500"
                    }`}>
                      {counts[f]}
                    </span>
                  </button>
                ))}
              </div>
              {!loading && (
                <span className="text-xs text-gray-400 sm:ml-auto whitespace-nowrap">
                  {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {/* Sessions List */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              {loading ? (
                <div className="flex items-center gap-2 py-14 text-gray-400 justify-center text-xs">
                  <FaSpinner className="animate-spin" />
                  Loading sessions…
                </div>
              ) : fetchError ? (
                <p className="text-amber-700 text-xs py-8 text-center px-5">{fetchError}</p>
              ) : filtered.length === 0 ? (
                <div className="py-14 text-center">
                  <FaCalendar className="text-gray-200 text-4xl mx-auto mb-3" />
                  <p className="text-gray-500 text-sm font-semibold">No sessions found</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {search || statusFilter !== "All"
                      ? "Try adjusting your search or filter."
                      : "No sessions have been scheduled yet."}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {filtered.map((session) => (
                    <div
                      key={session.id}
                      className="group flex items-center gap-4 px-5 py-4 hover:bg-blue-50/30 transition-colors cursor-pointer"
                      onClick={() => router.push(`/coach/sessions/fullviewsession/${session.id}`)}
                    >
                      {/* Date Block */}
                      <div className="shrink-0 w-12 h-12 rounded-xl bg-[#002147]/5 border border-[#002147]/10 flex flex-col items-center justify-center">
                        <span className="text-sm font-bold text-[#002147] leading-tight">
                          {session.date?.split("-")[2] || "—"}
                        </span>
                        <span className="text-[9px] text-gray-400 uppercase leading-tight">
                          {session.date
                            ? new Date(session.date + "T00:00:00").toLocaleString("default", { month: "short" })
                            : ""}
                        </span>
                      </div>

                      {/* Session Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{session.title}</p>
                        <div className="flex items-center gap-2.5 mt-0.5 flex-wrap">
                          <span className="text-[11px] text-gray-400 flex items-center gap-1">
                            <FaClock className="text-[9px]" />
                            {session.time || "Time TBD"}
                          </span>
                          <span className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full ${statusColor(session.status)}`}>
                            {session.status || "Scheduled"}
                          </span>
                        </div>
                        {session.description && (
                          <p className="text-[11px] text-gray-400 truncate mt-0.5">{session.description}</p>
                        )}
                      </div>

                      {/* Arrow */}
                      <FaChevronRight className="text-gray-300 group-hover:text-[#002147] text-xs transition-colors shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
