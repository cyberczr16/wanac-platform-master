/**
 * Meeting room utility functions for LiveKit.
 */

/**
 * Generate a unique LiveKit room name for a fireteam experience.
 * Format: wanac-ft{fireteamId}-exp{experienceId}-{randomToken}
 *
 * This is the value stored in experience.link and passed as the
 * LiveKit room parameter when joining sessions.
 */
export function generateRoomName(
  fireteamId: string | number,
  experienceId: string | number,
): string {
  const uid =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID().replace(/-/g, '').slice(0, 10)
      : Date.now().toString(36);

  return `wanac-ft${fireteamId}-exp${experienceId}-${uid}`;
}

/**
 * Generate a LiveKit room name for a fireteam experience.
 * Generates a LiveKit room name for a fireteam experience.
 *
 * @param fireteamId   - The fireteam ID
 * @param experienceId - The experience ID
 * @param _adminId     - Unused (kept for API compatibility)
 * @param _adminName   - Unused (kept for API compatibility)
 */
export function generateFireteamMeetingLink(
  fireteamId: string | number,
  experienceId: string | number,
  _adminId?: string | number,
  _adminName?: string,
): string {
  return generateRoomName(fireteamId, experienceId);
}

/**
 * Extract the room name from a value — either a plain room name string
 * or a legacy URL (for backward compatibility with previously saved links).
 */
export function extractRoomNameFromUrl(value: string): string | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    // Legacy URL — extract the path segment as the room name
    if (url.hostname === 'meet.jit.si' || url.hostname === '8x8.vc') {
      const parts = url.pathname.split('/').filter(Boolean);
      return parts[parts.length - 1] || null;
    }
    // Any other URL — not a room name we recognise
    return null;
  } catch {
    // Not a URL at all — treat the raw string as the LiveKit room name
    return value;
  }
}
