import axiosInstance from '../lib/axios';

const notificationService = {
  getNotifications: async (pageIndex = 1, pageSize = 20, unreadOnly = false) => {
    const response = await axiosInstance.get('/api/notifications', {
      params: { pageIndex, pageSize, unreadOnly }
    });
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await axiosInstance.get('/api/notifications/unread-count');
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await axiosInstance.patch(`/api/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await axiosInstance.patch('/api/notifications/read-all');
    return response.data;
  }
};

export default notificationService;
