"use client";
import React, { useState, useEffect } from "react";
import Sidebar from '../../../../../components/dashboardcomponents/sidebar';
import ClientTopbar from '../../../../../components/dashboardcomponents/clienttopbar';
import { FaCalendar, FaVideo } from 'react-icons/fa';

const mockUpcomingSessions = [
  {
    id: 1,
    title: "Career Guidance",
    date: "2025-06-15",
    time: "10:00 AM",
    status: "Scheduled",
  },
  {
    id: 2,
    title: "Personal Development",
    date: "2025-06-18",
    time: "2:00 PM",
    status: "Scheduled",
  },
];

export default function SessionPage() {
  const [showBooking, setShowBooking] = useState(false);
  const [upcomingSessions, setUpcomingSessions] = useState(mockUpcomingSessions);
  const [liveSession, setLiveSession] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);

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
      status: "Scheduled",
    };
    setUpcomingSessions([...upcomingSessions, newSession]);
    setShowBooking(false);
  };

  return (
    <div className="h-screen flex bg-gray-50 font-serif">
      {/* Sidebar */}
      <Sidebar className="w-56 bg-white border-r border-gray-200" collapsed={collapsed} setCollapsed={setCollapsed} />
      {/* Main Area */}
      <div className="flex-1 flex flex-col h-full transition-all duration-300">
        {/* Top Bar */}
        <ClientTopbar user={user} />
        {/* Main Content */}
        <main className="flex-1 h-0 overflow-y-auto px-4 md:px-12 py-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Content */}
              <div className="flex-1 space-y-8">
                <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-none">
                  <h1 className="text-2xl font-bold mb-4">Sessions</h1>
                  
                  {/* Book a Session */}
                  <div className="mb-6">
                    <button
                      className="px-4 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors"
                      onClick={() => setShowBooking(!showBooking)}
                    >
                      {showBooking ? "Cancel" : "Book a Session"}
                    </button>
                    
                    {showBooking && (
                      <form
                        onSubmit={handleBookSession}
                        className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Title
                              <input
                                name="title"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50"
                                style={{padding: '0.5rem 0.75rem', border: '1px solid #d1d5db'}}
                              />
                            </label>
                          </div>
                          <div>
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
                          </div>
                          <div>
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
                          </div>
                        </div>
                        <div className="mt-4">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
                          >
                            Book
                          </button>
                        </div>
                      </form>
                    )}
                  </div>

                  {/* Upcoming Sessions */}
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                      <FaCalendar className="text-primary" />
                      Upcoming Sessions
                    </h2>
                    
                    {upcomingSessions.length === 0 ? (
                      <p className="text-gray-500 text-sm">No upcoming sessions.</p>
                    ) : (
                      <div className="space-y-4">
                        {upcomingSessions.map((session) => (
                          <div
                            key={session.id}
                            className="border-l-4 border-primary pl-4 py-3 bg-primary/5 rounded"
                          >
                            <div className="flex justify-between">
                              <div>
                                <p className="font-medium text-gray-800">{session.title}</p>
                                <p className="text-sm text-gray-600">Status: {session.status}</p>
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
                  </div>

                  {/* Start Live Video Meeting */}
                  <div>
                    <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                      <FaVideo className="text-primary" />
                      Start a Live One-on-One Video Meeting
                    </h2>
                    
                    <button
                      onClick={() => setLiveSession(!liveSession)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                      style={{ display: 'block', marginBottom: '16px' }}
                    >
                      {liveSession ? "Close Video Section" : "Start Live Video Meeting"}
                    </button>
                    
                    {liveSession && (
                      <div className="border border-gray-200 rounded-lg p-4 mt-4">
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
                  </div>
                </section>
              </div>
              
              {/* Right Sidebar */}
              <div className="lg:w-80 space-y-4">
                {/* Empty widget area */}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}