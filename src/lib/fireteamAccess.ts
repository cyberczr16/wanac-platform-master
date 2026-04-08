/**
 * Fireteam membership access utilities.
 *
 * Provides helpers to determine whether the currently logged-in client user
 * is a member of a given fireteam, and to filter fireteam lists accordingly.
 *
 * NOTE: This is a **frontend-only** guard.  The backend API should enforce
 * the same membership rules server-side — treat this as defense-in-depth.
 */

import { fireteamService } from '@/services/api/fireteam.service';

/* ─── Current user helpers ─────────────────────────────────────────────────── */

export interface WanacUser {
  id?: string | number;
  user_id?: string | number;
  email?: string;
  name?: string;
  userType?: string;
  role?: string;
  [key: string]: unknown;
}

/**
 * Read the logged-in user object that the login page persists to localStorage.
 * Returns `null` when running on the server or when no user is stored.
 */
export function getCurrentUser(): WanacUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('wanacUser');
    if (!raw) return null;
    return JSON.parse(raw) as WanacUser;
  } catch {
    return null;
  }
}

/**
 * Extract a stable numeric/string user id from the stored user object.
 * The backend may use `id`, `user_id`, or both — we try each.
 */
export function getCurrentUserId(): string | null {
  const u = getCurrentUser();
  if (!u) return null;
  const id = u.id ?? u.user_id;
  return id != null ? String(id) : null;
}

/**
 * Returns `true` when the current session belongs to a *client* role.
 * Admins and coaches are NOT subject to fireteam membership restrictions.
 */
export function isClientRole(): boolean {
  const u = getCurrentUser();
  if (!u) return false;
  const role = (u.userType ?? u.role ?? '').toString().toLowerCase();
  return role === 'client';
}

/* ─── Membership check ─────────────────────────────────────────────────────── */

/**
 * Normalise the many shapes a "member" row can have (the API sometimes nests
 * the user object under `.user`, sometimes flattens it).
 */
function memberMatchesUser(member: Record<string, any>, userId: string): boolean {
  const candidateIds: (string | number | undefined | null)[] = [
    member.client_id,
    member.user_id,
    member.id,
    member.user?.id,
    member.user?.user_id,
  ];
  return candidateIds.some((cid) => cid != null && String(cid) === userId);
}

/**
 * Check whether the current user appears in a fireteam's member list.
 *
 * @param fireteamId  The fireteam to check.
 * @returns `true` if the user is a member, `false` otherwise.
 *          Also returns `true` for non-client roles (admins/coaches bypass).
 */
export async function isCurrentUserMemberOf(fireteamId: string | number): Promise<boolean> {
  // Non-client roles are unrestricted
  if (!isClientRole()) return true;

  const userId = getCurrentUserId();
  if (!userId) return false;

  try {
    const members = await fireteamService.getFireteamMembers(fireteamId);
    return members.some((m: Record<string, any>) => memberMatchesUser(m, userId));
  } catch {
    // If we can't verify membership, deny access as a precaution
    return false;
  }
}

/**
 * Given a pre-fetched member array, synchronously check whether the current
 * user is in it.  Useful when you've already loaded the members list.
 */
export function isUserInMemberList(members: Record<string, any>[]): boolean {
  if (!isClientRole()) return true;
  const userId = getCurrentUserId();
  if (!userId) return false;
  return members.some((m) => memberMatchesUser(m, userId));
}

/**
 * Filter a list of fireteams to only those the current user belongs to.
 *
 * For each fireteam we fetch its member list and keep only the ones where
 * the user appears.  Non-client roles get the full list back unfiltered.
 */
export async function filterFireteamsByMembership<T extends { id: string | number }>(
  fireteams: T[]
): Promise<T[]> {
  if (!isClientRole()) return fireteams;

  const userId = getCurrentUserId();
  if (!userId) return [];

  const results = await Promise.allSettled(
    fireteams.map(async (ft) => {
      const members = await fireteamService.getFireteamMembers(ft.id);
      const isMember = members.some((m: Record<string, any>) => memberMatchesUser(m, userId));
      return { ft, isMember };
    })
  );

  return results
    .filter((r): r is PromiseFulfilledResult<{ ft: T; isMember: boolean }> => r.status === 'fulfilled' && r.value.isMember)
    .map((r) => r.value.ft);
}
