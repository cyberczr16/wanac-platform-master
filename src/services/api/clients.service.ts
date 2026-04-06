import { apiClient } from './config';

export const clientsService = {
  async getClients() {
    const response = await apiClient.get('/api/v1/clients');
    return response.data;
  },

  /**
   * Fetch progress data for a specific client (whole life, daily habits, insights).
   * Backend may expose GET /api/v1/clients/:id/progress or similar.
   */
  async getClientProgress(clientId: string | number) {
    try {
      const response = await apiClient.get(`/api/v1/clients/${clientId}/progress`);
      return response.data;
    } catch {
      return null;
    }
  },

  /**
   * Admin/coach update of a client profile. Backend: PUT /api/v1/clients/:id
   */
  async updateClient(
    clientId: string | number,
    data: Partial<{ name: string; email: string; phone: string; status: string }>
  ) {
    const response = await apiClient.put(`/api/v1/clients/${clientId}`, data);
    return response.data;
  },

  async searchClients(query: string) {
    const all = await this.getClients();
    if (!Array.isArray(all)) return [];
    return all.filter(client =>
      (client.name && client.name.toLowerCase().includes(query.toLowerCase())) ||
      (client.email && client.email.toLowerCase().includes(query.toLowerCase()))
    );
  },
}; 