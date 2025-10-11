"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

// Custom Hooks
import { useJitsiMeeting } from "../hooks/useJitsiMeeting";
import { useRecording } from "../hooks/useRecording";
import { useMeetingData } from "../hooks/useMeetingData";

// UI Components
import MeetingTopBar from "../components/MeetingTopBar";
import JitsiVideoContainer from "../components/JitsiVideoContainer";
import MeetingFooter from "../components/MeetingFooter";
import ProcessingOverlay from "../components/ProcessingOverlay";

// Existing Components
import EnhancedAgendaSidebar from "../../components/EnhancedAgendaSidebar";
import Slide from "../../components/SlideComponent";
import EnhancedMeetingControls from "../../components/EnhancedMeetingControls";
import AgendaTimer from "../../components/AgendaTimer";
import Sidebar from "../../../../../../components/dashboardcomponents/sidebar.jsx";
import AdminSidebar from "../../../../../../components/dashboardcomponents/adminsidebar";
import MeetingSummaryModal from "../../components/MeetingSummaryModal";

export default function FireteamExperienceMeeting() {
  // ============================================================================
  // STATE & HOOKS
  // ============================================================================

  const searchParams = useSearchParams();
  const isAdmin = searchParams?.get("admin") === "true";

  // UI State
  const [currentStep, setCurrentStep] = useState(0);
  const [showSlide, setShowSlide] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [jitsiContainerId] = useState(
    () => `jitsi-container-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  );

  // Custom Hooks
  const {
    experience,
    fireteam,
    agenda,
    exhibits,
    loading: dataLoading,
    calculateTotalTime,
  } = useMeetingData(searchParams);

  const {
    jitsiApiRef,
    jitsiReady,
    participants,
    meetingStartTime,
    attendanceLog,
    loading: jitsiLoading,
    error: jitsiError,
    initializeMeeting,
    leaveMeeting,
  } = useJitsiMeeting(jitsiContainerId);

  const {
    isRecording,
    recordingBlob,
    processingRecording,
    meetingSummaries,
    toggleRecording,
    processRecording,
    setMeetingSummaries,
  } = useRecording(jitsiApiRef, jitsiReady);

  // ============================================================================
  // MEETING INITIALIZATION
  // ============================================================================

  useEffect(() => {
    const expId = searchParams?.get("id");
    const ftId = searchParams?.get("fireteamId");
    const linkParam = searchParams?.get("link");

    console.log("🔄 Experience changed - Experience ID:", expId, "Fireteam ID:", ftId);

    async function init() {
      try {
        // First, dispose of any existing Jitsi instance
        if (jitsiApiRef.current) {
          console.log("🧹 Cleaning up previous Jitsi instance...");
          try {
            jitsiApiRef.current.dispose();
            jitsiApiRef.current = null;
          } catch (err) {
            console.warn("⚠️ Error disposing Jitsi instance:", err);
          }
        }

        // Reset state for new experience
        setChatMessages([]);
        setCurrentStep(0);
        setShowSummaryModal(false);

        let meetingLink = null;

        if (linkParam) {
          meetingLink = decodeURIComponent(linkParam);
          console.log("✅ Using link from URL params for experience", expId, ":", meetingLink);
        } else if (expId) {
          meetingLink = `https://meet.jit.si/fireteam-exp-${expId}`;
          console.log("🆕 Generated meeting link for experience", expId, ":", meetingLink);
        } else if (ftId) {
          meetingLink = `https://meet.jit.si/fireteam-${ftId}`;
          console.log("🆕 Generated meeting link for fireteam", ftId, ":", meetingLink);
        } else {
          meetingLink = `https://meet.jit.si/fireteam-default-${Date.now()}`;
          console.log("🆕 Using fallback meeting link:", meetingLink);
        }

        // Parse meeting URL
        const urlObj = new URL(meetingLink);
        const domain = urlObj.hostname;
        const parts = urlObj.pathname.split("/").filter(Boolean);
        const roomName = parts[parts.length - 1] || "";

        console.log("🔍 Parsed for experience", expId, "- Domain:", domain, "Room:", roomName);

        // Show video view to ensure container is rendered
        setShowSlide(false);

        // Initialize Jitsi meeting with a small delay to ensure cleanup is complete
        await new Promise(resolve => setTimeout(resolve, 300));
        await initializeMeeting(domain, roomName);
      } catch (err) {
        console.error("❌ Meeting initialization error:", err);
      }
    }

    init();

    // Cleanup function to dispose Jitsi when component unmounts or experience changes
    return () => {
      if (jitsiApiRef.current) {
        console.log("🧹 Cleaning up Jitsi on unmount/experience change...");
        try {
          jitsiApiRef.current.dispose();
          jitsiApiRef.current = null;
        } catch (err) {
          console.warn("⚠️ Error disposing Jitsi instance:", err);
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams?.get("id"), searchParams?.get("fireteamId"), searchParams?.get("link")]);

  // ============================================================================
  // VISIBILITY TOGGLE (Slide vs Video)
  // ============================================================================

  useEffect(() => {
    console.log("🔄 View mode changed:", showSlide ? "SLIDES" : "VIDEO");

    const container = document.getElementById(jitsiContainerId);
    if (container && jitsiApiRef.current) {
      if (showSlide) {
        console.log("📋 Switching to slides - Jitsi continues in background");
        container.style.visibility = "hidden";
        container.style.position = "absolute";
        container.style.opacity = "0";
        container.style.pointerEvents = "none";
      } else {
        console.log("📹 Switching to video - Jitsi becomes visible");
        container.style.visibility = "visible";
        container.style.position = "relative";
        container.style.opacity = "1";
        container.style.pointerEvents = "auto";
      }
    }
  }, [showSlide, jitsiContainerId, jitsiApiRef]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleNext = () => {
    if (currentStep < agenda.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSendChatMessage = (message) => {
    const newMessage = {
      id: Date.now(),
      sender: "You",
      text: message,
      timestamp: new Date().toISOString(),
      isOwn: true,
    };
    setChatMessages((prev) => [...prev, newMessage]);
  };

  const handleToggleRecording = async () => {
    try {
      await toggleRecording();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleProcessRecording = async () => {
    try {
      const userId = localStorage.getItem("user_id") || "unknown";
      const userName = localStorage.getItem("user_name") || "Participant";

      const meetingData = {
        experienceTitle: experience?.title || "Fireteam Experience",
        experienceDescription: experience?.description || experience?.experience || "",
        agenda: agenda
          .filter((a) => !a.isWaitingRoom)
          .map((a) => ({
            title: a.title,
            duration: a.duration,
          })),
        participants: participants.map((p) => ({
          id: p.id,
          name: p.name,
        })),
        duration: calculateTotalTime(),
        userId,
        userName,
        attendanceLog,
        startTime: meetingStartTime ? meetingStartTime.toISOString() : new Date().toISOString(),
      };

      const summaries = await processRecording(meetingData, searchParams);
      setShowSummaryModal(true);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLeaveMeeting = async () => {
    // Stop recording if active
    if (isRecording) {
      await handleToggleRecording();
    }

    // Prompt to process recording if available
    if (recordingBlob && !processingRecording) {
      const shouldProcess = window.confirm(
        "Would you like to generate an AI summary of this meeting? This may take a minute."
      );

      if (shouldProcess) {
        await handleProcessRecording();
      }
    }

    // Leave meeting
    leaveMeeting();

    // Redirect to fireteam page
    window.location.href = "/client/fireteam";
  };

  const handleTimerComplete = () => {
    console.log("⏰ Timer completed for step:", currentStep);
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar - Admin or Regular */}
      {isAdmin ? (
        <AdminSidebar />
      ) : (
        <Sidebar
          className="w-56 bg-white border-r border-gray-200"
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      )}

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col h-full transition-all duration-300 ${
          isAdmin ? "ml-16 md:ml-56" : ""
        }`}
      >
        {/* Top Bar */}
        <MeetingTopBar
          isAdmin={isAdmin}
          experienceTitle={experience?.title}
          currentStep={currentStep}
          totalSteps={agenda.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />

        <div className="flex flex-1 overflow-hidden">
          {/* Agenda Timer - Fixed position */}
          <div className="absolute top-20 left-8 z-10">
            <AgendaTimer
              duration={agenda[currentStep]?.duration}
              isActive={true}
              onTimeUp={handleTimerComplete}
              stepTitle={agenda[currentStep]?.title || "Current Step"}
            />
          </div>

          {/* Middle content area */}
          <section className="flex-1 flex flex-col justify-center items-center p-8 relative bg-gray-100">
            {/* Jitsi Video Container */}
            <JitsiVideoContainer
              jitsiContainerId={jitsiContainerId}
              showSlide={showSlide}
              loading={jitsiLoading}
              error={jitsiError}
            />

            {/* Slide content */}
            {showSlide && (
              <div className="w-full h-full flex items-center justify-center p-8">
                <Slide
                  step={agenda[currentStep]}
                  participants={participants}
                  experienceTitle={experience?.title || ""}
                />
              </div>
            )}

            {/* Meeting Controls */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-full">
              <EnhancedMeetingControls
                jitsiApiRef={jitsiApiRef}
                jitsiReady={jitsiReady}
                isRecording={isRecording}
                onToggleRecording={handleToggleRecording}
                currentLayout={showSlide ? "slide" : "grid"}
                onLeave={handleLeaveMeeting}
                onLogout={() => {
                  if (jitsiApiRef.current) {
                    try {
                      jitsiApiRef.current.dispose();
                      jitsiApiRef.current = null;
                    } catch (err) {
                      console.error("Failed to dispose Jitsi:", err);
                    }
                  }
                  window.location.href = "/login";
                }}
                isManager={true}
                onToggleLayout={() => setShowSlide((v) => !v)}
              />
            </div>
          </section>

          {/* Enhanced Agenda Sidebar */}
          <EnhancedAgendaSidebar
            agenda={agenda.map(({ title, duration }) => [title, duration])}
            moduleTitle={experience?.title || "Customer Discovery"}
            moduleDescription={
              experience?.description ||
              experience?.experience ||
              "In this module, you will explore key concepts and engage with your fireteam."
            }
            currentStep={currentStep}
            onStepClick={setCurrentStep}
            peers={participants}
            exhibits={exhibits}
            chatMessages={chatMessages}
            onSendMessage={handleSendChatMessage}
          />
        </div>

        {/* Footer */}
        <MeetingFooter
          currentStep={currentStep}
          agenda={agenda}
          totalTime={calculateTotalTime()}
        />
      </div>

      {/* Meeting Summary Modal */}
      {showSummaryModal && meetingSummaries && (
        <MeetingSummaryModal
          summaries={meetingSummaries}
          onClose={() => setShowSummaryModal(false)}
          userRole={isAdmin ? "admin" : "participant"}
        />
      )}

      {/* Processing Overlay */}
      <ProcessingOverlay isProcessing={processingRecording} />
    </div>
  );
}
