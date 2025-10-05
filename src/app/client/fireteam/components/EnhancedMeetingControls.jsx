import React, { useState, useEffect } from 'react';
import { 
  FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, 
  FaDesktop, FaRegHandPaper, FaPhoneSlash, FaThLarge, 
  FaSignOutAlt, FaCircle, FaUsers, FaClock, FaSmile,
  FaChalkboard, FaLayerGroup, FaUserShield
} from 'react-icons/fa';

export default function EnhancedMeetingControls({ 
  onLeave, 
  onLogout, 
  isManager, 
  onToggleLayout, 
  jitsiApiRef, 
  jitsiReady = false,
  isRecording = false,
  onToggleRecording,
  currentLayout = 'grid' // 'grid', 'speaker', 'tile'
}) {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [screenOn, setScreenOn] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [error, setError] = useState('');
  const [showReactions, setShowReactions] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState('good');
  const [participantCount, setParticipantCount] = useState(0);

  // Track connection quality
  useEffect(() => {
    if (!jitsiApiRef?.current || !jitsiReady) return;

    const handleConnectionQuality = (event) => {
      const quality = event.connectionQuality;
      if (quality > 80) setConnectionQuality('excellent');
      else if (quality > 50) setConnectionQuality('good');
      else if (quality > 20) setConnectionQuality('fair');
      else setConnectionQuality('poor');
    };

    jitsiApiRef.current.addEventListener('connectionQualityChanged', handleConnectionQuality);

    return () => {
      if (jitsiApiRef?.current) {
        jitsiApiRef.current.removeEventListener('connectionQualityChanged', handleConnectionQuality);
      }
    };
  }, [jitsiApiRef, jitsiReady]);

  // Track participant count
  useEffect(() => {
    if (!jitsiApiRef?.current || !jitsiReady) return;

    const updateParticipantCount = () => {
      try {
        const participants = jitsiApiRef.current.getParticipantsInfo();
        setParticipantCount(participants.length + 1); // +1 for local user
      } catch (err) {
        console.error('Failed to get participant count:', err);
      }
    };

    jitsiApiRef.current.addEventListener('participantJoined', updateParticipantCount);
    jitsiApiRef.current.addEventListener('participantLeft', updateParticipantCount);
    jitsiApiRef.current.addEventListener('videoConferenceJoined', updateParticipantCount);

    updateParticipantCount();

    return () => {
      if (jitsiApiRef?.current) {
        jitsiApiRef.current.removeEventListener('participantJoined', updateParticipantCount);
        jitsiApiRef.current.removeEventListener('participantLeft', updateParticipantCount);
        jitsiApiRef.current.removeEventListener('videoConferenceJoined', updateParticipantCount);
      }
    };
  }, [jitsiApiRef, jitsiReady]);

  const handleToggleMic = () => {
    if (!jitsiApiRef?.current || !jitsiReady) {
      setError('Meeting not ready');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      jitsiApiRef.current.executeCommand('toggleAudio');
      setMicOn(!micOn);
    } catch (err) {
      console.error('Failed to toggle mic:', err);
      setError('Failed to toggle microphone');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleToggleCamera = () => {
    if (!jitsiApiRef?.current || !jitsiReady) {
      setError('Meeting not ready');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      jitsiApiRef.current.executeCommand('toggleVideo');
      setCamOn(!camOn);
    } catch (err) {
      console.error('Failed to toggle camera:', err);
      setError('Failed to toggle camera');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleToggleScreen = () => {
    if (!jitsiApiRef?.current || !jitsiReady) {
      setError('Meeting not ready');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      jitsiApiRef.current.executeCommand('toggleShareScreen');
      setScreenOn(!screenOn);
    } catch (err) {
      console.error('Failed to toggle screen share:', err);
      setError('Failed to toggle screen share');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleToggleHand = () => {
    if (!jitsiApiRef?.current || !jitsiReady) {
      setError('Meeting not ready');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      jitsiApiRef.current.executeCommand('toggleRaiseHand');
      setHandRaised(!handRaised);
    } catch (err) {
      console.error('Failed to toggle hand raised:', err);
      setError('Failed to toggle hand raised');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleSendReaction = (emoji) => {
    if (!jitsiApiRef?.current || !jitsiReady) return;

    try {
      jitsiApiRef.current.executeCommand('sendEndpointTextMessage', '', JSON.stringify({
        type: 'reaction',
        emoji: emoji
      }));
      setShowReactions(false);
    } catch (err) {
      console.error('Failed to send reaction:', err);
    }
  };

  const handleToggleTileView = () => {
    if (!jitsiApiRef?.current || !jitsiReady) return;

    try {
      jitsiApiRef.current.executeCommand('toggleTileView');
    } catch (err) {
      console.error('Failed to toggle tile view:', err);
    }
  };

  const handleMuteAll = () => {
    if (!jitsiApiRef?.current || !jitsiReady || !isManager) return;

    try {
      const participants = jitsiApiRef.current.getParticipantsInfo();
      participants.forEach(p => {
        jitsiApiRef.current.executeCommand('muteEveryone', 'audio');
      });
    } catch (err) {
      console.error('Failed to mute all:', err);
    }
  };

  const getConnectionQualityColor = () => {
    switch (connectionQuality) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-green-400';
      case 'fair': return 'text-yellow-500';
      case 'poor': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const reactions = ['👍', '❤️', '😂', '😮', '👏', '🎉'];

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto px-4">
      {/* Status Bar */}
      <div className="mb-3 flex items-center gap-4 text-xs text-gray-600">
        {/* Connection Quality */}
        <div className="flex items-center gap-2">
          <FaCircle className={`w-2 h-2 ${getConnectionQualityColor()}`} />
          <span>Connection: {connectionQuality}</span>
        </div>

        {/* Participant Count */}
        <div className="flex items-center gap-2">
          <FaUsers className="w-3 h-3" />
          <span>{participantCount} {participantCount === 1 ? 'participant' : 'participants'}</span>
        </div>

        {/* Recording Indicator */}
        {isRecording && (
          <div className="flex items-center gap-2 text-red-600 animate-pulse">
            <FaCircle className="w-2 h-2" />
            <span>Recording</span>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-3 px-4 py-2 bg-red-100 text-red-700 text-sm rounded-lg border border-red-300">
          {error}
        </div>
      )}
      
      {/* Main Controls */}
      <div className="flex items-center bg-white rounded-full shadow-lg px-6 py-3 border border-gray-200 gap-2">
        {/* Mic */}
        <button
          className={`focus:outline-none text-xl p-3 rounded-full transition ${
            jitsiReady ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'
          } ${!micOn ? 'bg-red-100' : ''}`}
          onClick={handleToggleMic}
          disabled={!jitsiReady}
          title={micOn ? 'Mute microphone' : 'Unmute microphone'}
        >
          {micOn ? (
            <FaMicrophone className="text-gray-700" />
          ) : (
            <FaMicrophoneSlash className="text-red-600" />
          )}
        </button>

        {/* Camera */}
        <button
          className={`focus:outline-none text-xl p-3 rounded-full transition ${
            jitsiReady ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'
          } ${!camOn ? 'bg-red-100' : ''}`}
          onClick={handleToggleCamera}
          disabled={!jitsiReady}
          title={camOn ? 'Turn off camera' : 'Turn on camera'}
        >
          {camOn ? (
            <FaVideo className="text-gray-700" />
          ) : (
            <FaVideoSlash className="text-red-600" />
          )}
        </button>

        {/* Screen Share */}
        <button
          className={`focus:outline-none text-xl p-3 rounded-full transition ${
            jitsiReady ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'
          } ${screenOn ? 'bg-blue-100' : ''}`}
          onClick={handleToggleScreen}
          disabled={!jitsiReady}
          title={screenOn ? 'Stop screen sharing' : 'Start screen sharing'}
        >
          <FaDesktop className={screenOn ? 'text-blue-600' : 'text-gray-700'} />
        </button>

        <div className="w-px h-8 bg-gray-300 mx-2"></div>

        {/* Layout Toggle */}
        <button
          className="focus:outline-none text-xl p-3 rounded-full transition hover:bg-gray-100"
          onClick={onToggleLayout}
          title="Toggle between slides and video"
        >
          <FaThLarge className="text-gray-700" />
        </button>

        {/* Tile View Toggle */}
        <button
          className={`focus:outline-none text-xl p-3 rounded-full transition ${
            jitsiReady ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'
          }`}
          onClick={handleToggleTileView}
          disabled={!jitsiReady}
          title="Toggle tile view"
        >
          <FaLayerGroup className="text-gray-700" />
        </button>

        <div className="w-px h-8 bg-gray-300 mx-2"></div>

        {/* Reactions */}
        <div className="relative">
          <button
            className={`focus:outline-none text-xl p-3 rounded-full transition ${
              jitsiReady ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'
            } ${showReactions ? 'bg-yellow-100' : ''}`}
            onClick={() => setShowReactions(!showReactions)}
            disabled={!jitsiReady}
            title="Send reaction"
          >
            <FaSmile className={showReactions ? 'text-yellow-600' : 'text-gray-700'} />
          </button>

          {/* Reactions Menu */}
          {showReactions && (
            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl border border-gray-200 p-2 flex gap-2">
              {reactions.map((emoji, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendReaction(emoji)}
                  className="text-2xl hover:scale-125 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Hand Raise */}
        <button
          className={`focus:outline-none text-xl p-3 rounded-full transition ${
            jitsiReady ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'
          } ${handRaised ? 'bg-yellow-100' : ''}`}
          onClick={handleToggleHand}
          disabled={!jitsiReady}
          title={handRaised ? 'Lower hand' : 'Raise hand'}
        >
          <FaRegHandPaper className={handRaised ? 'text-yellow-600' : 'text-gray-700'} />
        </button>

        {/* Manager Controls */}
        {isManager && (
          <>
            <div className="w-px h-8 bg-gray-300 mx-2"></div>

            {/* Mute All */}
            <button
              className={`focus:outline-none text-xl p-3 rounded-full transition ${
                jitsiReady ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'
              }`}
              onClick={handleMuteAll}
              disabled={!jitsiReady}
              title="Mute all participants"
            >
              <FaUserShield className="text-purple-600" />
            </button>

            {/* Recording */}
            {onToggleRecording && (
              <button
                className={`focus:outline-none text-xl p-3 rounded-full transition ${
                  jitsiReady ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'
                } ${isRecording ? 'bg-red-100' : ''}`}
                onClick={onToggleRecording}
                disabled={!jitsiReady}
                title={isRecording ? 'Stop recording' : 'Start recording'}
              >
                <FaCircle className={isRecording ? 'text-red-600' : 'text-gray-700'} />
              </button>
            )}
          </>
        )}

        <div className="w-px h-8 bg-gray-300 mx-2"></div>

        {/* Leave */}
        <button
          className="focus:outline-none text-xl p-3 rounded-full bg-red-600 text-white hover:bg-red-700 transition"
          onClick={onLeave}
          title="Leave meeting"
        >
          <FaPhoneSlash />
        </button>

        {/* Logout */}
        <button
          className="focus:outline-none text-xl p-3 rounded-full transition hover:bg-gray-100"
          onClick={onLogout}
          title="Logout"
        >
          <FaSignOutAlt className="text-gray-700" />
        </button>
      </div>
    </div>
  );
}

