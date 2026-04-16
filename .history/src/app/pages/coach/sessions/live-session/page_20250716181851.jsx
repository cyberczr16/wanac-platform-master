"use client";
import React, { useState } from "react";
import { FaVideo } from "react-icons/fa";

export default function LiveSessionPage() {
  const [inviteEmail, setInviteEmail] = useState("");
  return (
    <div className="h-screen flex items-center justify-center font-serif bg-gradient-to-br from-blue-50 via-gray-50 to-green-50">
      <div className="max-w-2xl w-full bg-white border border-gray-100 rounded-2xl p-8 shadow-xl flex flex-col gap-6">
        <div className="flex items-center gap-3 mb-2">
          <FaVideo className="text-primary text-2xl" />
          <h2 className="text-2xl font-bold text-primary">Live One-on-One Video Meeting</h2>
        </div>
        <div className="border border-gray-100 rounded-xl p-6 mt-2 bg-gray-50/60">
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex-1">
              <h3 className="font-semibold mb-3 text-gray-700">Send an Invite</h3>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="flex-1 rounded-lg border border-gray-300 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-150 px-4 py-2 outline-none hover:border-primary"
                />
                <button
                  onClick={() => {
                    alert(`Invite sent to ${inviteEmail}`);
                    setInviteEmail("");
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-1 disabled:opacity-50"
                  disabled={!inviteEmail}
                  title="Send Invite"
                >
                  <span className="material-icons" style={{fontSize: '18px'}}>send</span>
                  Send
                </button>
              </div>
            </div>
            <div className="flex flex-col justify-between flex-1">
              <h3 className="font-semibold mb-3 text-gray-700">Meeting Link</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value="https://meet.jit.si/wanac-demo-room"
                  readOnly
                  className="flex-1 bg-gray-100 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 select-all focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-150 outline-none hover:border-primary"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText("https://meet.jit.si/wanac-demo-room");
                    alert("Link copied to clipboard");
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center gap-1"
                  title="Copy Link"
                >
                  <span className="material-icons" style={{fontSize: '18px'}}>content_copy</span>
                  Copy
                </button>
              </div>
            </div>
          </div>
          <div className="w-full flex items-center my-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="mx-4 text-gray-400 text-sm">Live Meeting Room</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <div className="w-full bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="bg-primary/10 py-2 px-4 text-primary font-semibold text-center">Video Session</div>
            <iframe
              title="Live Video Meeting"
              src="https://meet.jit.si/wanac-demo-room"
              width="100%"
              height="400"
              allow="camera; microphone; fullscreen"
              className="rounded-b-xl"
              style={{ border: 0 }}
            />
          </div>
        </div>
      </div>
      {/* Google Material Icons CDN for button icons */}
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
    </div>
  );
}
