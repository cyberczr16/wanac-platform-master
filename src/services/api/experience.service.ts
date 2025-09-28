import { apiClient } from './config';

function unwrapItem(payload: any): any {
  if (payload?.data && typeof payload.data === 'object') return payload.data;
  return payload;
}

export const experienceService = {
  async getExperiences(fireteamId: string | number) {
    try {
      const res = await apiClient.get(`/api/v1/fireteams/experiences/${fireteamId}`);
      console.log("Raw API response for getExperiences:", res.data);
      const data = unwrapItem(res.data);
      
      // Handle different response formats
      if (Array.isArray(data)) {
        console.log("Data is array, returning directly:", data);
        return data;
      }
      
      // Check for fireTeamExperiences key (from the console logs)
      if (data.fireTeamExperiences && Array.isArray(data.fireTeamExperiences)) {
        console.log("Found fireTeamExperiences array:", data.fireTeamExperiences);
        return data.fireTeamExperiences;
      }
      
      // Check for fireteamExperiences key (alternative naming)
      if (data.fireteamExperiences && Array.isArray(data.fireteamExperiences)) {
        console.log("Found fireteamExperiences array:", data.fireteamExperiences);
        return data.fireteamExperiences;
      }
      
      // Check for experiences key
      if (data.experiences && Array.isArray(data.experiences)) {
        console.log("Found experiences array:", data.experiences);
        return data.experiences;
      }
      
      console.log("No valid array found in response, returning empty array");
      return [];
    } catch (error: any) {
      console.error("Error fetching experiences:", error);
      console.error("Error response:", error.response?.data);
      return [];
    }
  },

  async addExperience(data: {
    fire_team_id: string | number;
    title: string;
    experience: string;
  }) {
    try {
      const res = await apiClient.post('/api/v1/fireteams/experience/add', data);
      return unwrapItem(res.data);
    } catch (error: any) {
      console.error("Error adding experience:", error);
      throw error;
    }
  },

  async deleteExperience(experienceId: string | number) {
    try {
      const res = await apiClient.delete(`/api/v1/fireteams/experience/delete/${experienceId}`);
      return res.data;
    } catch (error: any) {
      console.error("Error deleting experience:", error);
      throw error;
    }
  },

  async updateExperience(experienceId: string | number, data: {
    title: string;
    experience: string;
  }) {
    try {
      const res = await apiClient.put(`/api/v1/fireteams/experience/update/${experienceId}`, data);
      return unwrapItem(res.data);
    } catch (error: any) {
      console.error("Error updating experience:", error);
      throw error;
    }
  },

  async startExperience(experienceId: string | number) {
    // This might need to be implemented based on your backend
    // For now, just return success
    console.log("Starting experience:", experienceId);
    return { success: true };
  },

  async endExperience(experienceId: string | number) {
    // This might need to be implemented based on your backend
    // For now, just return success
    console.log("Ending experience:", experienceId);
    return { success: true };
  },

  async addAgendaStep(data: {
    fire_team_experience_id: string | number;
    title: string;
    description?: string;
    duration?: string;
    order?: number;
  }) {
    try {
      const res = await apiClient.post('/api/v1/fireteams/experience/agenda-step/add', data);
      return unwrapItem(res.data);
    } catch (error: any) {
      console.error('Error adding agenda step:', error);
      throw error;
    }
  },

  async updateAgendaStep(agendaStepId: string | number, data: {
    title?: string;
    description?: string;
    duration?: string;
    order?: number;
  }) {
    try {
      const res = await apiClient.put(`/api/v1/fireteams/experience/agenda-step/update/${agendaStepId}`, data);
      return unwrapItem(res.data);
    } catch (error: any) {
      console.error('Error updating agenda step:', error);
      throw error;
    }
  },

  async deleteAgendaStep(agendaStepId: string | number) {
    try {
      const res = await apiClient.delete(`/api/v1/fireteams/experience/agenda-step/delete/${agendaStepId}`);
      return res.data;
    } catch (error: any) {
      console.error('Error deleting agenda step:', error);
      throw error;
    }
  },

  // Exhibit methods
  async addExhibit(data: {
    fire_team_experience_id: string | number;
    name: string;
    type: string;
    link?: string;
  }) {
    try {
      const res = await apiClient.post('/api/v1/fireteams/experience/exhibit/add', data);
      return unwrapItem(res.data);
    } catch (error: any) {
      console.error('Error adding exhibit:', error);
      throw error;
    }
  },


  async updateExhibit(exhibitId: string | number, data: {
    name?: string;
    type?: string;
    link?: string;
  }) {
    try {
      const res = await apiClient.put(`/api/v1/fireteams/experience/exhibit/update/${exhibitId}`, data);
      return unwrapItem(res.data);
    } catch (error: any) {
      console.error('Error updating exhibit:', error);
      throw error;
    }
  },

  async deleteExhibit(exhibitId: string | number) {
    try {
      const res = await apiClient.delete(`/api/v1/fireteams/experience/exhibit/delete/${exhibitId}`);
      return res.data;
    } catch (error: any) {
      console.error('Error deleting exhibit:', error);
      throw error;
    }
  },

  // Additional methods that might be needed based on the API documentation
  async getExperienceDetails(experienceId: string | number) {
    try {
      const res = await apiClient.get(`/api/v1/fireteams/experience/${experienceId}`);
      return unwrapItem(res.data);
    } catch (error: any) {
      console.error('Error fetching experience details:', error);
      throw error;
    }
  },

  async getAgendaSteps(experienceId: string | number) {
    try {
      const res = await apiClient.get(`/api/v1/fireteams/experience/${experienceId}/agenda-steps`);
      return unwrapItem(res.data);
    } catch (error: any) {
      console.error('Error fetching agenda steps:', error);
      return [];
    }
  },

  async getExhibits(experienceId: string | number) {
    try {
      const res = await apiClient.get(`/api/v1/fireteams/experience/${experienceId}/exhibits`);
      return unwrapItem(res.data);
    } catch (error: any) {
      console.error('Error fetching exhibits:', error);
      return [];
    }
  }
};