"use client";
import React, { useState } from "react";
import { FaVideo } from "react-icons/fa";

export default function LiveSessionPage() {
  const [inviteEmail, setInviteEmail] = useState("");
  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 font-serif">
      <div className="max-w-2xl w-full bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-2">
          <FaVideo className="text-primary" />
          <h2 className="text-lg font-semibold text-primary">Live One-on-One Video Meeting</h2>
        </div>
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
      </div>
    </div>
  );
}
