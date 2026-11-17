function readSession() {
  const storage = sessionStorage.getItem('accessToken') ? sessionStorage : localStorage;
  const accessToken = storage.getItem('accessToken');
  if (!accessToken) return null;

  let id = storage.getItem('authSessionId');
  if (!id) {
    // Existing tabs may still have credentials created before session IDs were introduced.
    id = globalThis.crypto.randomUUID();
    storage.setItem('authSessionId', id);
    id = storage.getItem('authSessionId');
  }
  return { id, storage, accessToken, refreshToken: storage.getItem('refreshToken') || '' };
}

export const getAuthSession = readSession;

export function getAccessToken() {
  return readSession()?.accessToken || '';
}

export function getRefreshToken() {
  return readSession()?.refreshToken || '';
}

export function clearAuthTokens() {
  for (const storage of [localStorage, sessionStorage]) {
    for (const key of ['authSessionId', 'accessToken', 'refreshToken', 'token']) storage.removeItem(key);
  }
}

function writeTokens(storage, data) {
  if (data.refreshToken) storage.setItem('refreshToken', data.refreshToken);
  else storage.removeItem('refreshToken');
  storage.setItem('accessToken', data.accessToken);
}

export function storeAuthTokens(data, rememberMe) {
  if (!data.accessToken) throw new Error('Login response did not include an access token.');
  clearAuthTokens();
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem('authSessionId', globalThis.crypto.randomUUID());
  writeTokens(storage, data);
}

export function rotateAuthTokens(session, data) {
  if (!data.accessToken || !data.refreshToken) throw new Error('Refresh response did not include both tokens.');
  writeTokens(session.storage, data);
}
