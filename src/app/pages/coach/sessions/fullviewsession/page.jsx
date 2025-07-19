"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { sessionsService } from '../../../../../services/api/sessions.service';
import { FaCalendarAlt, FaUserFriends, FaLink, FaCheckCircle, FaUser, FaFileAlt, FaPlus, FaDownload, FaStickyNote } from 'react-icons/fa';

export default function FullViewSessionPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Mock data for participants/resources/notes if not available from backend
  const [participants, setParticipants] = useState([
    { name: "Sarah Johnson", email: "sarah.johnson@email.com", status: "Confirmed" },
    { name: "Michael Chen", email: "michael.chen@email.com", status: "Confirmed" },
    { name: "Emily Rodriguez", email: "emily.rodriguez@email.com", status: "Confirmed" },
  ]);
  const [resources, setResources] = useState([
    { name: "Leadership Framework Guide.pdf", desc: "Comprehensive guide covering core leadership principles and methodologies" },
    { name: "Action Plan Template.docx", desc: "Structured template for creating personal development action plans" },
    { name: "Team Assessment Worksheet.xlsx", desc: "Self-assessment tool for evaluating team dynamics and leadership style" },
  ]);
  const [notes, setNotes] = useState([
    { content: "Discussed team leadership strategies and set action items for next session." }
  ]);

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);
      try {
        const data = await sessionsService.getSession(id);
        setSession(data);
      } catch (err) {
        setError("Failed to load session.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchSession();
  }, [id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!session) return <div className="p-8">Session not found.</div>;

  // Format date/time
  const dateObj = session.scheduled_at ? new Date(session.scheduled_at) : null;
  const dateStr = dateObj ? dateObj.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '';
  const timeStr = dateObj ? dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : '';
  const duration = session.duration || '90 minutes';

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-5xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              {session.title || 'Session Title'}
              <span className="ml-2 px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 font-semibold align-middle">Upcoming</span>
            </h1>
            <p className="text-gray-600 max-w-2xl">{session.description || 'Session description goes here.'}</p>
          </div>
          <button className="mt-4 md:mt-0 px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded font-medium flex items-center gap-2">
            <FaCheckCircle /> Join Session
          </button>
        </div>
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-start border border-gray-200">
            <div className="flex items-center gap-2 mb-2 text-blue-600"><FaCalendarAlt /> Scheduled</div>
            <div className="font-semibold text-lg">{dateStr}</div>
            <div className="text-gray-500 text-sm">{timeStr} &bull; {duration}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-start border border-gray-200">
            <div className="flex items-center gap-2 mb-2 text-green-600"><FaUserFriends /> Participants</div>
            <div className="font-semibold text-lg">{participants.length} Members</div>
            <div className="text-gray-500 text-sm">All confirmed</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-start border border-gray-200">
            <div className="flex items-center gap-2 mb-2 text-emerald-600"><FaLink /> Session Link</div>
            <div className="font-semibold text-lg text-green-700">Ready to Join</div>
            <div className="text-gray-500 text-sm break-all">{session.session_link || 'N/A'}</div>
          </div>
        </div>
        {/* Participants */}
        <div className="bg-white rounded-lg shadow p-6 mb-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-green-700 font-semibold text-lg"><FaUser /> Session Participants</div>
            <button className="flex items-center gap-1 px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded text-sm font-medium"><FaPlus /> Add Participant</button>
          </div>
          <div className="space-y-3">
            {participants.map((p, idx) => (
              <div key={idx} className="flex items-center justify-between bg-gray-50 rounded px-4 py-2">
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-gray-500">{p.email}</div>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 font-semibold">{p.status}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Resources */}
        <div className="bg-white rounded-lg shadow p-6 mb-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-blue-700 font-semibold text-lg"><FaFileAlt /> Session Resources</div>
            <button className="flex items-center gap-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-sm font-medium"><FaPlus /> Add Resource</button>
          </div>
          <div className="space-y-3">
            {resources.map((r, idx) => (
              <div key={idx} className="flex items-center justify-between bg-gray-50 rounded px-4 py-2">
                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-gray-500">{r.desc}</div>
                </div>
                <button className="flex items-center gap-1 px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-xs font-medium">
                  <FaDownload /> Download
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* Notes */}
        <div className="bg-white rounded-lg shadow p-6 mb-6 border border-gray-200">
          <div className="flex items-center gap-2 text-yellow-700 font-semibold text-lg mb-4"><FaStickyNote /> Session Notes</div>
          <div className="space-y-2">
            {notes.map((n, idx) => (
              <div key={idx} className="bg-gray-50 rounded px-4 py-2 text-gray-700 text-sm">{n.content}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 