"use client";
import { useState, useEffect, useCallback } from "react";
import Sidebar from '../../../../components/dashboardcomponents/sidebar';
import ClientTopbar from '../../../../components/dashboardcomponents/clienttopbar';
import HomePage from "./components/HomePage";
import { fireteamService } from '../../../services/api/fireteam.service';
import { experienceService } from '../../../services/api/experience.service';

function transformExperience(exp, fireteam) {
  return {
    id: exp.id,
    course: fireteam?.title || "Fireteam Experience",
    courseNum: fireteam?.cohort_name || fireteam?.number || "01",
    instructor: fireteam?.coach_name || fireteam?.instructor || "Coach",
    experience: {
      title: exp.title,
      subtitle: exp.experience || "Interactive Learning Session",
      icon: exp.icon || null,
    },
    dueDate: exp.due_date
      ? new Date(exp.due_date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
      : "TBD",
    dueTime: exp.due_time || "5:00 PM PDT",
    sessionDate: exp.session_date
      ? new Date(exp.session_date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
      : "TBD",
    sessionTime: exp.session_time || "12:00 PM PDT",
    chat: exp.has_chat !== undefined ? exp.has_chat : true,
    action: exp.status === 'completed' ? "View Results" : "View",
    status: exp.status === 'completed' ? "Completed" : "Upcoming",
    fireteamId: fireteam?.id ?? exp.fire_team_id,
    experienceId: exp.id,
    meetingLink: exp.link || null,
  };
}

export default function FireteamPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("wanacUser");
    if (userData) {
      try { setUser(JSON.parse(userData)); } catch { /* ignore */ }
    }
  }, []);

  const fetchFireteamData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const fireteams = await fireteamService.getFireteams();
      const allAssignments = [];

      if (fireteams?.length > 0) {
        for (const fireteam of fireteams) {
          try {
            const experiences = await experienceService.getExperiences(fireteam.id);
            allAssignments.push(...experiences.map(exp => transformExperience(exp, fireteam)));
          } catch (err) {
            console.error(`Error fetching experiences for fireteam ${fireteam.id}:`, err);
          }
        }
      }
      setAssignments(allAssignments);
    } catch (err) {
      console.error('Error fetching fireteam data:', err);
      setError("Failed to load experiences. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFireteamData();
  }, [fetchFireteamData]);

  return (
    <div className="h-screen flex bg-[#f5f5f5] overflow-hidden">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="flex-1 flex flex-col h-full min-w-0">
        <ClientTopbar user={user} />

        {/* ========== MOBILE LAYOUT ========== */}
        <main className="md:hidden flex-1 flex flex-col h-0">
          {/* Compact Header */}
          <div className="flex items-center justify-between px-3 py-2.5 bg-gradient-to-r from-[#002147] to-[#003875]">
            <div>
              <h1 className="text-sm font-bold text-white leading-tight">FireTeam</h1>
              <p className="text-[9px] text-white/60">Your learning experiences</p>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <div className="bg-white/10 rounded-lg px-2 py-1 text-center">
                <span className="font-bold text-white">{assignments.filter(a => a.status === 'Upcoming').length}</span>
                <span className="text-white/60 ml-1">Upcoming</span>
              </div>
              <div className="bg-white/10 rounded-lg px-2 py-1 text-center">
                <span className="font-bold text-white">{assignments.filter(a => a.status === 'Completed').length}</span>
                <span className="text-white/60 ml-1">Done</span>
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            <HomePage
              assignments={assignments}
              loading={loading}
              error={error}
              onRetry={fetchFireteamData}
              isMobile={true}
            />
          </div>
        </main>

        {/* ========== DESKTOP LAYOUT ========== */}
        <main className="hidden md:block flex-1 h-0 overflow-y-auto px-10 py-8">
          <h1 className="text-[2.1rem] font-bold text-gray-900 mb-6 tracking-tight leading-none">
            FireTeam
          </h1>
          <HomePage
            assignments={assignments}
            loading={loading}
            error={error}
            onRetry={fetchFireteamData}
          />
        </main>
      </div>
    </div>
  );
}
