import { apiClient } from './config';

export const cohortService = {
  async getCohorts() {
    const response = await apiClient.get('/api/v1/cohorts');
    return response.data;
  },
};
