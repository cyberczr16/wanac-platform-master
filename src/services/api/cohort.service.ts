import { apiClient } from './config';

export interface CoachData {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  specialty?: string;
  bio?: string;
  user?: {
    id?: string | number;
    name?: string;
    email?: string;
    phone?: string;
    role?: string;
  };
}

export interface CoachPayload {
  name: string;
  email: string;
  phone?: string;
  specialty?: string;
  bio?: string;
  status?: string;
  password?: string;
  password_confirmation?: string;
}

/**
 * Extract a flat array from any API response shape.
 */
function extractList(data: unknown): CoachData[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.coaches)) return obj.coaches as CoachData[];
    if (obj.coaches && typeof obj.coaches === 'object') {
      const nested = obj.coaches as Record<string, unknown>;
      if (Array.isArray(nested.data)) return nested.data as CoachData[];
    }
    if (Array.isArray(obj.data)) return obj.data as CoachData[];
  }
  return [];
}

/**
 * Normalise any coach record into a consistent shape.
 */
export function normalizeCoach(raw: Record<string, unknown>): CoachData {
  const u = raw?.user as Record<string, unknown> | undefined;
  return {
    id: (raw?.id ?? raw?.user_id ?? u?.id ?? '') as string | number,
    name: (u?.name ?? raw?.name ?? '—') as string,
    email: (u?.email ?? raw?.email ?? '—') as string,
    phone: (u?.phone ?? raw?.phone ?? '—') as string,
    role: (u?.role ?? raw?.role ?? 'Coach') as string,
    status: (raw?.status ?? (raw?.is_active ? 'Active' : 'Inactive')) as string,
    specialty: (raw?.specialty ?? '') as string,
    bio: (raw?.bio ?? '') as string,
  };
}

export const cohortService = {
  /** GET /api/v1/coaches – fetch all coaches */
  async getCoaches(): Promise<CoachData[]> {
    const response = await apiClient.get('/api/v1/coaches');
    return extractList(response.data).map((r) => normalizeCoach(r as unknown as Record<string, unknown>));
  },

  /** GET /api/v1/coaches/:id – fetch a single coach */
  async getCoach(coachId: string | number): Promise<CoachData> {
    const response = await apiClient.get(`/api/v1/coaches/${coachId}`);
    const raw = response.data?.coach ?? response.data?.data ?? response.data;
    return normalizeCoach(raw);
  },

  /** POST /api/v1/coaches – create a new coach */
  async createCoach(data: CoachPayload) {
    const response = await apiClient.post('/api/v1/coaches', data);
    return response.data;
  },

  /** PUT /api/v1/coaches/:id – update an existing coach */
  async updateCoach(coachId: string | number, data: Partial<CoachPayload>) {
    const response = await apiClient.put(`/api/v1/coaches/${coachId}`, data);
    return response.data;
  },

  /** DELETE /api/v1/coaches/:id – remove a coach */
  async deleteCoach(coachId: string | number) {
    const response = await apiClient.delete(`/api/v1/coaches/${coachId}`);
    return response.data;
  },

  /** GET /api/v1/cohorts – fetch all cohorts */
  async getCohorts() {
    const response = await apiClient.get('/api/v1/cohorts');
    return response.data;
  },

  /** POST /api/v1/programs/cohort/add – create a new cohort */
  async createCohort(data: {
    program_id: string | number;
    name: string;
    description?: string;
    start_date?: string;
    end_date?: string;
    coaches?: number[];
    clients?: number[];
  }) {
    const response = await apiClient.post('/api/v1/programs/cohort/add', {
      program_id: data.program_id,
      name: data.name,
      description: data.description ?? '',
      start_date: data.start_date ?? '',
      end_date: data.end_date ?? '',
      coaches: data.coaches ?? [],
      clients: data.clients ?? [],
    });
    return response.data;
  },

  /** POST /api/v1/programs/cohort-member/add – add member to cohort */
  async addCohortMember(data: { cohort_id: number; member_id: number; role: string }) {
    const payload = {
      cohort_id: data.cohort_id,
      [data.role === 'client' ? 'client_id' : 'coach_id']: data.member_id,
    };
    const response = await apiClient.post('/api/v1/programs/cohort-member/add', payload);
    return response.data;
  },
};
