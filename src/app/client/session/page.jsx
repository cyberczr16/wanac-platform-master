"use client";
import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../../../../components/dashboardcomponents/sidebar";
import ClientTopbar from "../../../../components/dashboardcomponents/clienttopbar";
import {
  FaCalendar,
  FaVideo,
  FaSpinner,
  FaChevronRight,
  FaClock,
  FaCheckCircle,
  FaCopy,
  FaEnvelope,
  FaExternalLinkAlt,
  FaMicrophone,
  FaMicrophoneSlash,
  FaPhoneSlash,
} from "react-icons/fa";
import { MdVideocam, MdVideocamOff } from "react-icons/md";
import {
  LiveKitRoom,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  useLocalParticipant,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { sessionsService } from "../../../services/api/sessions.service";
import { useRouter } from "next/navigation";

/* ─────────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────────── */
function normalizeSessions(raw) {
  const list = Array.isArray(raw) ? raw : raw?.sessions?.data ?? raw?.data ?? [];
  if (!Array.isArray(list)) return [];
  return list.map((session) => {
    const at = session.scheduled_at || session.date;
    const d = at ? new Date(at) : new Date();
    const pad = (n) => n.toString().padStart(2, "0");
    const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    return {
      ...session,
      time,
      date,
      link: session.session_link || session.meeting_link || "",
      notes: session.description || "",
      status: session.status || "Scheduled",
    };
  });
}

/* ─────────────────────────────────────────────────────────────
   In-room Controls — must render inside <LiveKitRoom>
───────────────────────────────────────────────────────────── */
function RoomControls({ onLeave }) {
  const { localParticipant } = useLocalParticipant();
  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);

  const toggleMic = useCallback(async () => {
    await localParticipant.setMicrophoneEnabled(!micEnabled);
    setMicEnabled((v) => !v);
  }, [localParticipant, micEnabled]);

  const toggleCam = useCallback(async () => {
    await localParticipant.setCameraEnabled(!camEnabled);
    setCamEnabled((v) => !v);
  }, [localParticipant, camEnabled]);

  return (
    <div className="flex items-center justify-center gap-3 py-3 bg-gray-900 border-t border-gray-700">
      {/* Mic */}
      <button
        onClick={toggleMic}
        title={micEnabled ? "Mute microphone" : "Unmute microphone"}
        className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-xs font-medium transition-colors ${
          micEnabled
            ? "bg-gray-700 text-white hover:bg-gray-600"
            : "bg-red-500 text-white hover:bg-red-600"
        }`}
      >
        {micEnabled ? <FaMicrophone size={16} /> : <FaMicrophoneSlash size={16} />}
        <span className="text-[10px]">{micEnabled ? "Mute" : "Unmute"}</span>
      </button>

      {/* Camera */}
      <button
        onClick={toggleCam}
        title={camEnabled ? "Stop camera" : "Start camera"}
        className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-xs font-medium transition-colors ${
          camEnabled
            ? "bg-gray-700 text-white hover:bg-gray-600"
            : "bg-red-500 text-white hover:bg-red-600"
        }`}
      >
        {camEnabled ? <MdVideocam size={16} /> : <MdVideocamOff size={16} />}
        <span className="text-[10px]">{camEnabled ? "Stop Video" : "Start Video"}</span>
      </button>

      {/* Leave */}
      <button
        onClick={onLeave}
        title="Leave meeting"
        className="flex flex-col items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-medium hover:bg-red-700 transition-colors"
      >
        <FaPhoneSlash size={16} />
        <span className="text-[10px]">Leave</span>
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Video Grid — must render inside <LiveKitRoom>
───────────────────────────────────────────────────────────── */
function VideoGrid({ onLeave, loading, error, inviteEmail, setInviteEmail, meetingLink, copied, onCopy }) {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-b-2xl overflow-hidden">
      <RoomAudioRenderer />

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-white font-medium">Live Session</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Invite row inline */}
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="Invite by email…"
            className="rounded-lg border border-gray-600 bg-gray-700 text-white px-2.5 py-1.5 text-xs placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 w-44"
          />
          <button
            onClick={() => { if (inviteEmail) { alert(`Invite sent to ${inviteEmail}`); setInviteEmail(""); } }}
            disabled={!inviteEmail}
            className="px-3 py-1.5 bg-[#002147] text-white rounded-lg text-xs font-semibold hover:bg-[#003875] disabled:opacity-40 transition-colors"
          >
            <FaEnvelope className="inline mr-1 text-[10px]" /> Send
          </button>
          <button
            onClick={onCopy}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
              copied ? "bg-green-500 text-white" : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
          >
            {copied ? <FaCheckCircle className="text-[10px]" /> : <FaCopy className="text-[10px]" />}
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-900 rounded-b-2xl">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-white text-sm font-medium">Connecting to LiveKit…</p>
          <p className="text-gray-400 text-xs mt-1">Setting up your camera & mic</p>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="mx-4 mt-2 px-3 py-2 bg-red-900/70 border border-red-500/50 rounded-lg text-red-300 text-xs">
          {error}
        </div>
      )}

      {/* Video grid */}
      <div className="flex-1 min-h-0 p-2 relative">
        <GridLayout
          tracks={tracks}
          style={{ width: "100%", height: "100%" }}
        >
          <ParticipantTile />
        </GridLayout>
      </div>

      {/* Controls */}
      <RoomControls onLeave={onLeave} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Page
───────────────────────────────────────────────────────────── */
export default function SessionPage() {
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [liveSession, setLiveSession] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [copied, setCopied] = useState(false);

  // LiveKit state
  const [livekitToken, setLivekitToken] = useState(null);
  const [livekitUrl, setLivekitUrl] = useState(null);
  const [livekitLoading, setLivekitLoading] = useState(false);
  const [livekitError, setLivekitError] = useState("");

  const router = useRouter();
  const roomName = "wanac-session-room";

  useEffect(() => {
    const userData = localStorage.getItem("wanacUser");
    if (userData) {
      try { setUser(JSON.parse(userData)); } catch (e) { setUser(null); }
    }
    const fetchSessions = async () => {
      setLoading(true);
      setFetchError("");
      try {
        const data = await sessionsService.getSessions();
        setUpcomingSessions(normalizeSessions(data));
      } catch (error) {
        console.error("Error fetching sessions:", error);
        setFetchError("Could not load sessions. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const startMeeting = useCallback(async () => {
    setLivekitLoading(true);
    setLivekitError("");
    try {
      const userName = encodeURIComponent(user?.name || "Participant");
      const resp = await fetch(
        `/api/livekit/token?roomName=${encodeURIComponent(roomName)}&userName=${userName}`,
        { cache: "no-store" }
      );
      if (!resp.ok) {
        const body = await resp.json().catch(() => ({}));
        throw new Error(body?.error || `Token request failed (${resp.status})`);
      }
      const data = await resp.json();
      if (!data.token || !data.url) throw new Error("Invalid token response from server.");
      setLivekitToken(data.token);
      setLivekitUrl(data.url);
      setLiveSession(true);
    } catch (err) {
      console.error("LiveKit start error:", err);
      setLivekitError(err.message || "Could not start meeting. Please try again.");
    } finally {
      setLivekitLoading(false);
    }
  }, [user, roomName]);

  const endMeeting = useCallback(() => {
    setLiveSession(false);
    setLivekitToken(null);
    setLivekitUrl(null);
    setLivekitError("");
  }, []);

  const handleCopyLink = useCallback(() => {
    const shareLink = `${window.location.origin}/join?room=${encodeURIComponent(roomName)}`;
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [roomName]);

  const statusColor = (status) => {
    if (status === "Completed") return "bg-green-100 text-green-700";
    if (status === "Cancelled") return "bg-red-100 text-red-700";
    return "bg-blue-100 text-blue-700";
  };

  return (
    <div className="h-screen flex bg-[#f8f9fb] font-body">
      <Sidebar
        className="w-56 bg-white border-r border-gray-200"
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <div className="flex-1 flex flex-col h-full min-h-0 transition-all duration-300">
        <ClientTopbar user={user} />
        <main className="flex-1 min-h-0 overflow-y-auto px-4 md:px-8 py-6 bg-[#f8f9fb]">
          <div className="max-w-4xl mx-auto space-y-5">

            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-[#002147] via-[#002d63] to-[#003875] rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h1 className="text-xl font-bold text-white mb-1">Your Coaching Sessions</h1>
                <p className="text-white/70 text-sm">
                  Join live sessions, view recordings, and track your coaching journey.
                </p>
              </div>
            </div>

            {/* Upcoming Sessions */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
                <FaCalendar className="text-[#002147] text-sm" />
                <h2 className="font-semibold text-[#002147] text-sm">Upcoming Sessions</h2>
                {upcomingSessions.length > 0 && (
                  <span className="bg-[#002147] text-white text-[10px] font-bold px-2 py-0.5 rounded-full ml-1">
                    {upcomingSessions.length}
                  </span>
                )}
              </div>
              <div className="p-4">
                {loading ? (
                  <div className="flex items-center gap-2 py-10 text-gray-400 justify-center text-xs">
                    <FaSpinner className="animate-spin" /> Loading sessions…
                  </div>
                ) : fetchError ? (
                  <p className="text-amber-700 text-xs py-4 text-center">{fetchError}</p>
                ) : upcomingSessions.length === 0 ? (
                  <div className="py-10 text-center">
                    <FaCalendar className="text-gray-200 text-4xl mx-auto mb-3" />
                    <p className="text-gray-500 text-sm font-semibold">No sessions scheduled</p>
                    <p className="text-gray-400 text-xs mt-1 max-w-xs mx-auto leading-relaxed">
                      Your coach will add sessions here. You'll be able to join directly from this page.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {upcomingSessions.map((session) => {
                      const joinUrl = session.link || session.session_link;
                      const isCoach =
                        user &&
                        ((session.coach && session.coach.user_id === user.id) ||
                          (session.coach_id && session.coach_id === user.id));
                      return (
                        <div
                          key={session.id}
                          className="group flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-[#002147]/20 hover:bg-blue-50/30 transition-all cursor-pointer"
                          onClick={() => {
                            if (isCoach) router.push(`/coach/sessions/fullviewsession/${session.id}`);
                            else router.push(`/client/session/${session.id}`);
                          }}
                        >
                          {/* Date Block */}
                          <div className="shrink-0 w-11 h-11 rounded-xl bg-[#002147]/5 border border-[#002147]/10 flex flex-col items-center justify-center text-center">
                            <span className="text-sm font-bold text-[#002147] leading-tight">
                              {session.date?.split("-")[2] || "—"}
                            </span>
                            <span className="text-[9px] text-gray-400 uppercase leading-tight">
                              {session.date
                                ? new Date(session.date + "T00:00:00").toLocaleString("default", { month: "short" })
                                : ""}
                            </span>
                          </div>
                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-sm truncate">{session.title}</p>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              <span className="text-[11px] text-gray-400 flex items-center gap-1">
                                <FaClock className="text-[9px]" />{session.time || "Time TBD"}
                              </span>
                              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColor(session.status)}`}>
                                {session.status}
                              </span>
                            </div>
                            {session.notes && (
                              <p className="text-[11px] text-gray-400 mt-0.5 truncate">{session.notes}</p>
                            )}
                          </div>
                          {/* Actions */}
                          <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                            {joinUrl && (
                              <button
                                type="button"
                                onClick={() => window.open(joinUrl, "_blank")}
                                className="px-3 py-1.5 bg-green-500 text-white rounded-xl text-[11px] font-semibold hover:bg-green-600 transition-colors flex items-center gap-1 shadow-sm"
                              >
                                <FaExternalLinkAlt className="text-[9px]" /> Join
                              </button>
                            )}
                            <FaChevronRight className="text-gray-300 group-hover:text-[#002147] text-xs transition-colors" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* ── Live Video Section ── */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <FaVideo className="text-blue-500 text-sm" />
                  <h2 className="font-semibold text-[#002147] text-sm">Live One-on-One Video</h2>
                  {liveSession && (
                    <span className="flex items-center gap-1 text-[10px] text-green-600 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      Live
                    </span>
                  )}
                </div>
                {!liveSession ? (
                  <button
                    type="button"
                    onClick={startMeeting}
                    disabled={livekitLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-60"
                  >
                    {livekitLoading ? (
                      <><FaSpinner className="animate-spin text-[11px]" /> Connecting…</>
                    ) : (
                      <><FaVideo className="text-[11px]" /> Start Video Meeting</>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={endMeeting}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-semibold hover:bg-red-600 transition-colors shadow-sm"
                  >
                    <FaPhoneSlash className="text-[11px]" /> End Session
                  </button>
                )}
              </div>

              {/* Error message */}
              {livekitError && !liveSession && (
                <div className="mx-4 my-3 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
                  {livekitError}
                </div>
              )}

              {/* Idle state */}
              {!liveSession && !livekitLoading && !livekitError && (
                <div className="px-5 py-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
                    <FaVideo className="text-blue-400 text-xl" />
                  </div>
                  <p className="text-gray-600 text-sm font-semibold">Ready to connect?</p>
                  <p className="text-gray-400 text-xs mt-1 max-w-xs mx-auto leading-relaxed">
                    Start a live LiveKit video meeting with your coach. Camera and microphone access required.
                  </p>
                </div>
              )}

              {/* Loading state before LiveKitRoom mounts */}
              {livekitLoading && (
                <div className="px-5 py-10 text-center">
                  <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-gray-600 text-sm font-medium">Requesting access token…</p>
                </div>
              )}

              {/* LiveKit Room */}
              {liveSession && livekitToken && livekitUrl && (
                <div style={{ height: "520px" }}>
                  <LiveKitRoom
                    token={livekitToken}
                    serverUrl={livekitUrl}
                    connect={true}
                    video={true}
                    audio={true}
                    onDisconnected={endMeeting}
                    style={{ height: "100%", display: "flex", flexDirection: "column" }}
                  >
                    <VideoGrid
                      onLeave={endMeeting}
                      loading={false}
                      error=""
                      inviteEmail={inviteEmail}
                      setInviteEmail={setInviteEmail}
                      meetingLink={`${typeof window !== "undefined" ? window.location.origin : ""}/join?room=${encodeURIComponent(roomName)}`}
                      copied={copied}
                      onCopy={handleCopyLink}
                    />
                  </LiveKitRoom>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
