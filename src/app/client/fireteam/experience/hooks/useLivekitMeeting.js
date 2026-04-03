import { useEffect, useRef, useState, useCallback } from 'react';
import { Room, RoomEvent, setLogLevel, LogLevel } from 'livekit-client';

// LiveKit meeting hook — manages room connection, participants, and chat.

setLogLevel(LogLevel.info);

export function useLivekitMeeting() {
  const roomRef = useRef(null);
  const [livekitReady, setLivekitReady] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [meetingStartTime, setMeetingStartTime] = useState(null);
  const [attendanceLog, setAttendanceLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateParticipantsFromRoom = useCallback((room) => {
    if (!room) return;
    const list = room.participants
      ? Array.from(room.participants.values())
      : [];
    const local = room.localParticipant;
    if (local) list.unshift(local);

    const mapped = list.map((p) => ({
      id: p.identity,
      name: p.name || p.identity || 'Participant',
      avatarUrl: null,
      speaking: p.isSpeaking,
    }));
    setParticipants(mapped);
  }, []);

  const initializeMeeting = useCallback(async (_domain, roomName) => {
    setLoading(true);
    setError('');
    try {
      const resp = await fetch(
        `/api/livekit/token?roomName=${encodeURIComponent(roomName)}`,
        { cache: 'no-store' },
      );
      if (!resp.ok) {
        const body = await resp.json().catch(() => ({}));
        throw new Error(body?.error || `Failed to fetch LiveKit token (${resp.status})`);
      }
      const data = await resp.json();
      const { token, url } = data;
      if (!token || !url) {
        throw new Error('LiveKit token response missing token or url');
      }

      const room = new Room();
      roomRef.current = room;

      room
        .on(RoomEvent.ParticipantConnected, () => {
          updateParticipantsFromRoom(room);
          setAttendanceLog((prev) => [...prev, { type: 'join', at: new Date().toISOString() }]);
        })
        .on(RoomEvent.ParticipantDisconnected, () => {
          updateParticipantsFromRoom(room);
          setAttendanceLog((prev) => [...prev, { type: 'leave', at: new Date().toISOString() }]);
        })
        .on(RoomEvent.ActiveSpeakersChanged, () => {
          updateParticipantsFromRoom(room);
        })
        .on(RoomEvent.DataReceived, (payload, participant) => {
          try {
            const text = new TextDecoder().decode(payload);
            setChatMessages((prev) => [
              ...prev,
              {
                id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                sender: participant?.name || participant?.identity || 'Participant',
                message: text,
                timestamp: new Date().toISOString(),
              },
            ]);
          } catch {
            // ignore malformed data
          }
        });

      await room.connect(url, token);
      setMeetingStartTime(new Date());
      updateParticipantsFromRoom(room);
      setLivekitReady(true);
    } catch (err) {
      console.error('❌ LiveKit initialization error:', err);
      setError(err.message || 'Failed to join LiveKit room');
    } finally {
      setLoading(false);
    }
  }, [updateParticipantsFromRoom]);

  const leaveMeeting = useCallback(() => {
    if (roomRef.current) {
      roomRef.current.disconnect();
      roomRef.current = null;
    }
    setLivekitReady(false);
    setParticipants([]);
  }, []);

  const sendChatMessage = useCallback(async (message) => {
    const room = roomRef.current;
    if (!room) return;
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(message);
      await room.localParticipant.publishData(data);
      setChatMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          sender: 'You',
          message,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      console.error('❌ Failed to send LiveKit chat message:', err);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (roomRef.current) {
        roomRef.current.disconnect();
        roomRef.current = null;
      }
    };
  }, []);

  return {
    roomRef,
    livekitReady,
    participants,
    chatMessages,
    sendChatMessage,
    meetingStartTime,
    attendanceLog,
    loading,
    error,
    initializeMeeting,
    leaveMeeting,
  };
}

