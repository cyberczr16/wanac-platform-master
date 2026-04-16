/**
 * LiveKit access tokens use a unique `identity` per connection. We combine:
 *   canonical user id (WANAC `user_id` or a stable anonymous id for this tab)
 *   + a tab-scoped suffix so the same logged-in user can open two tabs without colliding.
 *
 * Format: `${canonicalId}${LIVEKIT_IDENTITY_SEP}${tabSuffix}`
 * Display name is separate (WANAC `user_name`).
 */

export const LIVEKIT_IDENTITY_SEP = '__wk__';

export function getCanonicalUserIdForSession(): string {
  if (typeof window === 'undefined') return 'anonymous';
  const fromStored = localStorage.getItem('user_id');
  if (fromStored && fromStored.trim()) return fromStored.trim();
  let anon = sessionStorage.getItem('wanac_anon_user_id');
  if (!anon) {
    anon =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? `anon_${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`
        : `anon_${Date.now()}`;
    sessionStorage.setItem('wanac_anon_user_id', anon);
  }
  return anon;
}

export function getLiveKitTabSuffix(): string {
  if (typeof window === 'undefined') return 'tab';
  let s = sessionStorage.getItem('livekit_tab_suffix');
  if (!s) {
    s =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID().replace(/-/g, '').slice(0, 12)
        : String(Date.now());
    sessionStorage.setItem('livekit_tab_suffix', s);
  }
  return s;
}

export function buildLiveKitIdentityForToken(): { identity: string; displayName: string } {
  const canonical = getCanonicalUserIdForSession();
  const suffix = getLiveKitTabSuffix();
  const identity = `${canonical}${LIVEKIT_IDENTITY_SEP}${suffix}`;
  const displayName =
    (typeof window !== 'undefined' && localStorage.getItem('user_name')?.trim()) ||
    (typeof window !== 'undefined' && localStorage.getItem('user_email')?.split('@')[0]) ||
    'Participant';
  return { identity, displayName };
}

/** Map LiveKit participant.identity to the WANAC user id used in APIs and evaluation. */
export function canonicalParticipantIdFromIdentity(identity: string | undefined | null): string {
  if (identity == null || identity === '') return '';
  const s = String(identity);
  const idx = s.indexOf(LIVEKIT_IDENTITY_SEP);
  if (idx === -1) return s;
  return s.slice(0, idx);
}

/** True if evaluation row matches the logged-in client (handles legacy ids without suffix). */
export function evaluationParticipantMatchesCurrentUser(
  evaluationParticipantId: string | undefined | null,
  currentUserId: string | null | undefined
): boolean {
  if (!evaluationParticipantId || !currentUserId) return false;
  const canon = canonicalParticipantIdFromIdentity(evaluationParticipantId);
  return canon === currentUserId || evaluationParticipantId === currentUserId;
}
