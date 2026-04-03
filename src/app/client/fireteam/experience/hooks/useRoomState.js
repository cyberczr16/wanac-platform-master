/**
 * useRoomState — Real-time slide synchronization via LiveKit DataChannel
 *
 * How it works:
 *   - The group leader calls advanceSlide(n) → publishes a SLIDE_CHANGE message
 *     to all participants via LiveKit's reliable data channel.
 *   - Every participant (including the leader) listens for DataReceived events.
 *     When a SLIDE_CHANGE arrives, their local activeSlide updates.
 *   - Group leader identity comes from `experience.admin` (already in your DB).
 *     If no leader is defined, we fall back to the first participant to join.
 *
 * Usage:
 *   const { activeSlide, isGroupLeader, advanceSlide } = useRoomState({
 *     roomRef,
 *     livekitReady,
 *     currentUserId,
 *     leaderUserId,       // from experience.admin — the assigned group leader
 *   });
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { RoomEvent } from 'livekit-client';

// ─── Message type constants ────────────────────────────────────────────────────
const MSG_SLIDE_CHANGE  = 'FIRETEAM_SLIDE_CHANGE';
const MSG_LEADER_CLAIM  = 'FIRETEAM_LEADER_CLAIM';
const MSG_EXHIBIT_CHANGE = 'FIRETEAM_EXHIBIT_CHANGE';
const MSG_REQUEST_SYNC  = 'FIRETEAM_REQUEST_SYNC';
const MSG_SYNC_RESPONSE = 'FIRETEAM_SYNC_RESPONSE';

// ─── Helper: publish a JSON message to all room participants ───────────────────
function publishRoomMessage(room, payload) {
  if (!room?.localParticipant) return;
  try {
    const data = new TextEncoder().encode(JSON.stringify(payload));
    room.localParticipant.publishData(data, { reliable: true });
  } catch (err) {
    console.warn('[useRoomState] publishData failed:', err);
  }
}

// ─── Hook ──────────────────────────────────────────────────────────────────────
export function useRoomState({
  roomRef,
  livekitReady,
  currentUserId,
  leaderUserId = null,       // from experience.admin — preferred group leader
  initialSlide = 0,
}) {
  const [activeSlide, setActiveSlide]         = useState(initialSlide);
  const [activeExhibitId, setActiveExhibitId] = useState(null);
  const [resolvedLeaderId, setResolvedLeaderId] = useState(leaderUserId);

  // Keep a ref so callbacks always see latest values without re-subscribing
  const activeSlideRef    = useRef(initialSlide);
  const resolvedLeaderRef = useRef(leaderUserId);

  // Sync refs on every render
  activeSlideRef.current    = activeSlide;
  resolvedLeaderRef.current = resolvedLeaderId;

  // ─── Derived: is the current user the group leader? ─────────────────────────
  const isGroupLeader =
    resolvedLeaderId !== null
      ? String(currentUserId) === String(resolvedLeaderId)
      : true; // No leader assigned yet → allow everyone to navigate (demo mode)

  // ─── Listen for incoming DataChannel messages ────────────────────────────────
  useEffect(() => {
    const room = roomRef?.current;
    if (!room || !livekitReady) return;

    const handleData = (payload, participant) => {
      let msg;
      try {
        msg = JSON.parse(new TextDecoder().decode(payload));
      } catch {
        return; // Not a JSON room-state message — ignore
      }

      switch (msg.type) {

        // ── Slide advanced by group leader ──────────────────────────────────────
        case MSG_SLIDE_CHANGE:
          if (typeof msg.step === 'number' && msg.step !== activeSlideRef.current) {
            setActiveSlide(msg.step);
          }
          break;

        // ── Group leader identity broadcast ─────────────────────────────────────
        case MSG_LEADER_CLAIM:
          if (msg.userId && resolvedLeaderRef.current === null) {
            setResolvedLeaderId(String(msg.userId));
          }
          break;

        // ── Active exhibit changed by leader ────────────────────────────────────
        case MSG_EXHIBIT_CHANGE:
          setActiveExhibitId(msg.exhibitId ?? null);
          break;

        // ── New participant joined and is requesting current state ────────────────
        case MSG_REQUEST_SYNC:
          // Only the leader responds to sync requests
          if (String(currentUserId) === String(resolvedLeaderRef.current)) {
            publishRoomMessage(room, {
              type: MSG_SYNC_RESPONSE,
              step: activeSlideRef.current,
              leaderId: resolvedLeaderRef.current,
            });
          }
          break;

        // ── Leader sent their current state to a newly joined participant ─────────
        case MSG_SYNC_RESPONSE:
          if (typeof msg.step === 'number') {
            setActiveSlide(msg.step);
          }
          if (msg.leaderId) {
            setResolvedLeaderId(String(msg.leaderId));
          }
          break;

        default:
          break; // Unknown message type — not for us
      }
    };

    room.on(RoomEvent.DataReceived, handleData);
    return () => room.off(RoomEvent.DataReceived, handleData);
  }, [roomRef, livekitReady, currentUserId]);

  // ─── When first connecting, request the current state from the leader ─────────
  useEffect(() => {
    if (!livekitReady) return;
    const room = roomRef?.current;
    if (!room) return;

    // Small delay so the leader's DataReceived listener is ready
    const timer = setTimeout(() => {
      publishRoomMessage(room, { type: MSG_REQUEST_SYNC, userId: currentUserId });
    }, 800);

    return () => clearTimeout(timer);
  }, [livekitReady, roomRef, currentUserId]);

  // ─── If leaderUserId is provided and resolvedLeaderId is null, seed it ────────
  useEffect(() => {
    if (leaderUserId && resolvedLeaderId === null) {
      setResolvedLeaderId(String(leaderUserId));
    }
  }, [leaderUserId, resolvedLeaderId]);

  // ─── Broadcast leadership claim when becoming leader ─────────────────────────
  useEffect(() => {
    if (!livekitReady || !currentUserId || !leaderUserId) return;
    if (String(currentUserId) !== String(leaderUserId)) return;

    const room = roomRef?.current;
    if (!room) return;

    publishRoomMessage(room, { type: MSG_LEADER_CLAIM, userId: currentUserId });
  }, [livekitReady, currentUserId, leaderUserId, roomRef]);

  // ─── advanceSlide: only the group leader can call this ────────────────────────
  const advanceSlide = useCallback((nextStep) => {
    if (!isGroupLeader) {
      console.warn('[useRoomState] advanceSlide called by non-leader — ignored');
      return;
    }
    setActiveSlide(nextStep);
    const room = roomRef?.current;
    publishRoomMessage(room, { type: MSG_SLIDE_CHANGE, step: nextStep });
  }, [isGroupLeader, roomRef]);

  // ─── changeExhibit: only the group leader can call this ───────────────────────
  const changeExhibit = useCallback((exhibitId) => {
    if (!isGroupLeader) return;
    setActiveExhibitId(exhibitId ?? null);
    const room = roomRef?.current;
    publishRoomMessage(room, { type: MSG_EXHIBIT_CHANGE, exhibitId: exhibitId ?? null });
  }, [isGroupLeader, roomRef]);

  return {
    activeSlide,
    activeExhibitId,
    resolvedLeaderId,
    isGroupLeader,
    advanceSlide,
    changeExhibit,
  };
}
