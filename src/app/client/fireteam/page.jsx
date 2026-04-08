"use client";
import { useState, useEffect, useCallback } from "react";
import Sidebar from '../../../../components/dashboardcomponents/sidebar';
import HomePage from "./components/HomePage";
import { fireteamService } from '../../../services/api/fireteam.service';
import { experienceService } from '../../../services/api/experience.service';
import { filterFireteamsByMembership } from '../../../lib/fireteamAccess';

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
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFireteamData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const allFireteams = await fireteamService.getFireteams();
      // Only show fireteams the current client is a member of
      const fireteams = await filterFireteamsByMembership(allFireteams ?? []);
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
    /* ── Breakout-style shell: light gray page, sidebar + content ── */
    <div className="h-screen flex bg-[#f5f5f5] overflow-hidden">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main scrollable content — heading sits directly on the gray page */}
      <main className="flex-1 min-w-0 overflow-y-auto px-10 py-8">

        {/* Page title — matches Breakout's giant "Assignments" heading */}
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
  );
}
