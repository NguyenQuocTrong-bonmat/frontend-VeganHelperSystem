import axiosInstance from '../lib/axios';

export const aiChatService = {
  async send(message, sessionId, guestSessionId, { signal } = {}) {
    const { data } = await axiosInstance.post('/ai/chat', {
      message,
      sessionId: sessionId || null,
      guestSessionId: guestSessionId || null,
    }, { timeout: 75000, signal });
    return data;
  },
  async history(sessionId, guestSessionId, { signal } = {}) {
    const { data } = await axiosInstance.get(`/ai/chat/${sessionId}`, {
      params: guestSessionId ? { guestSessionId } : {},
      signal,
    });
    return data;
  },
};
