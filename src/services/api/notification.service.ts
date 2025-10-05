import { apiClient } from './config';

export interface NotificationData {
  user_id: string | number;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error' | 'fireteam';
  metadata?: {
    fireteam_id?: string | number;
    experience_id?: string | number;
    [key: string]: any;
  };
}

export const notificationService = {
  /**
   * Send a notification to a user
   * @param data - Notification data including user_id, title, message, and optional metadata
   * @returns The created notification response
   */
  async sendNotification(data: NotificationData) {
    try {
      const response = await apiClient.post('/api/v1/notifications/send', data);
      console.log('Notification sent successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error sending notification:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  /**
   * Get all notifications for the current user
   * @returns Array of notifications
   */
  async getNotifications() {
    try {
      const response = await apiClient.get('/api/v1/notifications');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  /**
   * Mark a notification as read
   * @param notificationId - The ID of the notification to mark as read
   */
  async markAsRead(notificationId: string | number) {
    try {
      const response = await apiClient.put(`/api/v1/notifications/${notificationId}/read`);
      return response.data;
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  /**
   * Delete a notification
   * @param notificationId - The ID of the notification to delete
   */
  async deleteNotification(notificationId: string | number) {
    try {
      const response = await apiClient.delete(`/api/v1/notifications/${notificationId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }
};

