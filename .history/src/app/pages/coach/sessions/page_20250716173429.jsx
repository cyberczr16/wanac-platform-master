"use client";
import React, { useState, useEffect } from "react";
import CoachSidebar from '../../../../../components/dashboardcomponents/CoachSidebar';
import ClientTopbar from '../../../../../components/dashboardcomponents/clienttopbar';
import { FaCalendar, FaVideo, FaMicrophone, FaUpload, FaRobot, FaBookOpen, FaInfoCircle } from 'react-icons/fa';
import SessionRecorder from "../../client/session/SessionRecorder";
import FileUpload from "../../client/session/FileUpload";
import { sessionsService } from '../../../../services/api/sessions.service';

export default function CoachSessionsPage() {
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [liveSession, setLiveSession] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [meetingLink, setMeetingLink] = useState("");
  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem('wanacUser');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        setUser(null);
      }
    }
    
    // Set min date for booking form (client only)
    setMinDate(new Date().toISOString().split('T')[0]);
    // Fetch existing sessions
    const fetchSessions = async () => {
      try {
        const sessions = await sessionsService.getSessions();
        setUpcomingSessions(sessions.map(session => {
          // Use fixed formatting for date/time
          const d = new Date(session.date);
          const pad = n => n.toString().padStart(2, '0');
          const date = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
          const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
          return {
            ...session,
            time,
            date,
            link: session.meeting_link || '',
            resources: session.resources || '',
            notes: session.description || '',
            status: session.status || 'Scheduled'
          };
        }));
      } catch (error) {
        console.error('Error fetching sessions:', error);
    }
    };
    fetchSessions();
  }, []);

  const handleBookSession = async (e) => {
    e.preventDefault();
    const form = e.target;
    const clientId = form.client_id.value;
    const title = form.title.value;
    const date = form.date.value;
    const time = form.time.value;
    const resources = form.resources.value;
    const notes = form.notes.value;
    try {
      // Generate meeting link
      const slug = title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-') .replace(/(^-|-$)/g, '') : 'session';
      const randomString = Math.random().toString(36).substring(2, 8);
      const link = `https://meet.jit.si/wanac-${slug}-${randomString}`;

      const sessionData = {
        client_id: clientId,
        coach_id: user?.id || 'temp-coach-id',
        scheduled_at: `${date} ${time}`
      };

      const newSession = await sessionsService.addSession(sessionData);

      // Add to local state for immediate UI update
      // Use fixed formatting for date/time
      const d = new Date(sessionData.scheduled_at);
      const pad = n => n.toString().padStart(2, '0');
      const formattedDate = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
      const formattedTime = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
      setUpcomingSessions([...upcomingSessions, {
        ...newSession,
        title: title || `Session with Client ${clientId}`,
        date: formattedDate,
        time: formattedTime,
        link,
        resources,
        notes,
        status: "Scheduled"
      }]);

      setMeetingLink(link); // Show the generated link after scheduling
      setShowBooking(false);
      form.reset();
    } catch (error) {
      console.error('Error booking session:', error);
      alert('Failed to book session. Please try again.');
    }
    }
  };

  return (
    <div className="h-screen flex bg-gray-50 font-serif">
      {/* Sidebar */}
      <CoachSidebar />
      {/* Main Area */}
      <div className="flex-1 flex flex-col h-full transition-all duration-300">
        {/* Top Bar */}
        <ClientTopbar user={user || { name: "Coach" }} />
        {/* Main Content */}
        <main className="flex-1 h-0 overflow-y-auto px-2 md:px-8 py-6 bg-gray-50">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Welcome & Instructions */}
            <section className="col-span-1 md:col-span-2 bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex items-center gap-4">
              <FaInfoCircle className="text-primary text-2xl" />
              <div>
                <h1 className="text-xl font-bold mb-1">Welcome to Your Coaching Sessions Dashboard</h1>
                <p className="text-gray-600 text-sm">Manage, book, join, record, and review your coaching sessions. Upload recordings to get AI-powered transcripts, summaries, and actionable insights for your clients.</p>
              </div>
            </section>

            {/* All Scheduled Meetings */}
            <section className="col-span-1 md:col-span-2 bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-2">
                <FaCalendar className="text-primary" />
                <h2 className="text-lg font-semibold text-primary">All Scheduled Meetings</h2>
              </div>
              {upcomingSessions.length === 0 ? (
                <p className="text-gray-500 text-sm">No meetings scheduled yet.</p>
              ) : (
                <div className="space-y-3">
                  {upcomingSessions.map((session) => (
                    <div
                      key={session.id}
                      className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded"
                    >
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium text-gray-800">{session.title}</p>
                          <p className="text-sm text-gray-600">Status: {session.status}</p>
                          {session.link && (
                            <div className="mt-1">
                              <label className="text-xs text-gray-500">Meeting Link</label>
                              <input
                                type="text"
                                value={session.link}
                                readOnly
                                className="block w-full text-xs bg-gray-100 border border-gray-300 rounded px-2 py-1 mt-1 text-blue-700 cursor-pointer focus:outline-none"
                                onFocus={e => e.target.select()}
                                onClick={e => e.target.select()}
                              />
                              <a
                                href={session.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline text-xs mt-1 inline-block"
                              >
                                Join Meeting
                              </a>
                            </div>
                          )}
                          {session.resources && (
                            <div className="mt-1">
                              <label className="text-xs text-gray-500">Resources</label>
                              <div className="text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded px-2 py-1 mt-1 break-words">{session.resources}</div>
                            </div>
                          )}
                          {session.notes && (
                            <div className="mt-1">
                              <label className="text-xs text-gray-500">Notes</label>
                              <div className="text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded px-2 py-1 mt-1 break-words">{session.notes}</div>
                            </div>
                          )}
                          {session.files && session.files.length > 0 && (
                            <div className="mt-1">
                              <label className="text-xs text-gray-500">Files</label>
                              <ul className="text-xs mt-1">
                                {session.files.map((file, idx) => (
                                  <li key={idx}>
                                    <a href={file.url} download={file.name} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{file.name}</a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-800">{session.date}</p>
                          <p className="text-sm text-gray-600">{session.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col gap-2 col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <FaBookOpen className="text-primary" />
                <h2 className="text-lg font-semibold text-primary">Schedule a Session</h2>
              </div>
              <button
                className="px-4 py-2 bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600 transition-colors w-max"
                onClick={() => setShowBooking(!showBooking)}
              >
                {showBooking ? "Cancel" : "Schedule a Session"}
              </button>
              {showBooking && (
                <form
                  onSubmit={handleBookSession}
                  className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4"
                >
                  <div className="grid grid-cols-1 gap-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client email <a href=""></a>
                      <input
                        name="client_id"
                        required
                        placeholder="Email"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50"
                        style={{padding: '0.5rem 0.75rem', border: '1px solid #d1d5db'}}
                      />
                    </label>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                      <input
                        name="title"
                        placeholder="Session title"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50"
                        style={{padding: '0.5rem 0.75rem', border: '1px solid #d1d5db'}}
                      />
                    </label>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                      <input
                        name="date"
                        type="date"
                        required
                        min={minDate}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50"
                        style={{padding: '0.5rem 0.75rem', border: '1px solid #d1d5db'}}
                      />
                    </label>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                      <input
                        name="time"
                        type="time"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50"
                        style={{padding: '0.5rem 0.75rem', border: '1px solid #d1d5db'}}
                      />
                    </label>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Resources & Files
                      </label>
                      <input
                        name="resources"
                        type="text"
                        placeholder="Links or materials (optional)"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50"
                        style={{padding: '0.5rem 0.75rem', border: '1px solid #d1d5db'}}
                      />
                      <input
                        name="files"
                        type="file"
                        multiple
                        className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Notes & Additional Files
                      </label>
                      <textarea
                        name="notes"
                        placeholder="Session notes (optional)"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50"
                        style={{padding: '0.5rem 0.75rem', border: '1px solid #d1d5db'}}
                        rows={2}
                      />
                      <input
                        name="additional_files"
                        type="file"
                        multiple
                        className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600 transition-colors"
                    >
                      Schedule
                    </button>
                  </div>
                </form>
              )}
              {/* Show meeting link after scheduling */}
              {meetingLink && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Meeting Link:</label>
                  <input
                    type="text"
                    value={meetingLink}
                    readOnly
                    className="block w-full text-xs bg-gray-100 border border-gray-300 rounded px-2 py-1 mt-1 text-blue-700 cursor-pointer focus:outline-none"
                    onFocus={e => e.target.select()}
                    onClick={e => e.target.select()}
                  />
                  <a
                    href={meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-xs mt-1 inline-block"
                  >
                    Join Meeting
                  </a>
                </div>
              )}
            </section>
            {/* Live Video Meeting */}
            <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col gap-2 md:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <FaVideo className="text-primary" />
                <h2 className="text-lg font-semibold text-primary">Live One-on-One Video Meeting</h2>
              </div>
              <button
                onClick={() => setLiveSession(!liveSession)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors w-max mb-4"
              >
                {liveSession ? "Close Video Section" : "Start Live Video Meeting"}
              </button>
              {liveSession && (
                <div className="border border-gray-200 rounded-lg p-4 mt-2">
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="font-medium mb-2">Send an Invite</h3>
                      <div className="flex gap-2">
                        <input
                          type="email"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          placeholder="Enter email address"
                          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20"
                          style={{padding: '0.5rem 0.75rem', border: '1px solid #d1d5db'}}
                        />
                        <button
                          onClick={() => {
                            alert(`Invite sent to ${inviteEmail}`);
                            setInviteEmail("");
                          }}
                          className="px-3 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
                          disabled={!inviteEmail}
                        >
                          Send
                        </button>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium mb-2">Meeting Link</h3>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value="https://meet.jit.si/wanac-demo-room"
                          readOnly
                          className="flex-1 bg-gray-50 rounded-md border-gray-300"
                          style={{padding: '0.5rem 0.75rem', border: '1px solid #d1d5db'}}
                        />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText("https://meet.jit.si/wanac-demo-room");
                            alert("Link copied to clipboard");
                          }}
                          className="px-3 py-2 bg-gray-600 text-white rounded-md font-medium hover:bg-gray-700 transition-colors"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>
                  <iframe
                    title="Live Video Meeting"
                    src="https://meet.jit.si/wanac-demo-room"
                    width="100%"
                    height="400"
                    allow="camera; microphone; fullscreen"
                    className="rounded-md"
                    style={{ border: 0 }}
                  />
                </div>
              )}
            </section>

            {/* AI Results Placeholder */}
            <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col gap-2 md:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <FaRobot className="text-primary" />
                <h2 className="text-lg font-semibold text-primary">AI Results</h2>
              </div>
              <div className="text-gray-500 text-sm">
                After uploading your session, AI-generated transcript, summary, and insights will appear here.
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
// ...existing code...
