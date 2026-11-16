import { getAccessToken, getRefreshToken, storeAuthTokens } from '../utils/authStorage';

export async function refreshSession(request) {
  const original = getRefreshToken();
  const refresh = async () => {
    // Another tab may already have rotated the shared session while we waited.
    if (getRefreshToken() !== original) {
      if (getRefreshToken() && getAccessToken()) return getAccessToken();
      throw new Error('Session ended while waiting to refresh.');
    }
    const remember = localStorage.getItem('refreshToken') === original;
    try {
      const data = await request();
      // A logout or a different login must never be overwritten by a late response.
      if (getRefreshToken() !== original) throw new Error('Session changed while refreshing.');
      storeAuthTokens(data, remember);
      return data.accessToken;
    } catch (error) {
      if (getRefreshToken() !== original && getRefreshToken() && getAccessToken()) return getAccessToken();
      throw error;
    }
  };
  // Shared localStorage sessions use a browser-wide lock; sessionStorage sessions are per tab.
  if (localStorage.getItem('refreshToken') === original && globalThis.navigator?.locks) {
    return navigator.locks.request('veganhelper-refresh-session', refresh);
  }
  return refresh();
}
