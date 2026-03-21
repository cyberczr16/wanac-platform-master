"use client";
import React, { useState, useCallback, useEffect } from "react";
import {
  LiveKitRoom,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  useLocalParticipant,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import {
  FaUserPlus, FaCopy, FaMicrophone, FaMicrophoneSlash,
  FaPhoneSlash, FaSpinner, FaCheckCircle, FaVideo
} from "react-icons/fa";
import { MdVideocam, MdVideocamOff, MdScreenShare, MdStopScreenShare } from "react-icons/md";
import CoachSidebar from "../../../../../components/dashboardcomponents/CoachSidebar";
import ClientTopbar from "../../../../../components/dashboardcomponents/clienttopbar";

/* ─────────────────────────────────────────────────────────────
   Media Controls — rendered inside <LiveKitRoom>
───────────────────────────────────────────────────────────── */
function RoomControls({ onLeave }) {
  const { localParticipant } = useLocalParticipant();
  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);

  const toggleMic = useCallback(async () => {
    await localParticipant.setMicrophoneEnabled(!micEnabled);
    setMicEnabled((v) => !v);
  }, [localParticipant, micEnabled]);

  const toggleCam = useCallback(async () => {
    await localParticipant.setCameraEnabled(!camEnabled);
    setCamEnabled((v) => !v);
  }, [localParticipant, camEnabled]);

  const toggleScreenShare = useCallback(async () => {
    await localParticipant.setScreenShareEnabled(!screenSharing);
    setScreenSharing((v) => !v);
  }, [localParticipant, screenSharing]);

  return (
    <div className="flex items-center justify-center gap-3 py-3 px-4 bg-gray-900 border-t border-gray-700">
      <button
        onClick={toggleMic}
        title={micEnabled ? "Mute" : "Unmute"}
        className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-xs font-medium transition-colors min-w-[60px] ${
          micEnabled ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-red-500 text-white hover:bg-red-600"
        }`}
      >
        {micEnabled ? <FaMicrophone size={16} /> : <FaMicrophoneSlash size={16} />}
        <span className="text-[10px]">{micEnabled ? "Mute" : "Unmute"}</span>
      </button>

      <button
        onClick={toggleCam}
        title={camEnabled ? "Stop Video" : "Start Video"}
        className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-xs font-medium transition-colors min-w-[60px] ${
          camEnabled ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-red-500 text-white hover:bg-red-600"
        }`}
      >
        {camEnabled ? <MdVideocam size={16} /> : <MdVideocamOff size={16} />}
        <span className="text-[10px]">{camEnabled ? "Stop Video" : "Start Video"}</span>
      </button>

      <button
        onClick={toggleScreenShare}
        title={screenSharing ? "Stop sharing" : "Share screen"}
        className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-xs font-medium transition-colors min-w-[60px] ${
          screenSharing ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-700 text-white hover:bg-gray-600"
        }`}
      >
        {screenSharing ? <MdStopScreenShare size={16} /> : <MdScreenShare size={16} />}
        <span className="text-[10px]">{screenSharing ? "Stop Share" : "Share Screen"}</span>
      </button>

      <div className="w-px h-8 bg-gray-700 mx-1" />

      <button
        onClick={onLeave}
        title="End meeting"
        className="flex flex-col items-center gap-1 px-5 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition-colors min-w-[60px]"
      >
        <FaPhoneSlash size={16} />
        <span className="text-[10px]">End</span>
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Video Grid — rendered inside <LiveKitRoom>
───────────────────────────────────────────────────────────── */
function VideoGrid({ onLeave }) {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  return (
    <div className="flex flex-col h-full">
      <RoomAudioRenderer />
      <div className="flex-1 min-h-0 p-2 bg-gray-900">
        <GridLayout
          tracks={tracks}
          style={{ width: "100%", height: "100%" }}
        >
          <ParticipantTile />
        </GridLayout>
      </div>
      <RoomControls onLeave={onLeave} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Page
───────────────────────────────────────────────────────────── */
export default function LiveSessionPage() {
  const [user, setUser] = useState({ name: "Coach" });
  const [inviteEmail, setInviteEmail] = useState("");
  const [copied, setCopied] = useState(false);

  // LiveKit state
  const [livekitToken, setLivekitToken] = useState(null);
  const [livekitUrl, setLivekitUrl] = useState(null);
  const [livekitLoading, setLivekitLoading] = useState(false);
  const [livekitError, setLivekitError] = useState("");
  const [connected, setConnected] = useState(false);

  // Generate a unique room name per session load
  const [roomName] = useState(
    `wanac-coach-${Math.random().toString(36).substring(2, 10)}`
  );

  useEffect(() => {
    const userData = localStorage.getItem("wanacUser");
    if (userData) {
      try { setUser(JSON.parse(userData)); } catch (e) { setUser({ name: "Coach" }); }
    }
  }, []);

  const startMeeting = useCallback(async () => {
    setLivekitLoading(true);
    setLivekitError("");
    try {
      const userName = encodeURIComponent(user?.name || "Coach");
      const resp = await fetch(
        `/api/livekit/token?roomName=${encodeURIComponent(roomName)}&userName=${userName}`,
        { cache: "no-store" }
      );
      if (!resp.ok) {
        const body = await resp.json().catch(() => ({}));
        throw new Error(body?.error || `Token request failed (${resp.status})`);
      }
      const data = await resp.json();
      if (!data.token || !data.url) throw new Error("Invalid token response.");
      setLivekitToken(data.token);
      setLivekitUrl(data.url);
      setConnected(true);
    } catch (err) {
      console.error("LiveKit start error:", err);
      setLivekitError(err.message || "Could not start meeting. Please try again.");
    } finally {
      setLivekitLoading(false);
    }
  }, [user, roomName]);

  const endMeeting = useCallback(() => {
    setConnected(false);
    setLivekitToken(null);
    setLivekitUrl(null);
    setLivekitError("");
  }, []);

  const joinUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/join?room=${encodeURIComponent(roomName)}`;

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [joinUrl]);

  const handleSendInvite = () => {
    if (inviteEmail) { alert(`Invite sent to ${inviteEmail}`); setInviteEmail(""); }
  };

  return (
    <div className="h-screen flex bg-[#f8f9fb] font-body">
      <CoachSidebar />
      <div className="flex-1 flex flex-col h-full min-h-0">
        <ClientTopbar user={user} />
        <main className="flex-1 min-h-0 overflow-y-auto px-4 md:px-8 py-6 bg-[#f8f9fb]">
          <div className="max-w-5xl mx-auto space-y-5">

            {/* Header */}
            <div className="bg-gradient-to-r from-[#002147] to-[#003875] rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h1 className="text-xl font-bold text-white">Live Coaching Session</h1>
                  <p className="text-white/70 text-sm mt-1">Powered by LiveKit — HD video, low latency</p>
                </div>
                {connected && (
                  <div className="flex items-center gap-2 bg-green-500/20 border border-green-400/30 rounded-xl px-3 py-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-green-300 text-xs font-semibold">Live</span>
                  </div>
                )}
              </div>
            </div>

            {/* Meeting info card */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
              <div className="flex flex-col md:flex-row md:items-end gap-4">
                {/* Room link */}
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Meeting Link</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={connected ? joinUrl : "Start the meeting to generate a link"}
                      readOnly
                      className={`flex-1 rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-600 ${
                        connected ? "bg-gray-50" : "bg-gray-100 text-gray-400 italic"
                      }`}
                    />
                    <button
                      onClick={handleCopy}
                      disabled={!connected}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-40 ${
                        copied
                          ? "bg-green-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {copied ? <FaCheckCircle size={12} /> : <FaCopy size={12} />}
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>

                {/* Invite */}
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    <FaUserPlus className="inline mr-1 text-[10px]" /> Invite Participant
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="Email address…"
                      className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-xs focus:border-[#002147] focus:ring-1 focus:ring-[#002147]/20 focus:outline-none bg-gray-50 focus:bg-white transition"
                    />
                    <button
                      onClick={handleSendInvite}
                      disabled={!inviteEmail}
                      className="px-3 py-2 bg-[#002147] text-white rounded-xl text-xs font-semibold hover:bg-[#003875] transition-colors disabled:opacity-40 shadow-sm"
                    >
                      Send
                    </button>
                  </div>
                </div>

                {/* Start / End button */}
                <div className="shrink-0">
                  {!connected ? (
                    <button
                      onClick={startMeeting}
                      disabled={livekitLoading}
                      className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-60"
                    >
                      {livekitLoading
                        ? <><FaSpinner className="animate-spin text-xs" /> Connecting…</>
                        : <><FaVideo className="text-xs" /> Start Meeting</>}
                    </button>
                  ) : (
                    <button
                      onClick={endMeeting}
                      className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors shadow-sm"
                    >
                      <FaPhoneSlash className="text-xs" /> End Meeting
                    </button>
                  )}
                </div>
              </div>

              {/* Error */}
              {livekitError && (
                <div className="mt-3 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
                  {livekitError}
                </div>
              )}
            </div>

            {/* Video Area */}
            <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-xl">
              {!connected ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center mb-4">
                    <FaVideo className="text-gray-500 text-2xl" />
                  </div>
                  <p className="text-gray-300 font-semibold text-sm">Your video will appear here</p>
                  <p className="text-gray-500 text-xs mt-2">Click "Start Meeting" above to begin your session</p>
                  {livekitLoading && (
                    <div className="mt-5 flex items-center gap-2 text-blue-400 text-xs">
                      <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                      Connecting to LiveKit…
                    </div>
                  )}
                </div>
              ) : livekitToken && livekitUrl ? (
                <div style={{ height: "560px" }}>
                  <LiveKitRoom
                    token={livekitToken}
                    serverUrl={livekitUrl}
                    connect={true}
                    video={true}
                    audio={true}
                    onDisconnected={endMeeting}
                    style={{ height: "100%", display: "flex", flexDirection: "column" }}
                  >
                    <VideoGrid onLeave={endMeeting} />
                  </LiveKitRoom>
                </div>
              ) : null}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
