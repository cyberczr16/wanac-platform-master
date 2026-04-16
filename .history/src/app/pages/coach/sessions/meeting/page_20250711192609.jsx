"use client";
import React, { useState } from 'react';
import VideoSessionModal from '../../../../../../components/dashboardcomponents/VideoSessionModal';

export default function MeetingPage() {
  const [showVideoSession, setShowVideoSession] = useState(false);
  
  const sessionData = {
    title: "Life Transition Coaching Session",
    coach: "Dr. Sarah Johnson",
    duration: "45 minutes",
    scheduledTime: "2:00 PM - 2:45 PM"
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Coaching Session</h1>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Session Details</h2>
                <div className="mt-2 space-y-2 text-gray-600">
                  <p><span className="font-medium">Title:</span> {sessionData.title}</p>
                  <p><span className="font-medium">Coach:</span> {sessionData.coach}</p>
                  <p><span className="font-medium">Duration:</span> {sessionData.duration}</p>
                  <p><span className="font-medium">Time:</span> {sessionData.scheduledTime}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Session Agenda</h3>
                <ul className="mt-2 space-y-1 text-gray-600">
                  <li>• Review previous week's progress</li>
                  <li>• Discuss current challenges</li>
                  <li>• Set goals for upcoming week</li>
                  <li>• Action planning session</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Pre-Session Checklist</h3>
                <div className="mt-2 space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-gray-600">Camera and microphone tested</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-gray-600">Quiet environment prepared</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-gray-600">Session notes ready</span>
                  </label>
                </div>
              </div>
              
              <button
                onClick={() => setShowVideoSession(true)}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Join Video Session
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {showVideoSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-900/80 via-blue-700/80 to-blue-400/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-0 max-w-2xl w-full relative overflow-hidden animate-fadeInUp">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 bg-gradient-to-r from-blue-700 to-blue-500">
              <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <svg className="w-7 h-7 text-blue-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6.5A2.5 2.5 0 016.5 4h11A2.5 2.5 0 0120 6.5v11a2.5 2.5 0 01-2.5 2.5h-11A2.5 2.5 0 014 17.5v-11z" /></svg>
                {sessionData.title}
              </h2>
              <button
                onClick={() => setShowVideoSession(false)}
                className="text-white hover:text-blue-200 text-3xl font-bold focus:outline-none"
                aria-label="Close video session"
              >
                &times;
              </button>
            </div>
            {/* Video Area */}
            <div className="w-full aspect-video bg-black flex items-center justify-center relative">
              <span className="text-white text-lg opacity-60">[Video Stream Placeholder]</span>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
                <button className="bg-gray-800/80 hover:bg-gray-700 text-white rounded-full p-3 shadow-lg transition-all focus:outline-none" title="Mute/Unmute">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 9v6h4l5 5V4l-5 5H9z" /></svg>
                </button>
                <button className="bg-gray-800/80 hover:bg-gray-700 text-white rounded-full p-3 shadow-lg transition-all focus:outline-none" title="Camera On/Off">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6.5A2.5 2.5 0 016.5 4h11A2.5 2.5 0 0120 6.5v11a2.5 2.5 0 01-2.5 2.5h-11A2.5 2.5 0 014 17.5v-11z" /></svg>
                </button>
                <button onClick={() => setShowVideoSession(false)} className="bg-red-600 hover:bg-red-700 text-white rounded-full p-3 shadow-lg transition-all focus:outline-none" title="Leave Session">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7" /></svg>
                </button>
              </div>
            </div>
            {/* Details */}
            <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-1">
                <p className="text-gray-700"><span className="font-semibold">Coach:</span> {sessionData.coach}</p>
                <p className="text-gray-700"><span className="font-semibold">Duration:</span> {sessionData.duration}</p>
                <p className="text-gray-700"><span className="font-semibold">Time:</span> {sessionData.scheduledTime}</p>
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">Live</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Secure</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}