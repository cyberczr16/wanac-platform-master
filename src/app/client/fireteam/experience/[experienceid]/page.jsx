"use client";

import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { LiveKitRoom, useLocalParticipant } from "@livekit/components-react";
import { useDashboardMobile } from "@/contexts/DashboardMobileContext";

// Custom Hooks
import { useLivekitMeeting } from "../hooks/useLivekitMeeting";
import { useRecording } from "../hooks/useRecording";
import { useMeetingData } from "../hooks/useMeetingData";
import { useToast } from "../hooks/useToast";
import { useRoomState } from "../hooks/useRoomState";
import { extractRoomNameFromUrl } from "../../../../../lib/livekit.utils";

// UI Components
import LivekitVideoContainer from "../components/LivekitVideoContainer";
import { ToastContainer } from "../components/Toast";
import ConfirmDialog from "../components/ConfirmDialog";
import Slide from "../../components/SlideComponent";
import MeetingSummaryModal from "../../components/MeetingSummaryModal";
import Sidebar from "../../../../../../components/dashboardcomponents/sidebar.jsx";
import AdminSidebar from "../../../../../../components/dashboardcomponents/adminsidebar";

/* ─────────────────────────────────────────────────────────────────────────────
   SVG Icons
   ───────────────────────────────────────────────────────────────────────────── */

function DiamondIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      className="text-gray-400 flex-shrink-0">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function PhoneOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.42 19.42 0 0 1 4.26 9.91a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 3.17 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.14 8.91a16 16 0 0 0 3.41 2.6" />
      <line x1="23" y1="1" x2="1" y2="23" />
    </svg>
  );
}

function MicIcon({ muted }) {
  return muted ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
      <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

function CameraIcon({ off }) {
  return off ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h3a2 2 0 0 1 2 2v9.34m-7.72-2.06A4 4 0 0 1 8.28 9.72" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 7l-7 5 7 5V7z" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );
}

function AudioBarsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
      className="text-gray-400">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function RecordDotIcon() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8">
      <circle cx="4" cy="4" r="4" fill="#ef4444" />
    </svg>
  );
}

function ZoomIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="text-gray-500">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}

function SlidesIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="text-gray-500">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="text-gray-500">
      <path d="M23 7l-7 5 7 5V7z" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   LiveKit mic / camera control buttons
   Must be rendered inside a <LiveKitRoom> context.
   ───────────────────────────────────────────────────────────────────────────── */

function MicButton() {
  const { localParticipant } = useLocalParticipant();
  const enabled = localParticipant?.isMicrophoneEnabled ?? true;

  const toggle = () => {
    localParticipant?.setMicrophoneEnabled(!enabled);
  };

  return (
    <button
      onClick={toggle}
      title={enabled ? "Mute microphone" : "Unmute microphone"}
      aria-label={enabled ? "Mute microphone" : "Unmute microphone"}
      className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors focus:outline-none ${
        !enabled
          ? "border-red-200 bg-red-50 text-red-500 hover:bg-red-100"
          : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
      }`}
    >
      <MicIcon muted={!enabled} />
    </button>
  );
}

function CameraButton() {
  const { localParticipant } = useLocalParticipant();
  const enabled = localParticipant?.isCameraEnabled ?? true;

  const toggle = () => {
    localParticipant?.setCameraEnabled(!enabled);
  };

  return (
    <button
      onClick={toggle}
      title={enabled ? "Turn off camera" : "Turn on camera"}
      aria-label={enabled ? "Turn off camera" : "Turn on camera"}
      className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors focus:outline-none ${
        !enabled
          ? "border-red-200 bg-red-50 text-red-500 hover:bg-red-100"
          : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
      }`}
    >
      <CameraIcon off={!enabled} />
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Per-step countdown timer hook
   ───────────────────────────────────────────────────────────────────────────── */

function useStepTimer(durationMinutes) {
  const [secsLeft, setSecsLeft] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const mins = parseInt(durationMinutes ?? "0");
    if (!mins || isNaN(mins)) {
      setSecsLeft(null);
      return;
    }
    setSecsLeft(mins * 60);

    timerRef.current = setInterval(() => {
      setSecsLeft((prev) => {
        if (prev === null || prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [durationMinutes]);

  const formatted = useMemo(() => {
    if (secsLeft === null) return null;
    const m = Math.floor(secsLeft / 60);
    const s = secsLeft % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }, [secsLeft]);

  const pct = useMemo(() => {
    const total = parseInt(durationMinutes ?? "0") * 60;
    if (!total || secsLeft === null) return 0;
    return Math.max(0, Math.min(100, ((total - secsLeft) / total) * 100));
  }, [secsLeft, durationMinutes]);

  return { formatted, secsLeft, pct };
}

/* ─────────────────────────────────────────────────────────────────────────────
   Main Page
   ───────────────────────────────────────────────────────────────────────────── */

export default function FireteamExperienceMeeting() {
  const sessionProcessedRef = useRef(false);
  const mobileCtx = useDashboardMobile();

  // ============================================================================
  // STATE & HOOKS
  // ============================================================================

  const searchParams = useSearchParams();
  const router = useRouter();
  const isAdmin = searchParams?.get("admin") === "true";
  const [wanacUser, setWanacUser] = useState(null);

  // UI State  (currentStep is now derived from useRoomState — see below)
  const [showSlide, setShowSlide] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [activeTab, setActiveTab] = useState("agenda");
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [processingSession, setProcessingSession] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [wasRecording, setWasRecording] = useState(false);
  const [autoStartedRecording, setAutoStartedRecording] = useState(false);

  // Toast notifications
  const toast = useToast();

  // Meeting data + breakout learning structure
  const {
    experience,
    fireteam,
    agenda,
    exhibits,
    loading: dataLoading,
    calculateTotalTime,
  } = useMeetingData(searchParams);

  // Load user from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("wanacUser");
      if (!raw) return;
      setWanacUser(JSON.parse(raw));
    } catch {
      setWanacUser(null);
    }
  }, []);

  const currentUserId = useMemo(() => {
    const u = wanacUser;
    if (!u || typeof u !== "object") return null;
    return u.id ?? u.user?.id ?? u.client?.user?.id ?? null;
  }, [wanacUser]);

  const leaderUserId = useMemo(() => {
    const id = experience?.admin ?? experience?.videoAdminId ?? null;
    if (id == null) return null;
    const n = Number(id);
    return Number.isFinite(n) ? n : id;
  }, [experience]);

  const canNavigate = useMemo(() => {
    if (leaderUserId == null) return true;
    if (currentUserId == null) return false;
    return String(currentUserId) === String(leaderUserId);
  }, [currentUserId, leaderUserId]);

  // ── LiveKit meeting connection ─────────────────────────────────────────────
  const {
    roomRef,
    livekitReady,
    participants,
    chatMessages,
    sendChatMessage,
    meetingStartTime,
    attendanceLog,
    loading: meetingLoading,
    error: meetingError,
    initializeMeeting,
    leaveMeeting,
  } = useLivekitMeeting();

  // ── Real-time room state (slide sync via LiveKit DataChannel) ──────────────
  // useRoomState broadcasts slide changes to every participant in the LiveKit room.
  // When the group leader calls advanceSlide(n), all other participants instantly
  // receive a FIRETEAM_SLIDE_CHANGE data message and update their view.
  const {
    activeSlide: currentStep,   // Rename so the rest of the file is unchanged
    isGroupLeader,
    advanceSlide,
    changeExhibit,
    activeExhibitId,
  } = useRoomState({
    roomRef,
    livekitReady,
    currentUserId,
    leaderUserId,
    initialSlide: 0,
  });

  // Per-step countdown timer (must come after useRoomState so currentStep is defined)
  const currentDuration = agenda[currentStep]?.duration;
  const { formatted: stepTimer, pct: stepPct } = useStepTimer(currentDuration);

  // When activeSlide changes (from remote or local), reveal the slide panel
  useEffect(() => {
    setShowSlide(true);
    // Auto-switch sidebar to exhibits on discussion slides (slideType 6)
    const slideType = agenda[currentStep]?.breakout?.slideType;
    if (slideType === 6 && exhibits?.length > 0) {
      setActiveTab("exhibits");
    }
  }, [currentStep, agenda, exhibits]);

  const livekitRoom = roomRef.current;

  const {
    isRecording,
    recordingBlob,
    processingRecording,
    meetingSummaries,
    toggleRecording,
    processRecording,
  } = useRecording(roomRef, livekitReady);

  // ============================================================================
  // MEETING INITIALIZATION
  // ============================================================================

  useEffect(() => {
    // Wait for experience data so we can use the stored meeting link.
    // This prevents users from ending up in different LiveKit rooms when
    // the ?link= query parameter is missing from their URL.
    if (dataLoading) return;

    const expId = searchParams?.get("id");
    const ftId = searchParams?.get("fireteamId");
    const linkParam = searchParams?.get("link");

    async function init() {
      try {
        setShowSummaryModal(false);

        // Resolve the room name — prefer the URL param, then the DB-stored
        // link on the experience, then a deterministic fallback.
        let meetingLink = null;
        if (linkParam) {
          meetingLink = decodeURIComponent(linkParam);
        } else if (experience?.link) {
          meetingLink = experience.link;
        } else if (expId) {
          meetingLink = `wanac-ft-exp-${expId}`;
        } else if (ftId) {
          meetingLink = `wanac-ft-${ftId}`;
        } else {
          meetingLink = `wanac-ft-default-${Date.now()}`;
        }

        // Support both plain stored room names and legacy URL-style links.
        const roomName = extractRoomNameFromUrl(meetingLink);
        if (!roomName) {
          throw new Error("Invalid meeting link format");
        }

        // Build a unique identity for this participant so LiveKit can
        // distinguish every user in the room (fixes duplicate-identity bug).
        let userId = 'anonymous';
        let userName = 'Participant';
        try {
          const raw = localStorage.getItem('wanacUser');
          if (raw) {
            const u = JSON.parse(raw);
            userId  = String(u.id ?? u.user?.id ?? u.client?.user?.id ?? `anon-${Date.now()}`);
            userName = u.name ?? u.user?.name ?? u.client?.user?.name ?? 'Participant';
          } else {
            // No stored user — generate a random id so each tab is unique
            userId = `anon-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
          }
        } catch { /* keep defaults */ }

        setShowSlide(false);
        await new Promise((resolve) => setTimeout(resolve, 300));
        await initializeMeeting("", roomName, { userId, userName });
      } catch (err) {
        console.error("❌ Meeting initialization error:", err);
      }
    }

    init();
    return () => { leaveMeeting(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataLoading, experience?.link, searchParams?.get("id"), searchParams?.get("fireteamId"), searchParams?.get("link")]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleNext = useCallback(() => {
    if (currentStep < agenda.length - 1 && canNavigate) {
      advanceSlide(currentStep + 1);
    }
  }, [currentStep, agenda.length, canNavigate, advanceSlide]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0 && canNavigate) {
      advanceSlide(currentStep - 1);
    }
  }, [currentStep, canNavigate, advanceSlide]);

  const handleToggleRecording = useCallback(async () => {
    try {
      await toggleRecording();
      if (!isRecording) setWasRecording(true);
      toast.success(isRecording ? "Recording stopped" : "Recording started");
    } catch (err) {
      toast.error(err.message || "Failed to toggle recording");
    }
  }, [toggleRecording, isRecording, toast]);

  const handleProcessRecording = useCallback(async () => {
    try {
      const userId = localStorage.getItem("user_id") || "unknown";
      const userName = localStorage.getItem("user_name") || "Participant";
      const meetingData = {
        experienceTitle: experience?.title || "Fireteam Experience",
        experienceDescription: experience?.description || experience?.experience || "",
        agenda: agenda.filter((a) => !a.isWaitingRoom).map((a) => ({ title: a.title, duration: a.duration })),
        participants: participants.map((p) => ({ id: p.id, name: p.name })),
        duration: calculateTotalTime(),
        userId,
        userName,
        attendanceLog,
        startTime: meetingStartTime ? meetingStartTime.toISOString() : new Date().toISOString(),
      };
      toast.info("Processing recording... This may take a minute.");
      const result = await processRecording(meetingData, searchParams);
      toast.success("AI summary generated successfully!");
      return result;
    } catch (err) {
      toast.error(err.message || "Failed to process recording");
    }
  }, [experience, agenda, participants, calculateTotalTime, attendanceLog, meetingStartTime, processRecording, searchParams, toast]);

  const handleLeaveMeeting = useCallback(async () => {
    if (isRecording) {
      await handleToggleRecording();
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    if (recordingBlob && !processingRecording) {
      setShowConfirmDialog(true);
      return;
    }
    if (wasRecording) {
      setShowConfirmDialog(true);
      return;
    }
    leaveMeeting();
    router.push("/client/fireteam");
  }, [isRecording, recordingBlob, processingRecording, wasRecording, handleToggleRecording, leaveMeeting, router]);

  const handleConfirmProcessRecording = useCallback(async () => {
    setShowConfirmDialog(false);
    const result = await handleProcessRecording();
    leaveMeeting();
    const expId = searchParams?.get("id");
    const ftId = searchParams?.get("fireteamId");
    const recordingId = result?.recordingId || "unknown";
    window.location.href = `/client/fireteam/experience/${expId}/evaluation?fireteamId=${ftId}&recordingId=${recordingId}&hasAI=true`;
  }, [handleProcessRecording, leaveMeeting, searchParams]);

  const handleCancelProcessRecording = useCallback(() => {
    setShowConfirmDialog(false);
    leaveMeeting();
    const expId = searchParams?.get("id");
    const ftId = searchParams?.get("fireteamId");
    router.push(`/client/fireteam/experience/${expId}/evaluation?fireteamId=${ftId}&hasAI=false`);
  }, [leaveMeeting, searchParams, router]);

  // ============================================================================
  // AUTOMATIC RECORDING
  // ============================================================================

  useEffect(() => {
    if (
      agenda[currentStep]?.title === "Learning Objectives" &&
      !isRecording &&
      livekitReady &&
      !autoStartedRecording
    ) {
      setAutoStartedRecording(true);
      setWasRecording(true);
      handleToggleRecording().catch(() => toast.error("Failed to start recording automatically"));
    }
  }, [currentStep, agenda, isRecording, livekitReady, handleToggleRecording, toast, autoStartedRecording]);

  useEffect(() => {
    let cancelled = false;

    async function processSession() {
      if (sessionProcessedRef.current) return;
      sessionProcessedRef.current = true;
      setProcessingSession(true);
      try {
        if (isRecording) {
          await handleToggleRecording();
          let waitCount = 0;
          while (!recordingBlob && waitCount < 20 && !cancelled) {
            await new Promise((resolve) => setTimeout(resolve, 250));
            waitCount++;
          }
        }
        await new Promise((resolve) => setTimeout(resolve, 500));
        if ((wasRecording || recordingBlob) && !cancelled) {
          const result = await handleProcessRecording();
          if (result && !cancelled) toast.success("AI summary generated successfully!");
        } else if (!cancelled) {
          toast.info("No recording available to process");
        }
      } catch (err) {
        if (!cancelled) toast.error("Failed to generate AI summary: " + (err.message || "Unknown error"));
      } finally {
        if (!cancelled) setProcessingSession(false);
      }
    }

    if (
      (agenda[currentStep]?.title === "Session Processing" || agenda[currentStep]?.isProcessing) &&
      !sessionProcessedRef.current
    ) {
      processSession();
    }

    return () => { cancelled = true; };
  }, [currentStep, agenda, isRecording, wasRecording, recordingBlob, handleToggleRecording, handleProcessRecording, toast]);

  // ============================================================================
  // DERIVED VALUES
  // ============================================================================

  const currentStepTitle = agenda[currentStep]?.title ?? "";

  const instructionText = useMemo(() => {
    const t = currentStepTitle.toLowerCase();
    if (!t) return "Watch and Listen";
    if (t.includes("welcome") || t.includes("waiting")) return "Welcome";
    if (t.includes("discussion")) return "Read below, discuss with your group, and then advance to the next slide...";
    if (t.includes("session processing")) return "Session Processing";
    if (t.includes("ai-generated results") || t.includes("session results")) return "Review your session results";
    return "Watch and Listen";
  }, [currentStepTitle]);

  // Overall session progress (0–100)
  const sessionProgress = useMemo(() => {
    if (!agenda.length) return 0;
    return Math.round((currentStep / (agenda.length - 1)) * 100);
  }, [currentStep, agenda.length]);

  // Total remaining minutes
  const totalMinsLeft = useMemo(() => {
    const total = agenda.slice(currentStep).reduce((acc, s) => {
      const d = parseInt(s.duration ?? "0");
      return acc + (isNaN(d) ? 0 : d);
    }, 0);
    return total;
  }, [agenda, currentStep]);

  // True only when the agenda item itself is a waiting room step
  const isWaitingRoom = useMemo(() =>
    agenda[currentStep]?.isWaitingRoom ||
    currentStepTitle.toLowerCase() === "waiting room",
    [agenda, currentStep, currentStepTitle]
  );

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="h-screen flex bg-[#f5f5f5] overflow-hidden">

      {/* ── Sidebar ── */}
      {isAdmin
        ? <AdminSidebar />
        : <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      }

      {/* ── Meeting canvas ── */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden bg-white m-3 rounded-2xl shadow-sm">

        {/* Overlays */}
        <ToastContainer toasts={toast.toasts} onRemoveToast={toast.removeToast} />

        {showConfirmDialog && (
          <ConfirmDialog
            title="Generate AI Summary?"
            message="Would you like to generate an AI summary of this meeting? This may take a minute."
            confirmText="Generate Summary"
            cancelText="Skip"
            onConfirm={handleConfirmProcessRecording}
            onCancel={handleCancelProcessRecording}
          />
        )}

        {/* ── Progress bar (top of canvas) ── */}
        <div className="h-0.5 w-full bg-gray-100 flex-shrink-0">
          <div
            className="h-full bg-gray-800 transition-all duration-500"
            style={{ width: `${sessionProgress}%` }}
          />
        </div>

        {/* ── TOP BAR ── */}
        <header className="flex-shrink-0 bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between gap-4">

          {/* Left: diamond + slide title · instruction */}
          <div className="flex items-center gap-2.5 min-w-0">
            <DiamondIcon />
            <div className="flex items-center gap-1.5 min-w-0">
              {currentStepTitle && (
                <>
                  <span className="text-sm font-bold text-gray-900 whitespace-nowrap">
                    {currentStepTitle}
                  </span>
                  <span className="text-gray-300 text-sm">·</span>
                </>
              )}
              <span className="text-sm text-gray-500 truncate">{instructionText}</span>
            </div>
          </div>

          {/* Center: step counter */}
          <span className="text-xs font-semibold text-gray-400 flex-shrink-0 tabular-nums">
            {currentStep + 1} / {agenda.length || 1}
          </span>

          {/* Right: Prev + Next Slide */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {currentStep > 0 && (
              <button
                onClick={handlePrevious}
                disabled={!canNavigate}
                className="text-sm px-4 py-1.5 rounded-full border border-gray-200 text-gray-600
                           hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-medium"
              >
                ‹ Prev
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!canNavigate || currentStep >= agenda.length - 1}
              className="text-sm px-5 py-1.5 rounded-full bg-gray-900 text-white font-semibold
                         hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next Slide ›
            </button>
          </div>
        </header>

        {/* ── BODY ── */}
        <div className="flex-1 min-h-0 flex overflow-hidden">

          {/* ── LEFT: content area ── */}
          <div className="flex-1 min-w-0 bg-[#f5f5f5] flex flex-col relative">

            {/* Step-level progress bar */}
            {stepPct > 0 && (
              <div className="h-0.5 w-full bg-gray-200 flex-shrink-0">
                <div
                  className="h-full bg-blue-400 transition-all duration-1000"
                  style={{ width: `${stepPct}%` }}
                />
              </div>
            )}

            {/* Main content — video always mounts so the camera stays active */}
            <div className="flex-1 min-h-0 p-5 flex items-center justify-center relative">

              {/* ── Slide view ── */}
              {showSlide && (
                <div className="relative w-full h-full flex items-center justify-center"
                  role="region"
                  aria-label={`Slide ${currentStep + 1}: ${currentStepTitle}`}>
                  <div className="w-full h-full max-w-4xl">
                    <Slide
                      step={agenda[currentStep]}
                      participants={participants}
                      experienceTitle={experience?.title || ""}
                      onRatingSubmit={(stars) => {
                        // POST rating to API (wired in Gap 6)
                        const expId = searchParams?.get("id");
                        const userId = currentUserId;
                        if (expId && userId) {
                          fetch(`/api/v1/fireteams/experience/${expId}/rating`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ stars, userId }),
                          }).catch(() => {});
                        }
                      }}
                      allSteps={agenda}
                      currentStepIndex={currentStep}
                    />
                  </div>
                  <button
                    className="absolute bottom-3 right-3 w-8 h-8 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    title="Zoom slide"
                  >
                    <ZoomIcon />
                  </button>
                </div>
              )}

              {/* ── Video view (always rendered so camera stays live) ── */}
              <div className={`w-full h-full flex items-center justify-center ${showSlide ? "hidden" : ""}`}>
                {livekitRoom ? (
                  <LiveKitRoom
                    room={livekitRoom}
                    data-lk-theme="default"
                    style={{ width: "100%", height: "100%" }}
                  >
                    <LivekitVideoContainer
                      showSlide={showSlide}
                      loading={meetingLoading}
                      error={meetingError}
                    />
                  </LiveKitRoom>
                ) : (
                  <div className="w-full h-full rounded-2xl bg-gray-900 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400" />
                      <p className="text-white text-sm">Connecting to session…</p>
                      <p className="text-gray-400 text-xs">This should only take a moment</p>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Waiting room overlay (only on the actual waiting room step) ── */}
              {isWaitingRoom && !showSlide && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg px-8 py-6 flex flex-col items-center gap-3 text-center max-w-xs">
                    <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">Waiting for others to join…</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {participants.length > 0
                          ? `${participants.length} participant${participants.length !== 1 ? "s" : ""} in the room`
                          : "You'll start automatically when your group is here"}
                      </p>
                    </div>
                    {participants.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap justify-center">
                        {participants.slice(0, 4).map((p, i) => (
                          <div key={i} className="flex items-center gap-1 bg-white border border-gray-100 rounded-full px-2 py-0.5 shadow-sm">
                            <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-[9px] font-bold text-blue-500">
                              {(p.name ?? "?")[0].toUpperCase()}
                            </div>
                            <span className="text-[11px] text-gray-600 font-medium">{p.name ?? "Participant"}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Toggle pill — top-right corner of content */}
              <button
                onClick={() => setShowSlide(!showSlide)}
                className="absolute top-3 right-3 flex items-center gap-1.5 text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-full text-gray-600 font-medium hover:bg-gray-50 transition-colors shadow-sm"
              >
                {showSlide ? <><VideoIcon /> Video</> : <><SlidesIcon /> Slides</>}
              </button>

            </div>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <aside className="w-72 flex-shrink-0 bg-white border-l border-gray-100 flex flex-col overflow-hidden">

            {/* Tab switcher */}
            <div className="flex-shrink-0 flex border-b border-gray-100">
              <button
                onClick={() => setActiveTab("exhibits")}
                className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${
                  activeTab === "exhibits"
                    ? "text-gray-900 border-b-2 border-gray-900"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Exhibits
              </button>
              <button
                onClick={() => setActiveTab("agenda")}
                className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${
                  activeTab === "agenda"
                    ? "text-gray-900 border-b-2 border-gray-900"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Agenda
              </button>
            </div>

            {/* ── AGENDA TAB ── */}
            {activeTab === "agenda" && (
              <>
                {/* Experience header */}
                <div className="flex-shrink-0 px-5 pt-5 pb-4 border-b border-gray-100">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-base font-black text-blue-500 border border-blue-100">
                      {(experience?.title ?? "F")[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-gray-900 leading-tight">
                        {experience?.title || "Fireteam Experience"}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">
                        {experience?.description || experience?.experience ||
                          "In this module, you will explore key concepts and engage with your fireteam."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Vertical timeline */}
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  <div className="relative">
                    {/* Background line (full height) */}
                    {agenda.length > 1 && (
                      <div className="absolute left-[6px] top-3 bottom-3 w-px bg-gray-100" />
                    )}
                    {/* Filled progress line */}
                    {agenda.length > 1 && currentStep > 0 && (
                      <div
                        className="absolute left-[6px] top-3 w-px bg-gray-800 transition-all duration-500"
                        style={{
                          height: `${(currentStep / (agenda.length - 1)) * 100}%`,
                        }}
                      />
                    )}

                    <div className="space-y-0.5">
                      {agenda.map((step, idx) => {
                        const isCompleted = idx < currentStep;
                        const isCurrent = idx === currentStep;

                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              if (!canNavigate) return;
                              advanceSlide(idx);
                            }}
                            disabled={!canNavigate}
                            className={`relative w-full flex items-start gap-3 py-2 text-left rounded-lg px-1 transition-colors
                              ${canNavigate ? "hover:bg-gray-50 cursor-pointer" : "cursor-default"}
                              ${isCurrent ? "bg-gray-50" : ""}`}
                          >
                            {/* Circle indicator */}
                            <div className="flex-shrink-0 mt-0.5 z-10">
                              {isCompleted ? (
                                <div className="w-3.5 h-3.5 rounded-full bg-gray-800 flex items-center justify-center">
                                  <svg width="7" height="7" viewBox="0 0 10 10" fill="none">
                                    <polyline points="1.5 5 4 7.5 8.5 2.5" stroke="white" strokeWidth="1.8"
                                      strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </div>
                              ) : isCurrent ? (
                                <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-900 bg-white flex items-center justify-center">
                                  <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                                </div>
                              ) : (
                                <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-200 bg-white" />
                              )}
                            </div>

                            {/* Step info */}
                            <div className="flex-1 min-w-0 flex items-baseline justify-between gap-2">
                              <p className={`text-xs leading-snug ${
                                isCurrent ? "font-semibold text-gray-900" :
                                isCompleted ? "text-gray-400" :
                                "text-gray-500"
                              }`}>
                                {step.title}
                              </p>
                              {step.duration && (
                                <span className="text-[10px] text-gray-300 flex-shrink-0 font-medium tabular-nums">
                                  {step.duration}
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Time Left In Session */}
                <div className="flex-shrink-0 border-t border-gray-100 px-5 py-4 flex items-end justify-between">
                  <div>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      Time Left In Session
                    </p>
                    <p className="text-2xl font-black text-gray-900 leading-none tabular-nums">
                      {totalMinsLeft}{" "}
                      <span className="text-sm font-semibold text-gray-400">min</span>
                    </p>
                  </div>
                  {/* Per-step countdown */}
                  {stepTimer && (
                    <div className="text-right">
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                        This Slide
                      </p>
                      <p className="text-lg font-bold text-gray-700 tabular-nums leading-none">
                        {stepTimer}
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ── EXHIBITS TAB ── */}
            {activeTab === "exhibits" && (
              <div className="flex-1 overflow-y-auto px-4 py-4">
                {exhibits && exhibits.length > 0 ? (
                  <div className="space-y-3">
                    {/* Leader hint */}
                    {isGroupLeader && (
                      <p className="text-[10px] text-gray-400 text-center mb-1">
                        Tap an exhibit to show it to everyone
                      </p>
                    )}
                    {exhibits.map((exhibit, idx) => {
                      const exhibitId = exhibit.id ?? idx;
                      const isActive  = String(activeExhibitId) === String(exhibitId);
                      return (
                      <div
                        key={exhibitId}
                        onClick={() => isGroupLeader && changeExhibit(exhibitId)}
                        className={`rounded-xl border overflow-hidden transition-all
                          ${isGroupLeader ? "cursor-pointer hover:shadow-sm" : "cursor-default"}
                          ${isActive
                            ? "border-[#E87722] ring-2 ring-[#E87722]/30 bg-orange-50"
                            : "border-gray-100 bg-gray-50 hover:border-gray-200"
                          }`}
                      >
                        {exhibit.imageUrl || exhibit.exhibitURL ? (
                          <img
                            src={exhibit.imageUrl || exhibit.exhibitURL}
                            alt={exhibit.title ?? exhibit.exhibitAltText ?? `Exhibit ${idx + 1}`}
                            className="w-full h-32 object-cover"
                          />
                        ) : (
                          <div className="w-full h-28 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                            <span className="text-4xl font-black text-blue-100">{idx + 1}</span>
                          </div>
                        )}
                        <div className="px-3 py-2.5">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-semibold text-gray-700 truncate flex-1">
                              {exhibit.title ?? exhibit.exhibitCaption ?? `Exhibit ${idx + 1}`}
                            </p>
                            {isActive && (
                              <span className="text-[9px] font-bold text-[#E87722] bg-orange-100 px-1.5 py-0.5 rounded-full flex-shrink-0">
                                LIVE
                              </span>
                            )}
                          </div>
                          {(exhibit.description || exhibit.exhibitCaption) && (
                            <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">
                              {exhibit.description || exhibit.exhibitCaption}
                            </p>
                          )}
                        </div>
                      </div>
                    )})}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center py-10">
                    <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-3">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="1.5" className="text-gray-300">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-gray-400">No exhibits yet</p>
                    <p className="text-xs text-gray-300 mt-1">Exhibits will appear here when added</p>
                  </div>
                )}
              </div>
            )}

          </aside>
        </div>

        {/* ── BOTTOM BAR ── */}
        <footer className="flex-shrink-0 bg-white border-t border-gray-100 px-6 py-3 flex items-center justify-between">

          {/* Left: Hang up */}
          <button
            onClick={handleLeaveMeeting}
            className="w-11 h-11 rounded-full bg-red-500 hover:bg-red-600 active:bg-red-700 flex items-center justify-center transition-colors shadow-sm"
            title="Leave session"
            aria-label="Leave session"
          >
            <PhoneOffIcon />
          </button>

          {/* Center: recording pill */}
          <button
            onClick={handleToggleRecording}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors ${
              isRecording
                ? "border-red-200 bg-red-50 text-red-500 hover:bg-red-100"
                : "border-gray-200 bg-gray-50 text-gray-400 hover:bg-gray-100"
            }`}
            title={isRecording ? "Stop recording" : "Start recording"}
          >
            <RecordDotIcon />
            {isRecording ? "Recording" : "Record"}
          </button>

          {/* Right: Mic + Camera + audio bars */}
          <div className="flex items-center gap-2">
            {livekitRoom && livekitReady ? (
              <LiveKitRoom room={livekitRoom} data-lk-theme="default">
                <MicButton />
                <CameraButton />
              </LiveKitRoom>
            ) : (
              <>
                <div className="w-9 h-9 rounded-full border border-gray-100 bg-gray-50 flex items-center justify-center text-gray-300">
                  <MicIcon muted={false} />
                </div>
                <div className="w-9 h-9 rounded-full border border-gray-100 bg-gray-50 flex items-center justify-center text-gray-300">
                  <CameraIcon off={false} />
                </div>
              </>
            )}
            <AudioBarsIcon />
          </div>
        </footer>

        {/* Meeting Summary Modal */}
        {showSummaryModal && meetingSummaries && (
          <MeetingSummaryModal
            summaries={meetingSummaries}
            onClose={() => setShowSummaryModal(false)}
            userRole={isAdmin ? "admin" : "participant"}
          />
        )}

      </div>
    </div>
  );
}
