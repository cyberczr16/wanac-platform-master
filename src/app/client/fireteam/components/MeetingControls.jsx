import React, { memo, useCallback } from 'react';
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaDesktop,
  FaRegHandPaper,
  FaPhoneSlash,
  FaShieldAlt,
  FaSignOutAlt,
  FaThLarge,
  FaComments,
  FaUsers,
  FaRecordVinyl,
  FaYoutube,
  FaRss,
  FaCog,
  FaChalkboard,
  FaDoorOpen,
  FaVolumeMute,
  FaVolumeUp,
  FaUserSlash,
  FaUserCheck,
  FaExpand,
  FaCompress
} from 'react-icons/fa';
import ControlButton from './ControlButton';

const MeetingControls = memo(({
  controls,
  isHost,
  canRecord,
  canStream,
  jitsiReady,
  onToggleMic,
  onToggleCamera,
  onToggleScreenShare,
  onToggleHandRaise,
  onToggleRecording,
  onToggleLiveStreaming,
  onToggleYouTubeStreaming,
  onToggleChat,
  onToggleParticipants,
  onToggleWhiteboard,
  onToggleBreakoutRooms,
  onToggleSettings,
  onToggleLayout,
  onLeave,
  onLogout,
  onMuteAll,
  onLowerAllHands,
  onKickParticipant,
  onToggleLobby
}) => {
  const handleToggleMic = useCallback(() => {
    onToggleMic();
  }, [onToggleMic]);

  const handleToggleCamera = useCallback(() => {
    onToggleCamera();
  }, [onToggleCamera]);

  const handleToggleScreenShare = useCallback(() => {
    onToggleScreenShare();
  }, [onToggleScreenShare]);

  const handleToggleHandRaise = useCallback(() => {
    onToggleHandRaise();
  }, [onToggleHandRaise]);

  const handleToggleRecording = useCallback(() => {
    if (canRecord) {
      onToggleRecording();
    }
  }, [canRecord, onToggleRecording]);

  const handleToggleLiveStreaming = useCallback(() => {
    if (canStream) {
      onToggleLiveStreaming();
    }
  }, [canStream, onToggleLiveStreaming]);

  const handleToggleYouTubeStreaming = useCallback(() => {
    if (canStream) {
      onToggleYouTubeStreaming();
    }
  }, [canStream, onToggleYouTubeStreaming]);

  const handleToggleChat = useCallback(() => {
    onToggleChat();
  }, [onToggleChat]);

  const handleToggleParticipants = useCallback(() => {
    onToggleParticipants();
  }, [onToggleParticipants]);

  const handleToggleWhiteboard = useCallback(() => {
    onToggleWhiteboard();
  }, [onToggleWhiteboard]);

  const handleToggleBreakoutRooms = useCallback(() => {
    onToggleBreakoutRooms();
  }, [onToggleBreakoutRooms]);

  const handleToggleSettings = useCallback(() => {
    onToggleSettings();
  }, [onToggleSettings]);

  const handleToggleLayout = useCallback(() => {
    onToggleLayout();
  }, [onToggleLayout]);

  const handleLeave = useCallback(() => {
    onLeave();
  }, [onLeave]);

  const handleLogout = useCallback(() => {
    onLogout();
  }, [onLogout]);

  const handleMuteAll = useCallback(() => {
    if (isHost) {
      onMuteAll();
    }
  }, [isHost, onMuteAll]);

  const handleLowerAllHands = useCallback(() => {
    if (isHost) {
      onLowerAllHands();
    }
  }, [isHost, onLowerAllHands]);

  const handleToggleLobby = useCallback(() => {
    if (isHost) {
      onToggleLobby();
    }
  }, [isHost, onToggleLobby]);

  return (
    <div className="flex items-center bg-white rounded-full shadow-lg px-6 py-4 border border-gray-200 w-full max-w-6xl">
      {/* Host Badge - Left */}
      <div className="flex-shrink-0 mr-4">
        {isHost && (
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            <FaShieldAlt className="text-sm" />
            <span className="hidden sm:inline">Host</span>
          </div>
        )}
      </div>

      {/* Main Controls - Center */}
      <div className="flex flex-1 justify-center items-center gap-2 sm:gap-4">
        {/* Audio Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          <ControlButton
            icon={controls.micOn ? FaMicrophone : FaMicrophoneSlash}
            label={controls.micOn ? 'Mute microphone' : 'Unmute microphone'}
            title={controls.micOn ? 'Mute microphone' : 'Unmute microphone'}
            onClick={handleToggleMic}
            disabled={!jitsiReady}
            active={!controls.micOn}
            variant={!controls.micOn ? 'danger' : 'default'}
          />
          
          {isHost && (
            <ControlButton
              icon={FaVolumeMute}
              label="Mute all participants"
              title="Mute all participants"
              onClick={handleMuteAll}
              disabled={!jitsiReady}
              variant="warning"
              size="small"
            />
          )}
        </div>

        {/* Video Controls */}
        <ControlButton
          icon={controls.camOn ? FaVideo : FaVideoSlash}
          label={controls.camOn ? 'Turn off camera' : 'Turn on camera'}
          title={controls.camOn ? 'Turn off camera' : 'Turn on camera'}
          onClick={handleToggleCamera}
          disabled={!jitsiReady}
          active={!controls.camOn}
          variant={!controls.camOn ? 'danger' : 'default'}
        />

        {/* Screen Share */}
        <ControlButton
          icon={FaDesktop}
          label={controls.screenOn ? 'Stop screen sharing' : 'Start screen sharing'}
          title={controls.screenOn ? 'Stop screen sharing' : 'Start screen sharing'}
          onClick={handleToggleScreenShare}
          disabled={!jitsiReady}
          active={controls.screenOn}
          variant={controls.screenOn ? 'primary' : 'default'}
        />

        {/* Layout Toggle */}
        <ControlButton
          icon={FaThLarge}
          label="Toggle layout"
          title="Toggle between slides and video"
          onClick={handleToggleLayout}
          disabled={!jitsiReady}
        />

        {/* Hand Raise */}
        <ControlButton
          icon={FaRegHandPaper}
          label={controls.handRaised ? 'Lower hand' : 'Raise hand'}
          title={controls.handRaised ? 'Lower hand' : 'Raise hand'}
          onClick={handleToggleHandRaise}
          disabled={!jitsiReady}
          active={controls.handRaised}
          variant={controls.handRaised ? 'warning' : 'default'}
        />

        {/* Recording Controls (Host Only) */}
        {isHost && canRecord && (
          <ControlButton
            icon={FaRecordVinyl}
            label={controls.recordingOn ? 'Stop recording' : 'Start recording'}
            title={controls.recordingOn ? 'Stop recording' : 'Start recording'}
            onClick={handleToggleRecording}
            disabled={!jitsiReady}
            active={controls.recordingOn}
            variant={controls.recordingOn ? 'danger' : 'default'}
          />
        )}

        {/* Live Streaming (Host Only) */}
        {isHost && canStream && (
          <div className="flex items-center gap-1">
            <ControlButton
              icon={FaRss}
              label={controls.liveStreaming ? 'Stop live streaming' : 'Start live streaming'}
              title={controls.liveStreaming ? 'Stop live streaming' : 'Start live streaming'}
              onClick={handleToggleLiveStreaming}
              disabled={!jitsiReady}
              active={controls.liveStreaming}
              variant={controls.liveStreaming ? 'primary' : 'default'}
              size="small"
            />
            <ControlButton
              icon={FaYoutube}
              label={controls.youtubeStreaming ? 'Stop YouTube streaming' : 'Start YouTube streaming'}
              title={controls.youtubeStreaming ? 'Stop YouTube streaming' : 'Start YouTube streaming'}
              onClick={handleToggleYouTubeStreaming}
              disabled={!jitsiReady}
              active={controls.youtubeStreaming}
              variant={controls.youtubeStreaming ? 'danger' : 'default'}
              size="small"
            />
          </div>
        )}

        {/* Chat */}
        <ControlButton
          icon={FaComments}
          label={controls.chatOpen ? 'Close chat' : 'Open chat'}
          title={controls.chatOpen ? 'Close chat' : 'Open chat'}
          onClick={handleToggleChat}
          disabled={!jitsiReady}
          active={controls.chatOpen}
        />

        {/* Participants */}
        <ControlButton
          icon={FaUsers}
          label={controls.participantsOpen ? 'Close participants' : 'Open participants'}
          title={controls.participantsOpen ? 'Close participants' : 'Open participants'}
          onClick={handleToggleParticipants}
          disabled={!jitsiReady}
          active={controls.participantsOpen}
        />

        {/* Whiteboard */}
        <ControlButton
          icon={FaChalkboard}
          label={controls.whiteboardOpen ? 'Close whiteboard' : 'Open whiteboard'}
          title={controls.whiteboardOpen ? 'Close whiteboard' : 'Open whiteboard'}
          onClick={handleToggleWhiteboard}
          disabled={!jitsiReady}
          active={controls.whiteboardOpen}
        />

        {/* Breakout Rooms (Host Only) */}
        {isHost && (
          <ControlButton
            icon={FaDoorOpen}
            label={controls.breakoutRoomsOpen ? 'Close breakout rooms' : 'Open breakout rooms'}
            title={controls.breakoutRoomsOpen ? 'Close breakout rooms' : 'Open breakout rooms'}
            onClick={handleToggleBreakoutRooms}
            disabled={!jitsiReady}
            active={controls.breakoutRoomsOpen}
          />
        )}

        {/* Settings */}
        <ControlButton
          icon={FaCog}
          label={controls.settingsOpen ? 'Close settings' : 'Open settings'}
          title={controls.settingsOpen ? 'Close settings' : 'Open settings'}
          onClick={handleToggleSettings}
          disabled={!jitsiReady}
          active={controls.settingsOpen}
        />

        {/* Host Controls */}
        {isHost && (
          <div className="flex items-center gap-1 border-l border-gray-300 pl-2 ml-2">
            <ControlButton
              icon={FaRegHandPaper}
              label="Lower all hands"
              title="Lower all raised hands"
              onClick={handleLowerAllHands}
              disabled={!jitsiReady}
              variant="warning"
              size="small"
            />
            <ControlButton
              icon={FaUserSlash}
              label="Toggle lobby"
              title="Enable/disable lobby"
              onClick={handleToggleLobby}
              disabled={!jitsiReady}
              variant="warning"
              size="small"
            />
          </div>
        )}

        {/* Leave Button */}
        <div className="flex items-center gap-2 border-l border-gray-300 pl-2 ml-2">
          <ControlButton
            icon={FaPhoneSlash}
            label="Leave call"
            title="Leave call"
            onClick={handleLeave}
            variant="danger"
          />
        </div>
      </div>

      {/* Logout - Right */}
      <div className="flex-shrink-0 ml-4">
        <ControlButton
          icon={FaSignOutAlt}
          label="Logout"
          title="Logout"
          onClick={handleLogout}
          disabled={!jitsiReady}
        />
      </div>
    </div>
  );
});

MeetingControls.displayName = 'MeetingControls';

export default MeetingControls;
