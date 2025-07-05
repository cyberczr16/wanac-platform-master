"use client";
import React, { useState, useEffect } from "react";
import CoachSidebar from '../../../../../components/dashboardcomponents/CoachSidebar';
import ClientTopbar from '../../../../../components/dashboardcomponents/clienttopbar';
import { FaCalendar, FaVideo, FaMicrophone, FaUpload, FaRobot, FaBookOpen, FaInfoCircle } from 'react-icons/fa';
import SessionRecorder from "../../client/session/SessionRecorder";
import FileUpload from "../../client/session/FileUpload";

const mockUpcomingSessions = [
  {
    id: 1,
    title: "Coaching with Alex",
    date: "2025-07-10",
    time: "11:00 AM",
    status: "Scheduled",
  },
  {
    id: 2,
    title: "Performance Review",
    date: "2025-07-12",
    time: "3:00 PM",
    status: "Scheduled",
  },
];

export default function CoachSessionsPage() {
  const [upcomingSessions, setUpcomingSessions] = useState(mockUpcomingSessions);
  const [liveSession, setLiveSession] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('wanacUser');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        setUser(null);
      }
    }
  }, []);

  const handleBookSession = (e) => {
    e.preventDefault();
    const form = e.target;
    const newSession = {
      id: upcomingSessions.length + 1,
      title: form.title.value,
      date: form.date.value,
      time: form.time.value,
      link: form.link.value,
      status: "Scheduled",
    };
    setUpcomingSessions([...upcomingSessions, newSession]);
    setShowBooking(false);
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
            <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col gap-2">
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
                            <a href={session.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs mt-1 inline-block">Join Meeting</a>
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

            {/* Schedule a Session */}
            <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-2">
                <FaBookOpen className="text-primary" />
                <h2 className="text-lg font-semibold text-primary">Schedule a Session</h2>
              </div>
              <button
                className="px-4 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors w-max"
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
                      Title
                      <input
                        name="title"
                        required
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meeting Link
                      <input
                        name="link"
                        type="url"
                        placeholder="https://meet.example.com/your-room"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50"
                        style={{padding: '0.5rem 0.75rem', border: '1px solid #d1d5db'}}
                      />
                    </label>
                  </div>
                  <div className="mt-4">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
                    >
                      Schedule
                    </button>
                  </div>
                </form>
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
}
