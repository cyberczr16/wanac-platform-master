"use client";
import React, { useState } from "react";
import { FaVideo, FaRegCopy, FaRegPaperPlane } from "react-icons/fa";

export default function LiveSessionPage() {
  const [inviteEmail, setInviteEmail] = useState("");
  const meetingLink = "https://meet.jit.si/wanac-demo-room";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(meetingLink);
    alert("Link copied to clipboard");
  };

  const handleSendInvite = () => {
    alert(`Invite sent to ${inviteEmail}`);
    setInviteEmail("");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 font-sans">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <FaVideo className="text-blue-600 text-xl" />
          <h2 className="text-xl font-semibold text-gray-800">Your Meeting Room</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 bg-gray-50 rounded-xl p-5 border border-gray-200">
            <h3 className="font-medium text-gray-700 mb-3">Send an invite</h3>
            <div className="flex gap-2">
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Type email address"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                onClick={handleSendInvite}
                disabled={!inviteEmail}
                className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  inviteEmail
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <FaRegPaperPlane />
                Send
              </button>
            </div>
          </div>

          <div className="flex-1 bg-gray-50 rounded-xl p-5 border border-gray-200">
            <h3 className="font-medium text-gray-700 mb-3">Meeting link</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={meetingLink}
                readOnly
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
              />
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <FaRegCopy />
                Copy
              </button>
            </div>
          </div>
        </div>

        <div className="w-full h-[450px] rounded-xl overflow-hidden border border-gray-200">
          <iframe
            title="Live Video Meeting"
            src={meetingLink}
            width="100%"
            height="100%"
            allow="camera; microphone; fullscreen"
            className="w-full h-full"
            style={{ border: 0 }}
          />
        </div>
      </div>
    </div>
  );
}
