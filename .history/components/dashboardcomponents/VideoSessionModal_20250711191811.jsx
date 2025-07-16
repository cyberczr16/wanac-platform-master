
import React, { useRef, useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import PropTypes from "prop-types";


export default function VideoSessionModal({ onClose, sessionData }) {
  const jitsiContainerRef = useRef(null);
  const jitsiApiRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadJitsi();
    return cleanup;
    // eslint-disable-next-line
  }, []);

  const loadJitsi = async () => {
    try {
      if (window.JitsiMeetExternalAPI) {
        initializeJitsi();
        return;
      }

      // Prevent duplicate script loading
      if (!document.querySelector('script[src="https://meet.jit.si/external_api.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://meet.jit.si/external_api.js';
        script.async = true;

        script.onload = () => {
          setTimeout(initializeJitsi, 100);
        };

        script.onerror = () => {
          setError('Failed to load Jitsi Meet');
          setIsLoading(false);
        };

        document.head.appendChild(script);
      } else {
        // If script is already present but API not loaded yet, wait and try again
        const checkApi = setInterval(() => {
          if (window.JitsiMeetExternalAPI) {
            clearInterval(checkApi);
            initializeJitsi();
          }
        }, 100);
        setTimeout(() => clearInterval(checkApi), 5000);
      }
    } catch (err) {
      setError('Error initializing video session');
      setIsLoading(false);
    }
  };

  const initializeJitsi = () => {
    try {
      if (jitsiContainerRef.current) {
        jitsiContainerRef.current.innerHTML = '';
      }
      const roomName = `wanac-${sessionData?.id || Date.now()}`;

      const options = {
        roomName,
        width: '100%',
        height: '100%',
        parentNode: jitsiContainerRef.current,
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          enableWelcomePage: false,
          prejoinPageEnabled: false,
          disableDeepLinking: true
        },
        userInfo: {
          displayName: sessionData?.userName || 'User'
        }
      };

      jitsiApiRef.current = new window.JitsiMeetExternalAPI('meet.jit.si', options);

      jitsiApiRef.current.addEventListener('videoConferenceLeft', onClose);
      jitsiApiRef.current.addEventListener('readyToClose', onClose);

      setIsLoading(false);
    } catch (err) {
      setError('Failed to start video session');
      setIsLoading(false);
    }
  };

  const cleanup = () => {
    if (jitsiApiRef.current) {
      try {
        jitsiApiRef.current.dispose();
      } catch (err) {
        console.warn('Error disposing Jitsi API:', err);
      }
    }
  };

  // Redesigned Modal
  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900/80 to-blue-900/80 backdrop-blur-sm">
        <div className="bg-white/80 shadow-2xl rounded-2xl max-w-md w-full mx-4 p-8 flex flex-col items-center border border-white/30">
          <div className="mb-4 w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </div>
          <h3 className="text-xl font-bold text-red-600 mb-2">Connection Error</h3>
          <p className="text-gray-700 mb-6 text-center">{error}</p>
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 py-2 rounded-lg shadow hover:from-blue-700 hover:to-blue-500 transition"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900/80 to-blue-900/80 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl mx-4 rounded-2xl shadow-2xl bg-white/80 border border-white/30 flex flex-col overflow-hidden min-h-[60vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-700/90 to-blue-400/80">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-xl shadow">
              {sessionData?.coach?.[0]?.toUpperCase() || 'C'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white drop-shadow">{sessionData?.title || "Coaching Session"}</h2>
              <p className="text-sm text-blue-100">{sessionData?.coach || "Coach"}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-800/40 rounded-full p-2 transition"
            aria-label="Close video session modal"
          >
            <FiX size={28} />
          </button>
        </div>

        {/* Jitsi Meet Container */}
        <div className="flex-1 relative min-h-[350px]">
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-900/60 to-blue-400/30 backdrop-blur-sm z-10" aria-busy="true" aria-live="polite">
              <div className="relative w-16 h-16 mb-4">
                <span className="absolute inset-0 rounded-full border-4 border-blue-400 border-t-transparent animate-spin"></span>
                <span className="absolute inset-2 rounded-full bg-white/80"></span>
                <span className="absolute inset-4 rounded-full bg-blue-200"></span>
              </div>
              <p className="text-blue-900 font-semibold text-lg">Loading video session...</p>
            </div>
          )}
          <div ref={jitsiContainerRef} className="w-full h-full min-h-[350px] rounded-b-2xl overflow-hidden" />
        </div>
      </div>
    </div>
  );
}

VideoSessionModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  sessionData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    userName: PropTypes.string,
    title: PropTypes.string,
    coach: PropTypes.string,
  }),
};