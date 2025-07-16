
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
        // Optionally, add a timeout to avoid infinite loop
        setTimeout(() => clearInterval(checkApi), 5000);
      }
    } catch (err) {
      setError('Error initializing video session');
      setIsLoading(false);
    }
  };

  const initializeJitsi = () => {
    try {
      // Clean up the container before initializing (avoid stacking iframes)
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

  if (error) {
    return (
      <div className="fixed inset-0 z-50 bg-gray-900 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg max-w-md mx-4">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Connection Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-gray-900">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 p-4 flex justify-between items-center">
          <div className="text-white">
            <h2 className="text-lg font-semibold">{sessionData?.title || "Coaching Session"}</h2>
            <p className="text-sm text-gray-300">{sessionData?.coach || "Coach"}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 p-2"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Jitsi Meet Container */}
        <div className="flex-1 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center" aria-busy="true" aria-live="polite">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" role="status" aria-label="Loading"></div>
                <p>Loading video session...</p>
              </div>
            </div>
          )}
          <div ref={jitsiContainerRef} className="w-full h-full" />
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