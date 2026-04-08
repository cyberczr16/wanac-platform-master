import { apiClient } from './config';

export interface ClientData {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  status: string;
  role?: string;
  user?: {
    id?: string | number;
    name?: string;
    email?: string;
    phone?: string;
    role?: string;
  };
}

export interface ClientPayload {
  name: string;
  email: string;
  phone?: string;
  status?: string;
  role?: string;
  password?: string;
  password_confirmation?: string;
}

/**
 * Extract a flat array of clients from any API response shape.
 */
function extractList(data: unknown): ClientData[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.clients)) return obj.clients as ClientData[];
    if (Array.isArray(obj.data)) return obj.data as ClientData[];
    if (Array.isArray(obj.users)) return obj.users as ClientData[];
  }
  return [];
}

/**
 * Normalise any client/user record into a consistent shape.
 */
export function normalizeClient(raw: Record<string, unknown>): ClientData {
  const u = raw?.user as Record<string, unknown> | undefined;
  return {
    id: (raw?.id ?? raw?.user_id ?? u?.id ?? '') as string | number,
    name: (u?.name ?? raw?.name ?? '—') as string,
    email: (u?.email ?? raw?.email ?? '—') as string,
    phone: (u?.phone ?? raw?.phone ?? '—') as string,
    status: (raw?.status ?? 'Active') as string,
    role: (u?.role ?? raw?.role ?? 'client') as string,
  };
}

export const clientsService = {
  /** GET /api/v1/clients – fetch all clients */
  async getClients(): Promise<ClientData[]> {
    const response = await apiClient.get('/api/v1/clients');
    return extractList(response.data).map((r) => normalizeClient(r as unknown as Record<string, unknown>));
  },

  /** GET /api/v1/clients/:id – fetch a single client */
  async getClient(clientId: string | number): Promise<ClientData> {
    const response = await apiClient.get(`/api/v1/clients/${clientId}`);
    const raw = response.data?.client ?? response.data?.data ?? response.data;
    return normalizeClient(raw);
  },

  /** POST /api/v1/clients – create a new client */
  async createClient(data: ClientPayload) {
    const response = await apiClient.post('/api/v1/clients', data);
    return response.data;
  },

  /** PUT /api/v1/clients/:id – update an existing client */
  async updateClient(
    clientId: string | number,
    data: Partial<ClientPayload>,
  ) {
    const response = await apiClient.put(`/api/v1/clients/${clientId}`, data);
    return response.data;
  },

  /** DELETE /api/v1/clients/:id – remove a client */
  async deleteClient(clientId: string | number) {
    const response = await apiClient.delete(`/api/v1/clients/${clientId}`);
    return response.data;
  },

  /** GET /api/v1/clients/:id/progress – fetch client progress data */
  async getClientProgress(clientId: string | number) {
    try {
      const response = await apiClient.get(`/api/v1/clients/${clientId}/progress`);
      return response.data;
    } catch {
      return null;
    }
  },
};
