import axios from 'axios';
import { vi } from 'vitest';
import client from './axios';
import { clearAuthTokens, storeAuthTokens } from '../utils/authStorage';
const adapter = client.defaults.adapter;
beforeEach(() => {
  storeAuthTokens({ accessToken: 'expired', refreshToken: 'remembered-refresh' }, true);
  client.defaults.adapter = async config => { throw Object.assign(new Error('Expired'), { config, response: { status: 401 } }); };
});
afterEach(() => { client.defaults.adapter = adapter; clearAuthTokens(); vi.restoreAllMocks(); });
test.each([undefined, 503])('temporary refresh failure (%s) preserves the remembered session', async status => {
  vi.spyOn(axios, 'post').mockRejectedValue(Object.assign(new Error('Unavailable'), { response: status ? { status } : undefined }));
  await expect(client.get('/users/me')).rejects.toThrow('Unavailable');
  expect(localStorage.getItem('refreshToken')).toBe('remembered-refresh');
});
test.each([true, false])('refresh preserves storage choice with rememberMe=%s', async rememberMe => {
  storeAuthTokens({ accessToken: 'expired', refreshToken: 'refresh' }, rememberMe);
  vi.spyOn(axios, 'post').mockResolvedValue({ data: { accessToken: 'new', refreshToken: 'rotated' } });
  client.defaults.adapter = async config => {
    if (config.headers.Authorization === 'Bearer new') return { data: {}, status: 200, headers: {}, config };
    throw Object.assign(new Error('Expired'), { config, response: { status: 401 } });
  };
  await client.get('/users/me');
  expect((rememberMe ? localStorage : sessionStorage).getItem('refreshToken')).toBe('rotated');
  expect((rememberMe ? sessionStorage : localStorage).getItem('refreshToken')).toBeNull();
});
