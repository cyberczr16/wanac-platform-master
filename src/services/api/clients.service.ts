import { apiClient } from './config';

export const clientsService = {
  async getClients() {
    const response = await apiClient.get('/api/v1/clients');
    return response.data;
  },
  async searchClients(query) {
    const all = await this.getClients();
    if (!Array.isArray(all)) return [];
    return all.filter(client =>
      (client.name && client.name.toLowerCase().includes(query.toLowerCase())) ||
      (client.email && client.email.toLowerCase().includes(query.toLowerCase()))
    );
  },
}; 