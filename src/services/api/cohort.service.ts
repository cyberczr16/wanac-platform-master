import { apiClient } from './config';

export const cohortService = {
  async getCohorts() {
    const response = await apiClient.get('/api/v1/cohorts');
    return response.data;
  },
  async addCohortMember(data: { cohort_id: number; member_id: number; role: string }) {
    console.log('API call with data:', data);
    
    // Prepare payload based on role
    const payload = {
      cohort_id: data.cohort_id,
      [data.role === 'client' ? 'client_id' : 'coach_id']: data.member_id
    };
    
    console.log('API payload:', payload);
    const response = await apiClient.post('/api/v1/programs/cohort-member/add', payload);
    console.log('API response:', response.data);
    return response.data;
  },
  async getCoaches() {
    const response = await apiClient.get('/api/v1/coaches');
    return response.data;
  },
};
