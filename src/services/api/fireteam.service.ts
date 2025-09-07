import { apiClient } from './config';

function normalizeFireteamList(payload: any): any[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.fireteams)) return payload.fireteams;
  if (Array.isArray(payload?.fire_teams)) return payload.fire_teams;
  if (Array.isArray(payload?.fire_teams?.data)) return payload.fire_teams.data;
  if (Array.isArray(payload?.result)) return payload.result;
  return [];
}

function unwrapItem(payload: any): any {
  if (payload?.data && typeof payload.data === 'object') return payload.data;
  return payload;
}

export const fireteamService = {
  async getFireteams() {
    const res = await apiClient.get('/api/v1/fireteams');
    return normalizeFireteamList(res.data);
  },
  async getFireteam(id: string | number) {
    const res = await apiClient.get(`/api/v1/fireteams/${id}`);
    return unwrapItem(res.data);
  },
  async addFireteam(data: {
    cohort_id: string | number;
    title: string;
    description: string;
    date: string;
    time: string;
  }) {
    const res = await apiClient.post('/api/v1/fireteams/add', data);
    return unwrapItem(res.data);
  },
  async updateFireteam(id: string | number, data: {
    cohort_id: string | number;
    title: string;
    description: string;
    date: string;
    time: string;
  }) {
    const res = await apiClient.put(`/api/v1/fireteams/update/${id}`, data);
    return unwrapItem(res.data);
  },
  async deleteFireteam(id: string | number) {
    const res = await apiClient.delete(`/api/v1/fireteams/delete/${id}`);
    return res.data;
  },
  async addFireteamMember(data: { client_id: string | number; fire_team_id: string | number; }) {
    const res = await apiClient.post('/api/v1/fireteams/member/add', data);
    return unwrapItem(res.data);
  },
  async deleteFireteamMember(fireteamMemberId: string | number) {
    const res = await apiClient.delete(`/api/v1/fireteams/member/delete/${fireteamMemberId}`);
    return res.data;
  },
};
