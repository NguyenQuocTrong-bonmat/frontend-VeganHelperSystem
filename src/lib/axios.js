import axios from 'axios';
import { clearAuthTokens, getAuthSession } from '../utils/authStorage';
import { refreshSession } from './refreshSession';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7180/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});
const pendingRefreshes = new Map();

axiosInstance.interceptors.request.use(config => {
  const session = getAuthSession();
  if (config._retry && session?.id !== config._sessionId)
    throw new axios.CanceledError('Session changed before retrying the request.');
  config._sessionId = session?.id;
  config.headers = config.headers || {};
  if (session) config.headers.Authorization = `Bearer ${session.accessToken}`;
  else delete config.headers.Authorization;
  return config;
});

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const original = error.config || {};
    const url = original.url || '';
    const session = getAuthSession();
    if (error.response?.status !== 401 || original._retry || original.skipAuthRedirect ||
        url.includes('/auth/refresh') || url.includes('/auth/login') ||
        !session || session.id !== original._sessionId)
      throw error;

    original._retry = true;
    const redirectToLogin = () => { window.location.href = '/login'; };
    if (original.headers?.Authorization === `Bearer ${session.accessToken}`) {
      if (!session.refreshToken) {
        clearAuthTokens();
        redirectToLogin();
        throw error;
      }

      let pending = pendingRefreshes.get(session.id);
      if (!pending) {
        pending = refreshSession(refreshToken =>
          axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken }, { timeout: 10000 })
            .then(response => response.data), session, redirectToLogin)
          .finally(() => pendingRefreshes.delete(session.id));
        pendingRefreshes.set(session.id, pending);
      }
      await pending;
    }

    return axiosInstance(original);
  }
);

export default axiosInstance;
