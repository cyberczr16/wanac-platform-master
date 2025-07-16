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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full relative">
            <button
              onClick={() => setShowVideoSession(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              aria-label="Close video session"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">{sessionData.title}</h2>
            <p className="mb-2 text-gray-700"><span className="font-semibold">Coach:</span> {sessionData.coach}</p>
            <p className="mb-2 text-gray-700"><span className="font-semibold">Duration:</span> {sessionData.duration}</p>
            <p className="mb-4 text-gray-700"><span className="font-semibold">Time:</span> {sessionData.scheduledTime}</p>
            <div className="w-full aspect-video bg-black rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-lg">[Video Stream Placeholder]</span>
            </div>
            <button
              onClick={() => setShowVideoSession(false)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold mt-2"
            >
              Leave Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
}