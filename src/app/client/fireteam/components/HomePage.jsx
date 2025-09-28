import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { experienceService } from "../../../../services/api/experience.service";
import { fireteamService } from "../../../../services/api/fireteam.service";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Assignments");
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchFireteamExperiences();
  }, []);

  const fetchFireteamExperiences = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Get user's fireteams first
      const fireteams = await fireteamService.getFireteams();
      console.log("Fireteams fetched:", fireteams);
      const allExperiences = [];
      
      // If no fireteams found, try to get experiences directly
      if (!fireteams || fireteams.length === 0) {
        console.log("No fireteams found, trying to get experiences directly");
        // Try to get experiences for a default fireteam or all experiences
        try {
          const experiences = await experienceService.getExperiences(1); // Try fireteam ID 1
          console.log("Direct experiences fetch:", experiences);
          
          const transformedExperiences = experiences.map(exp => ({
            id: exp.id,
            course: "Fireteam Experience",
            instructor: "Coach",
            experience: {
              title: exp.title,
              subtitle: exp.experience || "Interactive Learning Session",
            },
            dueDate: exp.due_date ? new Date(exp.due_date).toLocaleDateString('en-GB', { 
              day: '2-digit', 
              month: 'short', 
              year: 'numeric' 
            }) : "TBD",
            dueTime: exp.due_time || "5:00 PM PDT",
            sessionDate: exp.session_date ? new Date(exp.session_date).toLocaleDateString('en-GB', { 
              day: '2-digit', 
              month: 'short', 
              year: 'numeric' 
            }) : "TBD",
            sessionTime: exp.session_time || "12:00 PM PDT",
            chat: exp.has_chat || false,
            action: exp.status === 'completed' ? "View Results" : "View",
            status: exp.status === 'completed' ? "Completed" : "Upcoming",
            fireteamId: exp.fire_team_id || 1,
            experienceId: exp.id
          }));
          
          allExperiences.push(...transformedExperiences);
        } catch (error) {
          console.error("Error fetching experiences directly:", error);
        }
      } else {
        // Fetch experiences for each fireteam
        for (const fireteam of fireteams) {
          try {
            const experiences = await experienceService.getExperiences(fireteam.id);
            console.log(`Experiences for fireteam ${fireteam.id}:`, experiences);
            
            // Transform experiences to match the UI format
            const transformedExperiences = experiences.map(exp => ({
              id: exp.id,
              course: fireteam.title || "Fireteam Experience",
              instructor: fireteam.coach_name || fireteam.instructor || "Coach",
              experience: {
                title: exp.title,
                subtitle: exp.experience || "Interactive Learning Session",
              },
              dueDate: exp.due_date ? new Date(exp.due_date).toLocaleDateString('en-GB', { 
                day: '2-digit', 
                month: 'short', 
                year: 'numeric' 
              }) : "TBD",
              dueTime: exp.due_time || "5:00 PM PDT",
              sessionDate: exp.session_date ? new Date(exp.session_date).toLocaleDateString('en-GB', { 
                day: '2-digit', 
                month: 'short', 
                year: 'numeric' 
              }) : "TBD",
              sessionTime: exp.session_time || "12:00 PM PDT",
              chat: exp.has_chat || false,
              action: exp.status === 'completed' ? "View Results" : "View",
              status: exp.status === 'completed' ? "Completed" : "Upcoming",
              fireteamId: fireteam.id,
              experienceId: exp.id
            }));
            
            console.log(`Transformed experiences for fireteam ${fireteam.id}:`, transformedExperiences);
            allExperiences.push(...transformedExperiences);
          } catch (error) {
            console.error(`Error fetching experiences for fireteam ${fireteam.id}:`, error);
          }
        }
      }
      
      console.log("All experiences after transformation:", allExperiences);
      setAssignments(allExperiences);
    } catch (error) {
      console.error('Error fetching fireteam experiences:', error);
      setError("Failed to load experiences. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filter assignments based on search and filter
  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.experience.title.toLowerCase().includes(search.toLowerCase()) ||
                         assignment.course.toLowerCase().includes(search.toLowerCase()) ||
                         assignment.instructor.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = filter === "All Assignments" || 
                         (filter === "Upcoming" && assignment.status === "Upcoming") ||
                         (filter === "Completed" && assignment.status === "Completed");
    
    return matchesSearch && matchesFilter;
  });

  // Debug logging
  console.log("Current assignments state:", assignments);
  console.log("Filtered assignments:", filteredAssignments);
  console.log("Loading state:", loading);

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Experiences</h1>
        
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
            <button 
              onClick={fetchFireteamExperiences}
              className="ml-2 text-red-600 hover:text-red-800 underline"
            >
              Retry
            </button>
          </div>
        )}
        
        {/* Search and Filter */}
        <div className="flex items-center justify-between mb-4">
          <input
            type="text"
            placeholder="Search Experiences"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Filter:</span>
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm bg-white"
            >
              <option>All Assignments</option>
              <option>Upcoming</option>
              <option>Completed</option>
            </select>
          </div>
        </div>
        
        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading experiences...</p>
          </div>
        ) : (
          /* Table */
          <div className="bg-white rounded-2xl shadow p-4 overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-xs">
              <thead>
                <tr className="text-xs text-gray-400 border-b">
                  <th className="py-3 px-4 font-medium">Program</th>
                  <th className="px-4 font-medium">Instructor</th>
                  <th className="px-4 font-medium">Experience</th>
                  <th className="px-4 font-medium">Due Date</th>
                  <th className="px-4 font-medium">Session Date</th>
                  <th className="px-4 font-medium">Status</th>
                  <th className="px-4 font-medium">Chat</th>
                  <th className="px-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssignments.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-gray-500">
                      {assignments.length === 0 
                        ? "No experiences found. Join a fireteam to see experiences here."
                        : "No experiences match your search criteria."
                      }
                    </td>
                  </tr>
                ) : (
                  filteredAssignments.map(a => (
                    <tr key={a.id} className="border-b last:border-b-0 hover:bg-blue-50 transition-colors group">
                      <td className="py-4 px-4 font-semibold align-middle">
                        {a.course}
                        <div className="text-[10px] text-gray-400">{a.fireteamId}</div>
                      </td>
                      <td className="px-4 align-middle">{a.instructor}</td>
                      <td className="px-4 align-middle">
                        <div className="font-medium flex items-center gap-2 text-xs">
                          <span className="inline-block w-5 h-5 bg-gray-200 rounded-full" />
                          {a.experience.title}
                        </div>
                        <div className="text-[10px] text-gray-400">{a.experience.subtitle}</div>
                      </td>
                      <td className="px-4 align-middle">
                        <div className="font-semibold text-xs">{a.dueDate}</div>
                        <div className="text-[10px] text-gray-400">{a.dueTime}</div>
                      </td>
                      <td className="px-4 align-middle">
                        <div className="font-semibold text-xs">{a.sessionDate}</div>
                        <div className="text-[10px] text-gray-400">{a.sessionTime}</div>
                      </td>
                      <td className="px-4 align-middle">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${a.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{a.status}</span>
                      </td>
                      <td className="px-4 align-middle text-center">
                        {a.chat ? (
                          <span className="inline-block w-4 h-4 bg-blue-100 rounded-full" />
                        ) : (
                          <span className="inline-block w-4 h-4 border border-gray-300 rounded-full" />
                        )}
                      </td>
                      <td className="px-4 align-middle">
                        <button
                          className="text-[11px] text-blue-600 font-semibold hover:underline group-hover:text-blue-800 transition-colors"
                          onClick={() => router.push(`/client/fireteam/details?id=${a.experienceId}&fireteamId=${a.fireteamId}`)}
                        >
                          {a.action} &rarr;
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}