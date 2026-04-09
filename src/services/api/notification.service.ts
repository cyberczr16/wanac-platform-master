import { apiClient } from './config';

export interface NotificationData {
  user_id?: string | number;
  title: string;
  message: string;
  type?: string;
  data?: Record<string, any>;
}

export const notificationService = {
  /**
   * Send a notification to a user
   * @param data - Notification payload for creating a notification
   * @returns The created notification response
   */
  async sendNotification(data: NotificationData) {
    try {
      const response = await apiClient.post('/api/v1/notifications/add', data);
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
      const response = await apiClient.patch(`/api/v1/notifications/${notificationId}/read`);
      return response.data;
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead() {
    try {
      const response = await apiClient.patch('/api/v1/notifications/read-all');
      return response.data;
    } catch (error: any) {
      console.error('Error marking all notifications as read:', error);
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

