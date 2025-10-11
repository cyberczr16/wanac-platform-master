import { apiClient } from './config';

export const journalService = {
  async getJournals() {
    const response = await apiClient.get('/api/v1/journals');
    return response.data;
  },

  async addJournal({ title, content }: { title: string; content?: string }) {
    const response = await apiClient.post('/api/v1/journals/add', { title, content });
    return response.data;
  },

  async updateJournal(id: string, { title, content }: { title: string; content?: string }) {
    const response = await apiClient.put(`/api/v1/journals/${id}`, { title, content });
    return response.data;
  },

  async deleteJournal(id: string) {
    const response = await apiClient.delete(`/api/v1/journals/${id}`);
    return response.data;
  },
}; 