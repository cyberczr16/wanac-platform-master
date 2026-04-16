import { apiClient } from './config';

export interface UserData {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  email_verified_at?: string | null;
  created_at?: string;
  has_client_profile?: boolean;
  has_coach_profile?: boolean;
}

export interface UserPayload {
  name: string;
  email: string;
  phone?: string;
  role?: string;
  status?: string;
  password?: string;
  password_confirmation?: string;
}

/**
 * Extract a flat array of users from any API response shape.
 */
function extractList(data: unknown): UserData[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.users)) return obj.users as UserData[];
    if (Array.isArray(obj.data)) return obj.data as UserData[];
    if (Array.isArray(obj.clients)) return obj.clients as UserData[];
    if (Array.isArray(obj.coaches)) return obj.coaches as UserData[];
  }
  return [];
}

/**
 * Normalise any user record into a consistent shape.
 * Handles both flat records and nested { user: {...} } shapes.
 */
export function normalizeUser(raw: Record<string, unknown>): UserData {
  const u = raw?.user as Record<string, unknown> | undefined;
  return {
    id: (raw?.id ?? u?.id ?? '') as string | number,
    name: (raw?.name ?? u?.name ?? '—') as string,
    email: (raw?.email ?? u?.email ?? '—') as string,
    phone: (raw?.phone ?? u?.phone ?? '—') as string,
    role: (raw?.role ?? u?.role ?? 'client') as string,
    status: (raw?.status ?? (raw?.is_active === false ? 'Inactive' : 'Active')) as string,
    email_verified_at: (raw?.email_verified_at ?? u?.email_verified_at ?? null) as string | null,
    created_at: (raw?.created_at ?? u?.created_at ?? '') as string,
    has_client_profile: Boolean(raw?.client ?? raw?.client_id ?? raw?.has_client_profile),
    has_coach_profile: Boolean(raw?.coach ?? raw?.coach_id ?? raw?.has_coach_profile),
  };
}

export const usersService = {
  /**
   * GET /api/v1/users — fetch ALL registered users from the users table.
   * Falls back to /api/v1/clients if /users endpoint isn't available yet.
   */
  async getUsers(): Promise<UserData[]> {
    try {
      const response = await apiClient.get('/api/v1/users');
      return extractList(response.data).map((r) => normalizeUser(r as unknown as Record<string, unknown>));
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      // If the /users endpoint doesn't exist yet (404), fall back to /clients
      if (status === 404) {
        console.warn('/api/v1/users not found — falling back to /api/v1/clients');
        const fallback = await apiClient.get('/api/v1/clients');
        return extractList(fallback.data).map((r) => normalizeUser(r as unknown as Record<string, unknown>));
      }
      throw err;
    }
  },

  /** GET /api/v1/users/:id — fetch a single user */
  async getUser(userId: string | number): Promise<UserData> {
    const response = await apiClient.get(`/api/v1/users/${userId}`);
    const raw = response.data?.user ?? response.data?.data ?? response.data;
    return normalizeUser(raw);
  },

  /** POST /api/v1/users — create a new user (admin action) */
  async createUser(data: UserPayload) {
    const response = await apiClient.post('/api/v1/users', data);
    return response.data;
  },

  /** PUT /api/v1/users/:id — update a user */
  async updateUser(userId: string | number, data: Partial<UserPayload>) {
    const response = await apiClient.put(`/api/v1/users/${userId}`, data);
    return response.data;
  },

  /** DELETE /api/v1/users/:id — remove a user */
  async deleteUser(userId: string | number) {
    const response = await apiClient.delete(`/api/v1/users/${userId}`);
    return response.data;
  },
};
