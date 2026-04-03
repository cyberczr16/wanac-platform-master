import { apiClient } from './config';

function unwrapItem(payload: any): any {
  if (payload?.data && typeof payload.data === 'object') return payload.data;
  return payload;
}

export const experienceService = {
  async getExperiences(fireteamId: string | number) {
    try {
      const res = await apiClient.get(`/api/v1/fireteams/experiences/${fireteamId}`);
      const data = unwrapItem(res.data);

      if (Array.isArray(data)) return data;
      if (data?.fireTeamExperiences && Array.isArray(data.fireTeamExperiences)) return data.fireTeamExperiences;
      if (data?.fireteamExperiences && Array.isArray(data.fireteamExperiences)) return data.fireteamExperiences;
      if (data?.experiences && Array.isArray(data.experiences)) return data.experiences;

      return [];
    } catch (error: any) {
      console.error("Error fetching experiences:", error.response?.data ?? error.message);
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
    title?: string;
    experience?: string;
    link?: string;
    status?: string;
    report?: string;
    summary?: string;
    admin?: string | number;
    agenda?: Array<{ id?: string | number; title: string; duration?: string }>;
    exhibits?: Array<{ id?: string | number; name: string; type: string; link?: string }>;
  }) {
    try {
      const res = await apiClient.put(`/api/v1/fireteams/experience/update/${experienceId}`, data);
      return unwrapItem(res.data);
    } catch (error: any) {
      console.error("Error updating experience:", error.response?.data ?? error.message);
      throw error;
    }
  },

  async startExperience(experienceId: string | number) {
    return { success: true };
  },

  async endExperience(experienceId: string | number) {
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
      console.error('Error adding agenda step:', error.response?.data ?? error.message);
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
      console.error('Error updating agenda step:', error.response?.data ?? error.message);
      throw error;
    }
  },

  async deleteAgendaStep(agendaStepId: string | number) {
    try {
      const res = await apiClient.delete(`/api/v1/fireteams/experience/agenda-step/delete/${agendaStepId}`);
      return res.data;
    } catch (error: any) {
      console.error('Error deleting agenda step:', error.response?.data ?? error.message);
      throw error;
    }
  },

  // Exhibit methods
  async addExhibit(data: {
    fire_team_experience_id: string | number;
    name: string;
    type: string;
    link?: string;
    file?: File | null;
  }) {
    try {
      let body: FormData | object;
      if (data.file) {
        // File upload — must use multipart/form-data so the binary is transmitted
        const formData = new FormData();
        formData.append('fire_team_experience_id', String(data.fire_team_experience_id));
        formData.append('name', data.name);
        formData.append('type', data.type);
        formData.append('file', data.file);
        if (data.link) formData.append('link', data.link);
        body = formData;
        // Do NOT set Content-Type — browser sets it automatically with the correct boundary
        const res = await apiClient.post('/api/v1/fireteams/experience/exhibit/add', body);
        return unwrapItem(res.data);
      } else {
        // Link or name-only — plain JSON is fine
        body = {
          fire_team_experience_id: data.fire_team_experience_id,
          name: data.name,
          type: data.type,
          ...(data.link ? { link: data.link } : {}),
        };
        const res = await apiClient.post('/api/v1/fireteams/experience/exhibit/add', body);
        return unwrapItem(res.data);
      }
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

  // ── Quiz questions ──────────────────────────────────────────────────────────
  /**
   * Fetch pre-work quiz questions for a given experience.
   * Backend should return an array of question objects with:
   *   { id, question, answers: string[], correctAnswerIndex: number,
   *     questionType: number, explanation?: string }
   * Only questions with questionType === 0 are pre-work MC.
   */
  async getQuizQuestions(experienceId: string | number) {
    try {
      const res = await apiClient.get(`/api/v1/fireteams/experience/${experienceId}/quiz`);
      const data = unwrapItem(res.data);
      return Array.isArray(data) ? data : (data?.questions ?? []);
    } catch (error: any) {
      console.error('Error fetching quiz questions:', error.response?.data ?? error.message);
      return [];
    }
  },

  /**
   * Submit quiz answers and get pass/fail result.
   * Returns: { passed: boolean, score: number, total: number, answers: object }
   */
  async submitQuiz(experienceId: string | number, answers: Record<string, number>) {
    try {
      const res = await apiClient.post(
        `/api/v1/fireteams/experience/${experienceId}/quiz/submit`,
        { answers }
      );
      return unwrapItem(res.data);
    } catch (error: any) {
      console.error('Error submitting quiz:', error.response?.data ?? error.message);
      throw error;
    }
  },

  /**
   * Get a single experience by ID.
   */
  async getExperience(experienceId: string | number) {
    try {
      const res = await apiClient.get(`/api/v1/fireteams/experience/${experienceId}`);
      return unwrapItem(res.data);
    } catch (error: any) {
      console.error('Error fetching experience:', error.response?.data ?? error.message);
      return null;
    }
  },
};