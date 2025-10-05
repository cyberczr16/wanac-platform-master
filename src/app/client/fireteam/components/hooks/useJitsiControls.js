import { useState, useEffect, useCallback, useRef } from 'react';

// Constants
const ERROR_TIMEOUT = 3000;
const CONNECTING_TIMEOUT = 2000;
const STATUS_CHECK_INTERVAL = 1000;

export const useJitsiControls = (jitsiApiRef, jitsiReady = false) => {
  // State management
  const [controls, setControls] = useState({
    micOn: true,
    camOn: true,
    screenOn: false,
    handRaised: false,
    chatOpen: false,
    participantsOpen: false,
    recordingOn: false,
    whiteboardOpen: false,
    breakoutRoomsOpen: false,
    settingsOpen: false,
    backgroundBlurred: false,
    virtualBackground: null,
    noiseSuppression: true,
    echoCancellation: true,
    liveStreaming: false,
    youtubeStreaming: false
  });

  const [error, setError] = useState('');
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionQuality, setConnectionQuality] = useState('good');
  const [participantCount, setParticipantCount] = useState(0);
  const [isHost, setIsHost] = useState(false);
  const [canRecord, setCanRecord] = useState(false);
  const [canStream, setCanStream] = useState(false);
  
  // Refs for cleanup
  const statusCheckRef = useRef(null);
  const errorTimeoutRef = useRef(null);

  // Clear error after timeout
  const clearError = useCallback(() => {
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }
    errorTimeoutRef.current = setTimeout(() => setError(''), ERROR_TIMEOUT);
  }, []);

  // Show error with auto-clear
  const showError = useCallback((message, timeout = ERROR_TIMEOUT) => {
    setError(message);
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }
    errorTimeoutRef.current = setTimeout(() => setError(''), timeout);
  }, []);

  // Connection status tracking
  useEffect(() => {
    if (jitsiReady) {
      setIsConnecting(false);
    }
  }, [jitsiReady]);

  // Initialize Jitsi event listeners and get initial state
  useEffect(() => {
    const api = jitsiApiRef?.current;
    if (!api || !jitsiReady) return;

    // Event handlers
    const handleAudioMuteStatusChanged = ({ muted }) => {
      setControls(prev => ({ ...prev, micOn: !muted }));
    };

    const handleVideoMuteStatusChanged = ({ muted }) => {
      setControls(prev => ({ ...prev, camOn: !muted }));
    };

    const handleScreenSharingStatusChanged = ({ on }) => {
      setControls(prev => ({ ...prev, screenOn: on }));
    };

    const handleRaiseHandStatusChanged = ({ id, handRaised: raised }) => {
      // Only update for local participant
      if (id === api.getParticipantId() || !id) {
        setControls(prev => ({ ...prev, handRaised: raised }));
      }
    };

    const handleParticipantJoined = () => {
      setParticipantCount(prev => prev + 1);
    };

    const handleParticipantLeft = () => {
      setParticipantCount(prev => Math.max(0, prev - 1));
    };

    const handleRecordingStatusChanged = ({ on, mode }) => {
      setControls(prev => ({ ...prev, recordingOn: on }));
    };

    const handleLiveStreamingStatusChanged = ({ on }) => {
      setControls(prev => ({ ...prev, liveStreaming: on }));
    };

    const handleYouTubeStreamingStatusChanged = ({ on }) => {
      setControls(prev => ({ ...prev, youtubeStreaming: on }));
    };

    const handleConnectionQualityChanged = ({ connectionQuality }) => {
      setConnectionQuality(connectionQuality);
    };

    const handleVideoQualityChanged = ({ videoQuality }) => {
      // Handle video quality changes
      console.log('Video quality changed:', videoQuality);
    };

    const handleError = (error) => {
      console.error('Jitsi error:', error);
      showError('An error occurred with the meeting controls');
    };

    // Add event listeners
    const eventListeners = [
      ['audioMuteStatusChanged', handleAudioMuteStatusChanged],
      ['videoMuteStatusChanged', handleVideoMuteStatusChanged],
      ['screenSharingStatusChanged', handleScreenSharingStatusChanged],
      ['raiseHandStatusChanged', handleRaiseHandStatusChanged],
      ['participantJoined', handleParticipantJoined],
      ['participantLeft', handleParticipantLeft],
      ['recordingStatusChanged', handleRecordingStatusChanged],
      ['liveStreamingStatusChanged', handleLiveStreamingStatusChanged],
      ['youtubeStreamingStatusChanged', handleYouTubeStreamingStatusChanged],
      ['connectionQualityChanged', handleConnectionQualityChanged],
      ['videoQualityChanged', handleVideoQualityChanged],
      ['errorOccurred', handleError]
    ];

    try {
      // Add all event listeners
      eventListeners.forEach(([event, handler]) => {
        api.addEventListener(event, handler);
      });

      // Get initial states
      Promise.all([
        api.isAudioMuted().catch(() => false),
        api.isVideoMuted().catch(() => false),
        api.getParticipantsInfo().then(participants => participants.length).catch(() => 0),
        api.getVideoQuality().catch(() => 'high')
      ]).then(([audioMuted, videoMuted, participantCount, videoQuality]) => {
        setControls(prev => ({
          ...prev,
          micOn: !audioMuted,
          camOn: !videoMuted
        }));
        setParticipantCount(participantCount);
      });

      // Check permissions
      api.getVideoQuality().then(quality => {
        setCanRecord(api.isRecordingSupported?.() || false);
        setCanStream(api.isLiveStreamingSupported?.() || false);
      }).catch(() => {
        // Fallback checks
        setCanRecord(false);
        setCanStream(false);
      });

      // Check if user is host/moderator
      const participantId = api.getParticipantId();
      api.getParticipantsInfo().then(participants => {
        const localParticipant = participants.find(p => p.participantId === participantId);
        setIsHost(localParticipant?.role === 'moderator' || localParticipant?.isModerator);
      }).catch(() => setIsHost(false));

    } catch (err) {
      console.error('Failed to setup Jitsi listeners:', err);
      showError('Failed to initialize meeting controls');
    }

    // Periodic status check
    statusCheckRef.current = setInterval(() => {
      try {
        // Update participant count
        api.getParticipantsInfo().then(participants => {
          setParticipantCount(participants.length);
        }).catch(() => {});

        // Check connection quality
        api.getConnectionQuality?.().then(quality => {
          setConnectionQuality(quality);
        }).catch(() => {});
      } catch (err) {
        console.error('Status check error:', err);
      }
    }, STATUS_CHECK_INTERVAL);

    // Cleanup
    return () => {
      try {
        eventListeners.forEach(([event, handler]) => {
          api.removeEventListener(event, handler);
        });
      } catch (err) {
        console.error('Failed to remove Jitsi listeners:', err);
      }
      
      if (statusCheckRef.current) {
        clearInterval(statusCheckRef.current);
      }
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, [jitsiApiRef, jitsiReady, showError]);

  // Control handlers
  const executeJitsiCommand = useCallback((command, ...args) => {
    const api = jitsiApiRef?.current;
    
    // Debug logging
    console.log('🔧 executeJitsiCommand called:', {
      command,
      args,
      apiExists: !!api,
      jitsiReady,
      isConnecting,
      apiType: typeof api,
      hasExecuteCommand: api && typeof api.executeCommand === 'function'
    });
    
    if (!api) {
      console.log('❌ No Jitsi API available');
      showError('Jitsi API not available. Please refresh the page.');
      return false;
    }
    
    if (!jitsiReady) {
      console.log('❌ Jitsi not ready:', { jitsiReady, isConnecting });
      showError(isConnecting ? 'Connecting to meeting...' : 'Meeting not ready yet', CONNECTING_TIMEOUT);
      return false;
    }

    if (typeof api.executeCommand !== 'function') {
      console.log('❌ executeCommand is not a function:', typeof api.executeCommand);
      showError('Jitsi API executeCommand not available');
      return false;
    }

    try {
      console.log('✅ Executing Jitsi command:', command, args);
      const result = api.executeCommand(command, ...args);
      console.log('✅ Command executed successfully:', result);
      return true;
    } catch (err) {
      console.error(`❌ Failed to execute ${command}:`, err);
      showError(`Failed to ${command.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
      return false;
    }
  }, [jitsiApiRef, jitsiReady, isConnecting, showError]);

  // Audio controls
  const toggleMic = useCallback(() => {
    return executeJitsiCommand('toggleAudio');
  }, [executeJitsiCommand]);

  const muteAllParticipants = useCallback(() => {
    return executeJitsiCommand('muteEveryone');
  }, [executeJitsiCommand]);

  const muteParticipant = useCallback((participantId) => {
    return executeJitsiCommand('muteParticipant', participantId);
  }, [executeJitsiCommand]);

  // Video controls
  const toggleCamera = useCallback(() => {
    return executeJitsiCommand('toggleVideo');
  }, [executeJitsiCommand]);

  const setVideoQuality = useCallback((quality) => {
    return executeJitsiCommand('setVideoQuality', quality);
  }, [executeJitsiCommand]);

  const toggleBackgroundBlur = useCallback(() => {
    return executeJitsiCommand('toggleBackgroundBlur');
  }, [executeJitsiCommand]);

  const setVirtualBackground = useCallback((background) => {
    return executeJitsiCommand('setVirtualBackground', background);
  }, [executeJitsiCommand]);

  // Screen sharing
  const toggleScreenShare = useCallback(() => {
    return executeJitsiCommand('toggleShareScreen');
  }, [executeJitsiCommand]);

  // Hand raising
  const toggleHandRaise = useCallback(() => {
    if (executeJitsiCommand('toggleRaiseHand')) {
      setControls(prev => ({ ...prev, handRaised: !prev.handRaised }));
      return true;
    }
    return false;
  }, [executeJitsiCommand]);

  const lowerAllHands = useCallback(() => {
    return executeJitsiCommand('lowerAllHands');
  }, [executeJitsiCommand]);

  // Recording
  const toggleRecording = useCallback(() => {
    return executeJitsiCommand('toggleRecording');
  }, [executeJitsiCommand]);

  // Live streaming
  const toggleLiveStreaming = useCallback(() => {
    return executeJitsiCommand('toggleLiveStreaming');
  }, [executeJitsiCommand]);

  const toggleYouTubeStreaming = useCallback(() => {
    return executeJitsiCommand('toggleYouTubeStreaming');
  }, [executeJitsiCommand]);

  // Chat
  const toggleChat = useCallback(() => {
    return executeJitsiCommand('toggleChat');
  }, [executeJitsiCommand]);

  // Participants
  const toggleParticipants = useCallback(() => {
    return executeJitsiCommand('toggleParticipantsPane');
  }, [executeJitsiCommand]);

  // Whiteboard
  const toggleWhiteboard = useCallback(() => {
    return executeJitsiCommand('toggleWhiteboard');
  }, [executeJitsiCommand]);

  // Breakout rooms
  const toggleBreakoutRooms = useCallback(() => {
    return executeJitsiCommand('toggleBreakoutRooms');
  }, [executeJitsiCommand]);

  // Settings
  const toggleSettings = useCallback(() => {
    return executeJitsiCommand('toggleSettings');
  }, [executeJitsiCommand]);

  // Noise suppression
  const toggleNoiseSuppression = useCallback(() => {
    return executeJitsiCommand('toggleNoiseSuppression');
  }, [executeJitsiCommand]);

  // Echo cancellation
  const toggleEchoCancellation = useCallback(() => {
    return executeJitsiCommand('toggleEchoCancellation');
  }, [executeJitsiCommand]);

  // Layout controls
  const setTileView = useCallback((enabled) => {
    return executeJitsiCommand('setTileView', enabled);
  }, [executeJitsiCommand]);

  const setSpeakerStats = useCallback((enabled) => {
    return executeJitsiCommand('setSpeakerStats', enabled);
  }, [executeJitsiCommand]);

  // Moderator controls
  const kickParticipant = useCallback((participantId) => {
    return executeJitsiCommand('kickParticipant', participantId);
  }, [executeJitsiCommand]);

  const setParticipantRole = useCallback((participantId, role) => {
    return executeJitsiCommand('setParticipantRole', participantId, role);
  }, [executeJitsiCommand]);

  const toggleLobby = useCallback(() => {
    return executeJitsiCommand('toggleLobby');
  }, [executeJitsiCommand]);

  return {
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
    toggleBackgroundBlur,
    setVirtualBackground,
    setVideoQuality,
    toggleNoiseSuppression,
    toggleEchoCancellation,
    setTileView,
    setSpeakerStats,
    
    // Moderator actions
    muteAllParticipants,
    muteParticipant,
    lowerAllHands,
    kickParticipant,
    setParticipantRole,
    toggleLobby,
    
    // UI state setters
    setControls: (updates) => setControls(prev => ({ ...prev, ...updates }))
  };
};
