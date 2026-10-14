export function getAccessToken() {
  return sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken') || '';
}

export function getRefreshToken() {
  return sessionStorage.getItem('refreshToken') || localStorage.getItem('refreshToken') || '';
}

export function clearAuthTokens() {
  for (const storage of [localStorage, sessionStorage]) {
    for (const key of ['accessToken', 'refreshToken', 'token']) storage.removeItem(key);
  }
}

export function storeAuthTokens(data, rememberMe) {
  if (!data.accessToken) throw new Error('Login response did not include an access token.');
  clearAuthTokens();
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem('accessToken', data.accessToken);
  if (data.refreshToken) storage.setItem('refreshToken', data.refreshToken);
}
