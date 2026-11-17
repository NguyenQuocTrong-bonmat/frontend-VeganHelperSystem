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

test('a late 401 cannot replay a mutation under a different account', async () => {
  let rejectRequest;
  let started;
  const dispatched = new Promise(resolve => { started = resolve; });
  const adapter = vi.fn(config => {
    if (config.headers.Authorization !== 'Bearer expired')
      return Promise.resolve({ data: {}, status: 200, headers: {}, config });
    started();
    return new Promise((_, reject) => {
      rejectRequest = () => reject(Object.assign(new Error('Expired'), { config, response: { status: 401 } }));
    });
  });
  client.defaults.adapter = adapter;
  const refresh = vi.spyOn(axios, 'post').mockResolvedValue({
    data: { accessToken: 'other-rotated', refreshToken: 'other-refresh-rotated' },
  });
  const mutation = client.post('/posts/42/like');
  await dispatched;
  storeAuthTokens({ accessToken: 'other', refreshToken: 'other-refresh' }, true);
  rejectRequest();
  await expect(mutation).rejects.toThrow();
  expect(refresh).not.toHaveBeenCalled();
  expect(adapter).toHaveBeenCalledTimes(1);
  expect(localStorage.getItem('refreshToken')).toBe('other-refresh');
});

test('a late 401 retries with a token already rotated within the same session', async () => {
  let rejectRequest;
  let started;
  const dispatched = new Promise(resolve => { started = resolve; });
  const adapter = vi.fn(config => {
    if (config.headers.Authorization === 'Bearer rotated')
      return Promise.resolve({ data: {}, status: 200, headers: {}, config });
    started();
    return new Promise((_, reject) => {
      rejectRequest = () => reject(Object.assign(new Error('Expired'), { config, response: { status: 401 } }));
    });
  });
  client.defaults.adapter = adapter;
  const refresh = vi.spyOn(axios, 'post');
  const request = client.get('/users/me');
  await dispatched;
  localStorage.setItem('refreshToken', 'rotated-refresh');
  localStorage.setItem('accessToken', 'rotated');
  rejectRequest();
  await request;
  expect(refresh).not.toHaveBeenCalled();
  expect(adapter).toHaveBeenCalledTimes(2);
});

test('a completed refresh cannot replay a mutation after switching accounts', async () => {
  let finishRefresh;
  let started;
  const refreshing = new Promise(resolve => { started = resolve; });
  vi.spyOn(axios, 'post').mockImplementation(() => {
    started();
    return new Promise(resolve => { finishRefresh = resolve; });
  });
  const mutation = client.post('/posts/42/like');
  await refreshing;
  storeAuthTokens({ accessToken: 'other', refreshToken: 'other-refresh' }, true);
  finishRefresh({ data: { accessToken: 'old-rotated', refreshToken: 'old-refresh-rotated' } });
  await expect(mutation).rejects.toThrow('Session changed');
  expect(localStorage.getItem('refreshToken')).toBe('other-refresh');
});
