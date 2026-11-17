import { clearAuthTokens, getAuthSession, rotateAuthTokens } from '../utils/authStorage';

export async function refreshSession(request, original = getAuthSession(), onExpired = () => {}) {
  if (!original) throw new Error('No session to refresh.');
  const shared = original.storage === localStorage;
  const locks = shared && globalThis.navigator?.locks;

  function currentSession() {
    const current = getAuthSession();
    if (current?.id !== original.id) throw new Error('Session changed while refreshing.');
    return current;
  }

  async function refresh() {
    let current = currentSession();
    if (current.refreshToken !== original.refreshToken || current.accessToken !== original.accessToken)
      return current.accessToken;

    try {
      const data = await request(current.refreshToken);
      current = currentSession();
      if (current.refreshToken !== original.refreshToken || current.accessToken !== original.accessToken)
        return current.accessToken;
      rotateAuthTokens(current, data);
      return data.accessToken;
    } catch (error) {
      const expired = [400, 401, 403].includes(error.response?.status);
      // Without Web Locks, give another tab's successful rotation time to reach storage.
      if (expired && shared && !locks) await new Promise(resolve => setTimeout(resolve, 1000));
      current = currentSession();
      if (current.refreshToken !== original.refreshToken || current.accessToken !== original.accessToken)
        return current.accessToken;
      if (expired) {
        clearAuthTokens();
        onExpired();
      }
      throw error;
    }
  }

  return locks ? locks.request('veganhelper-refresh-session', refresh) : refresh();
}
