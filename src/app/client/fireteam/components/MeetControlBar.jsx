import React, { useCallback } from 'react';
import { useJitsiControls } from './hooks/useJitsiControls';
import StatusIndicator from './StatusIndicator';
import MeetingControls from './MeetingControls';

export default function MeetControlBar({ 
  onLeave, 
  onLogout, 
  isManager, 
  onToggleLayout, 
  jitsiApiRef, 
  jitsiReady = false 
}) {
  // Debug logging
  console.log('🎛️ MeetControlBar props:', {
    jitsiReady,
    isManager,
    hasJitsiApiRef: !!jitsiApiRef,
    jitsiApiExists: !!jitsiApiRef?.current,
    jitsiApiType: typeof jitsiApiRef?.current
  });
  const {
    // State
    controls,
    error,
    isConnecting,
    connectionQuality,
    participantCount,
    isHost,
    canRecord,
    canStream,
    
    // Actions
    toggleMic,
    toggleCamera,
    toggleScreenShare,
    toggleHandRaise,
    toggleRecording,
    toggleLiveStreaming,
    toggleYouTubeStreaming,
    toggleChat,
    toggleParticipants,
    toggleWhiteboard,
    toggleBreakoutRooms,
    toggleSettings,
    
    // Moderator actions
    muteAllParticipants,
    lowerAllHands,
    toggleLobby
  } = useJitsiControls(jitsiApiRef, jitsiReady);

  // Enhanced handlers with additional functionality
  const handleToggleMic = useCallback(() => {
    toggleMic();
  }, [toggleMic]);

  const handleToggleCamera = useCallback(() => {
    toggleCamera();
  }, [toggleCamera]);

  const handleToggleScreenShare = useCallback(() => {
    toggleScreenShare();
  }, [toggleScreenShare]);

  const handleToggleHandRaise = useCallback(() => {
    toggleHandRaise();
  }, [toggleHandRaise]);

  const handleToggleRecording = useCallback(() => {
    toggleRecording();
  }, [toggleRecording]);

  const handleToggleLiveStreaming = useCallback(() => {
    toggleLiveStreaming();
  }, [toggleLiveStreaming]);

  const handleToggleYouTubeStreaming = useCallback(() => {
    toggleYouTubeStreaming();
  }, [toggleYouTubeStreaming]);

  const handleToggleChat = useCallback(() => {
    toggleChat();
  }, [toggleChat]);

  const handleToggleParticipants = useCallback(() => {
    toggleParticipants();
  }, [toggleParticipants]);

  const handleToggleWhiteboard = useCallback(() => {
    toggleWhiteboard();
  }, [toggleWhiteboard]);

  const handleToggleBreakoutRooms = useCallback(() => {
    toggleBreakoutRooms();
  }, [toggleBreakoutRooms]);

  const handleToggleSettings = useCallback(() => {
    toggleSettings();
  }, [toggleSettings]);

  const handleMuteAll = useCallback(() => {
    muteAllParticipants();
  }, [muteAllParticipants]);

  const handleLowerAllHands = useCallback(() => {
    lowerAllHands();
  }, [lowerAllHands]);

  const handleToggleLobby = useCallback(() => {
    toggleLobby();
  }, [toggleLobby]);

  return (
    <div className="flex flex-col items-center w-full max-w-7xl mx-auto px-4">
      {/* Status Indicator */}
      <StatusIndicator 
        error={error}
        isConnecting={isConnecting}
        connectionQuality={connectionQuality}
        participantCount={participantCount}
      />
      
      {/* Main Controls */}
      <MeetingControls
        controls={controls}
        isHost={isManager || isHost}
        canRecord={canRecord}
        canStream={canStream}
        jitsiReady={jitsiReady}
        onToggleMic={handleToggleMic}
        onToggleCamera={handleToggleCamera}
        onToggleScreenShare={handleToggleScreenShare}
        onToggleHandRaise={handleToggleHandRaise}
        onToggleRecording={handleToggleRecording}
        onToggleLiveStreaming={handleToggleLiveStreaming}
        onToggleYouTubeStreaming={handleToggleYouTubeStreaming}
        onToggleChat={handleToggleChat}
        onToggleParticipants={handleToggleParticipants}
        onToggleWhiteboard={handleToggleWhiteboard}
        onToggleBreakoutRooms={handleToggleBreakoutRooms}
        onToggleSettings={handleToggleSettings}
        onToggleLayout={onToggleLayout}
        onLeave={onLeave}
        onLogout={onLogout}
        onMuteAll={handleMuteAll}
        onLowerAllHands={handleLowerAllHands}
        onToggleLobby={handleToggleLobby}
      />
    </div>
  );
}