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
    link?: string;
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
    videoAdminId?: string | number;  // Meeting facilitator (who will chair the meeting)
    admin?: string | number;  // Meeting facilitator (alternative field name)
    video_admin_id?: string | number;  // Meeting facilitator (snake_case)
    // Note: added_by should NOT be included - that tracks the system admin who created the experience
    link?: string;  // Meeting link for the experience
    agenda?: Array<{
      id?: string | number;
      title: string;
      duration?: string;
    }>;
    exhibits?: Array<{
      id?: string | number;
      name: string;
      type: string;
      link?: string;
    }>;
  }) {
    try {
      console.log('📤 [EXPERIENCE SERVICE] Sending PUT request to update experience:', experienceId, data);
      const res = await apiClient.put(`/api/v1/fireteams/experience/update/${experienceId}`, data);
      console.log('📥 [EXPERIENCE SERVICE] Backend response:', res.data);
      return unwrapItem(res.data);
    } catch (error: any) {
      console.error("Error updating experience:", error);
      console.error("Error response:", error.response?.data);
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
      console.log('📤 [EXPERIENCE SERVICE] Sending POST request to add agenda step:', data);
      const res = await apiClient.post('/api/v1/fireteams/experience/agenda-step/add', data);
      console.log('📥 [EXPERIENCE SERVICE] Backend response:', res.data);
      const unwrapped = unwrapItem(res.data);
      console.log('✅ [EXPERIENCE SERVICE] Agenda step successfully saved to backend with ID:', unwrapped.id);
      return unwrapped;
    } catch (error: any) {
      console.error('❌ [EXPERIENCE SERVICE] Error adding agenda step:', error);
      console.error('❌ [EXPERIENCE SERVICE] Error response:', error.response?.data);
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
      console.log('📤 [EXPERIENCE SERVICE] Sending PUT request to update agenda step:', agendaStepId, data);
      const res = await apiClient.put(`/api/v1/fireteams/experience/agenda-step/update/${agendaStepId}`, data);
      console.log('✅ [EXPERIENCE SERVICE] Agenda step successfully updated in backend');
      return unwrapItem(res.data);
    } catch (error: any) {
      console.error('❌ [EXPERIENCE SERVICE] Error updating agenda step:', error);
      console.error('❌ [EXPERIENCE SERVICE] Error response:', error.response?.data);
      throw error;
    }
  },

  async deleteAgendaStep(agendaStepId: string | number) {
    try {
      console.log('📤 [EXPERIENCE SERVICE] Sending DELETE request for agenda step:', agendaStepId);
      const res = await apiClient.delete(`/api/v1/fireteams/experience/agenda-step/delete/${agendaStepId}`);
      console.log('✅ [EXPERIENCE SERVICE] Agenda step successfully deleted from backend');
      return res.data;
    } catch (error: any) {
      console.error('❌ [EXPERIENCE SERVICE] Error deleting agenda step:', error);
      console.error('❌ [EXPERIENCE SERVICE] Error response:', error.response?.data);
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

  // REMOVED: getExperienceDetails, getAgendaSteps, getExhibits - API endpoints not available
  // Experience details (including agenda and exhibits) should be fetched from the fireteam data instead
};