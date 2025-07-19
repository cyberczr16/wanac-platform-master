import { apiClient } from './config';

export const clientsService = {
  async getClients() {
    const response = await apiClient.get('/api/v1/clients');
    return response.data;
  },
}; 