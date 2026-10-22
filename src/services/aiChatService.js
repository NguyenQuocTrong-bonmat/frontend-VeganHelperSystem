import axiosInstance from '../lib/axios';

export const aiChatService = {
  async send(message, sessionId, guestSessionId) {
    const { data } = await axiosInstance.post('/ai/chat', {
      message,
      sessionId: sessionId || null,
      guestSessionId: guestSessionId || null,
    }, { timeout: 45000 });
    return data;
  },
  async history(sessionId, guestSessionId) {
    const { data } = await axiosInstance.get(`/ai/chat/${sessionId}`, {
      params: guestSessionId ? { guestSessionId } : {},
    });
    return data;
  },
};
