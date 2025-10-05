import React, { useState, useEffect } from 'react';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaDesktop, FaRegHandPaper, FaPhoneSlash, FaThLarge, FaSignOutAlt } from 'react-icons/fa';

export default function SimpleMeetControlBar({ 
  onLeave, 
  onLogout, 
  isManager, 
  onToggleLayout, 
  jitsiApiRef, 
  jitsiReady = false 
}) {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [screenOn, setScreenOn] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [error, setError] = useState('');

  // Debug logging for jitsiReady changes
  useEffect(() => {
    console.log('🎛️ SimpleMeetControlBar: jitsiReady changed to:', jitsiReady);
    console.log('🎛️ SimpleMeetControlBar: API ref exists:', !!jitsiApiRef?.current);
  }, [jitsiReady, jitsiApiRef]);

  // Simple button handlers
  const handleToggleMic = () => {
    console.log('🎤 Toggle mic clicked', { jitsiReady, hasApi: !!jitsiApiRef?.current });
    
    if (!jitsiApiRef?.current || !jitsiReady) {
      setError('Jitsi not ready');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      jitsiApiRef.current.executeCommand('toggleAudio');
      setMicOn(!micOn);
      console.log('✅ Mic toggled successfully');
    } catch (err) {
      console.error('❌ Failed to toggle mic:', err);
      setError('Failed to toggle microphone');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleToggleCamera = () => {
    console.log('📹 Toggle camera clicked', { jitsiReady, hasApi: !!jitsiApiRef?.current });
    
    if (!jitsiApiRef?.current || !jitsiReady) {
      setError('Jitsi not ready');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      jitsiApiRef.current.executeCommand('toggleVideo');
      setCamOn(!camOn);
      console.log('✅ Camera toggled successfully');
    } catch (err) {
      console.error('❌ Failed to toggle camera:', err);
      setError('Failed to toggle camera');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleToggleScreen = () => {
    console.log('🖥️ Toggle screen share clicked', { jitsiReady, hasApi: !!jitsiApiRef?.current });
    
    if (!jitsiApiRef?.current || !jitsiReady) {
      setError('Jitsi not ready');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      jitsiApiRef.current.executeCommand('toggleShareScreen');
      setScreenOn(!screenOn);
      console.log('✅ Screen share toggled successfully');
    } catch (err) {
      console.error('❌ Failed to toggle screen share:', err);
      setError('Failed to toggle screen share');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleToggleHand = () => {
    console.log('✋ Toggle hand raised clicked', { jitsiReady, hasApi: !!jitsiApiRef?.current });
    
    if (!jitsiApiRef?.current || !jitsiReady) {
      setError('Jitsi not ready');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      jitsiApiRef.current.executeCommand('toggleRaiseHand');
      setHandRaised(!handRaised);
      console.log('✅ Hand raised toggled successfully');
    } catch (err) {
      console.error('❌ Failed to toggle hand raised:', err);
      setError('Failed to toggle hand raised');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto px-4">
      {/* Error Message */}
      {error && (
        <div className="mb-4 px-4 py-2 bg-red-100 text-red-700 text-sm rounded-lg border border-red-300">
          {error}
        </div>
      )}
      
      {/* Simple Controls */}
      <div className="flex items-center bg-white rounded-full shadow-lg px-6 py-3 border border-gray-200">
        {/* Mic */}
        <button
          className={`focus:outline-none text-xl p-2 rounded-full transition mr-4 ${
            jitsiReady ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'
          }`}
          onClick={handleToggleMic}
          disabled={!jitsiReady}
          title={micOn ? 'Mute microphone' : 'Unmute microphone'}
        >
          {micOn ? (
            <FaMicrophone className="text-gray-500" />
          ) : (
            <FaMicrophoneSlash className="text-red-500" />
          )}
        </button>

        {/* Camera */}
        <button
          className={`focus:outline-none text-xl p-2 rounded-full transition mr-4 ${
            jitsiReady ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'
          }`}
          onClick={handleToggleCamera}
          disabled={!jitsiReady}
          title={camOn ? 'Turn off camera' : 'Turn on camera'}
        >
          {camOn ? (
            <FaVideo className="text-gray-500" />
          ) : (
            <FaVideoSlash className="text-red-500" />
          )}
        </button>

        {/* Screen Share */}
        <button
          className={`focus:outline-none text-xl p-2 rounded-full transition mr-4 ${
            jitsiReady ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'
          } ${screenOn ? 'bg-blue-100' : ''}`}
          onClick={handleToggleScreen}
          disabled={!jitsiReady}
          title={screenOn ? 'Stop screen sharing' : 'Start screen sharing'}
        >
          <FaDesktop className={screenOn ? 'text-blue-600' : 'text-gray-500'} />
        </button>

        {/* Layout Toggle */}
        <button
          className="focus:outline-none text-xl p-2 rounded-full transition hover:bg-gray-100 mr-4"
          onClick={onToggleLayout}
          title="Toggle layout"
        >
          <FaThLarge className="text-gray-500" />
        </button>

        {/* Hand Raise */}
        <button
          className={`focus:outline-none text-xl p-2 rounded-full transition mr-4 ${
            jitsiReady ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'
          } ${handRaised ? 'bg-yellow-100' : ''}`}
          onClick={handleToggleHand}
          disabled={!jitsiReady}
          title={handRaised ? 'Lower hand' : 'Raise hand'}
        >
          <FaRegHandPaper className={handRaised ? 'text-yellow-600' : 'text-gray-500'} />
        </button>

        {/* Leave */}
        <button
          className="focus:outline-none text-xl p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition mr-4"
          onClick={onLeave}
          title="Leave call"
        >
          <FaPhoneSlash />
        </button>

        {/* Logout */}
        <button
          className="focus:outline-none text-xl p-2 rounded-full transition hover:bg-gray-100"
          onClick={onLogout}
          title="Logout"
        >
          <FaSignOutAlt className="text-gray-500" />
        </button>
      </div>
    </div>
  );
}
