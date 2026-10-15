import axiosInstance from '../lib/axios';

const notificationService = {
  getNotifications: async (pageIndex = 1, pageSize = 20, unreadOnly = false, signal) => {
    const response = await axiosInstance.get('/notifications', {
      signal,
      params: { pageIndex, pageSize, unreadOnly }
    });
    return response.data;
  },

  getUnreadCount: async (signal) => {
    const response = await axiosInstance.get('/notifications/unread-count', { signal });
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await axiosInstance.patch(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await axiosInstance.patch('/notifications/read-all');
    return response.data;
  },
  getPushConfig: async () => (await axiosInstance.get('/notifications/push/config')).data,
  subscribePush: async subscription => (await axiosInstance.post('/notifications/push/subscriptions', subscription)).data,
  unsubscribePush: async id => axiosInstance.delete(`/notifications/push/subscriptions/${id}`),
};

export default notificationService;
