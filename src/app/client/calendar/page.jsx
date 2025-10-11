"use client";
import React, { useState, useEffect } from "react";
import Sidebar from '../../../../components/dashboardcomponents/sidebar';
import ClientTopbar from '../../../../components/dashboardcomponents/clienttopbar';
import { Dialog } from "@headlessui/react";
import { FaCalendar } from 'react-icons/fa';
import { sessionsService } from '../../../services/api/sessions.service';

function GoogleCalendarConnect() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';').map(c => c.trim());
      const tokenCookie = cookies.find(c => c.startsWith('google_tokens='));
      setConnected(!!tokenCookie);
    }
  }, []);

  return connected ? (
    <div className="flex items-center gap-1.5 mb-3 p-2 bg-green-50 border border-green-200 rounded-lg">
      <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      <span className="text-green-700 font-medium text-[10px]">Connected to Google Calendar</span>
    </div>
  ) : (
    <button
      className="bg-[#002147] hover:bg-[#003875] text-white font-semibold px-3 py-1.5 rounded-lg mb-3 transition-all duration-200 shadow-sm hover:shadow-md text-[11px]"
      onClick={() => window.location.href = '/api/auth/google'}
    >
      Connect Google Calendar
    </button>
  );
}

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [user, setUser] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [events, setEvents] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem('wanacUser');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        sessionsService.getSessions().then((result) => {
          const sessionArray = result?.sessions?.data || [];
          // Filter for sessions where the user is coach or participant
          const filtered = sessionArray.filter(
            (session) =>
              session.coach_id === parsedUser.id ||
              session.user_id === parsedUser.id
          );
          setUpcomingSessions(filtered);
        });
      } catch (e) {
        setUser(null);
      }
    }
  }, []);

  const handleAddEvent = () => {
    if (title.trim() !== "") {
      setEvents([...events, { title, date: selectedDate }]);
      setTitle("");
      setModalOpen(false);
    }
  };

  // Get current date
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Generate days for current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null); // Empty cells for days before the 1st of month
  }
  
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div className="h-screen flex bg-white font-body">
      {/* Sidebar */}
      <Sidebar className="w-56 bg-white border-r border-gray-200" collapsed={collapsed} setCollapsed={setCollapsed} />
      {/* Main Area */}
      <div className="flex-1 flex flex-col h-full transition-all duration-300">
        {/* Top Bar */}
        <ClientTopbar user={user} />
        {/* Main Content */}
        <main className="flex-1 h-0 overflow-y-auto px-4 md:px-6 py-3 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Main Content */}
              <div className="flex-1 space-y-3">
                {/* Header Section */}
                <section className="bg-gradient-to-br from-[#002147] to-[#003875] rounded-xl p-4 shadow-lg relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <img 
                      src="/veterancommunity.png" 
                      alt="Background" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="relative z-10">
                    <h1 className="text-xl font-bold text-white mb-1">Calendar</h1>
                    <p className="text-white/90 text-xs">Manage your schedule and upcoming events</p>
                  </div>
                </section>

                <section className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <GoogleCalendarConnect />
                  
                  {/* Simple Calendar Grid */}
                  <div className="mb-3">
                    <h2 className="text-base font-bold text-[#002147] mb-0.5">
                      {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}
                    </h2>
                    <p className="text-[10px] text-gray-600">Click on any date to add an event</p>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center font-bold text-[#002147] p-1 text-[10px]">
                        {day}
                      </div>
                    ))}
                    
                    {days.map((day, index) => (
                      <div 
                        key={index} 
                        className={`border p-1.5 h-14 rounded transition-all duration-200 cursor-pointer ${
                          day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()
                            ? 'bg-[#002147] border-[#002147] text-white' 
                            : day 
                            ? 'border-gray-200 hover:border-orange-500 hover:shadow-sm bg-white' 
                            : 'bg-gray-50 border-gray-100 cursor-default'
                        }`}
                        onClick={() => {
                          if (day) {
                            setSelectedDate(new Date(currentYear, currentMonth, day));
                            setModalOpen(true);
                          }
                        }}
                      >
                        {day && (
                          <>
                            <div className={`font-semibold text-[10px] mb-0.5 ${
                              day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()
                                ? 'text-white' 
                                : 'text-gray-900'
                            }`}>
                              {day}
                            </div>
                            <div className="text-[8px] space-y-0.5">
                              {events
                                .filter(event => {
                                  const eventDate = new Date(event.date);
                                  return eventDate.getDate() === day && 
                                         eventDate.getMonth() === currentMonth && 
                                         eventDate.getFullYear() === currentYear;
                                })
                                .slice(0, 2)
                                .map((event, i) => (
                                  <div key={i} className="bg-orange-100 text-orange-800 px-0.5 truncate rounded text-[8px] font-medium">
                                    {event.title}
                                  </div>
                                ))
                              }
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              </div>
              
              {/* Right Sidebar */}
              <aside className="lg:w-64 space-y-3">
                {/* Upcoming Sessions Widget */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-3">
                  <h3 className="text-sm font-semibold text-[#002147] mb-2 flex items-center gap-1.5">
                    <FaCalendar className="text-orange-500 text-xs" />
                    Upcoming Sessions
                  </h3>
                  <div className="space-y-2">
                    {upcomingSessions.length === 0 ? (
                      <p className="text-gray-500 text-[10px]">No upcoming sessions.</p>
                    ) : (
                      upcomingSessions.slice(0, 3).map((session) => (
                        <div
                          key={session.id}
                          className="border-l-3 border-[#002147] pl-2 py-1.5 bg-blue-50/50 rounded hover:bg-blue-50 transition-colors"
                        >
                          <p className="font-semibold text-[11px] text-gray-900 line-clamp-1">{session.title || 'Session'}</p>
                          {session.date && (
                            <p className="text-[9px] text-gray-500 mt-0.5 font-medium">
                              {new Date(session.date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric'
                              })}
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Quick Info Card */}
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-sm p-3 text-white">
                  <h3 className="text-sm font-semibold mb-1">Need Help?</h3>
                  <p className="text-[10px] text-white/90 mb-2">
                    Schedule a coaching session or connect with your fireteam.
                  </p>
                  <button className="w-full bg-white text-orange-600 font-semibold py-1.5 px-3 rounded-lg hover:bg-orange-50 transition-colors text-[11px]">
                    Book a Session
                  </button>
                </div>
              </aside>
            </div>
          </div>
          
          {/* Modal */}
          <Dialog open={modalOpen} onClose={() => setModalOpen(false)} className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
              
              <Dialog.Panel className="relative bg-white p-5 rounded-xl shadow-2xl max-w-sm w-full border border-gray-200">
                <Dialog.Title className="text-base font-bold text-[#002147] mb-1">
                  Add Event
                </Dialog.Title>
                <p className="text-[10px] text-gray-600 mb-4">
                  {selectedDate ? selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long',
                    month: 'long', 
                    day: 'numeric' 
                  }) : ''}
                </p>
                
                <div className="mb-4">
                  <label className="block text-[11px] font-medium text-gray-700 mb-1.5">
                    Event Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter event title"
                    className="w-full border-2 border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#002147] focus:border-transparent transition-all"
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <button 
                    className="px-3 py-1.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-[11px]"
                    onClick={() => setModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="px-3 py-1.5 bg-[#002147] text-white font-semibold rounded-lg hover:bg-[#003875] transition-colors shadow-sm hover:shadow-md text-[11px]"
                    onClick={handleAddEvent}
                  >
                    Add Event
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default CalendarPage;