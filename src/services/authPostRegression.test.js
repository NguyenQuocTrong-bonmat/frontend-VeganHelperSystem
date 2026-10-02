import axiosInstance from '../lib/axios';
import { authService } from './authService';
import { getMyPosts, createPost, updatePost } from './postService';
import { clearAuthTokens, getAccessToken, storeAuthTokens } from '../utils/authStorage';

beforeEach(() => {
  clearAuthTokens();
  global.fetch = jest.fn();
});

afterEach(() => jest.restoreAllMocks());

test.each([true, false])('My Posts sends the current token with rememberMe=%s', async rememberMe => {
  storeAuthTokens({ accessToken: 'current-user', refreshToken: 'refresh' }, rememberMe);
  fetch.mockResolvedValue({ ok: true, json: async () => ({ items: [{ id: 7 }], totalCount: 1 }) });
  expect((await getMyPosts()).items).toEqual([{ id: 7 }]);
  expect(fetch.mock.calls[0][1].headers.Authorization).toBe('Bearer current-user');
  expect(fetch.mock.calls[0][0]).toContain('/api/Posts/my-posts?');
});

test('switching accounts clears old persistent, session and legacy tokens', () => {
  localStorage.setItem('token', 'legacy-user');
  storeAuthTokens({ accessToken: 'remembered-user', refreshToken: 'old-refresh' }, true);
  storeAuthTokens({ accessToken: 'session-user', refreshToken: 'new-refresh' }, false);
  expect(getAccessToken()).toBe('session-user');
  expect(localStorage.getItem('accessToken')).toBeNull();
  expect(localStorage.getItem('refreshToken')).toBeNull();
  expect(localStorage.getItem('token')).toBeNull();
  storeAuthTokens({ accessToken: 'next-remembered-user' }, true);
  expect(sessionStorage.getItem('accessToken')).toBeNull();
  expect(sessionStorage.getItem('refreshToken')).toBeNull();
});

test('unauthorized My Posts never returns the public feed', async () => {
  fetch.mockResolvedValue({ ok: false, status: 401, text: async () => '' });
  await expect(getMyPosts()).rejects.toMatchObject({ status: 401 });
  expect(fetch).toHaveBeenCalledTimes(1);
});

test('invalid login preserves the form error even if an old token exists', async () => {
  storeAuthTokens({ accessToken: 'old-token' }, true);
  const previousAdapter = axiosInstance.defaults.adapter;
  axiosInstance.defaults.adapter = async config => {
    throw Object.assign(new Error('Invalid credentials'), { config, response: { status: 401, data: { message: 'Invalid email or password.' } } });
  };
  try {
    await expect(authService.login({ email: 'missing@example.invalid', password: 'wrong' }))
      .rejects.toMatchObject({ response: { status: 401, data: { message: 'Invalid email or password.' } } });
    expect(getAccessToken()).toBe('old-token');
  } finally {
    axiosInstance.defaults.adapter = previousAdapter;
  }
});

test.each([createPost, data => updatePost(1, data)])('recipe multipart payload carries named ingredients and numbered steps', async save => {
  storeAuthTokens({ accessToken: 'session-user' }, false);
  fetch.mockResolvedValue({ ok: true, json: async () => ({ id: 1 }) });
  await save({ title: 'Recipe', categoryId: 6, content: 'Content', ingredients: [' Đậu hũ '], steps: [' Rửa nguyên liệu '] });
  const request = fetch.mock.calls[0][1];
  expect(request.headers.Authorization).toBe('Bearer session-user');
  expect(JSON.parse(request.body.get('IngredientsJson'))).toEqual([{ Name: 'Đậu hũ' }]);
  expect(JSON.parse(request.body.get('StepsJson'))).toEqual([{ StepNumber: 1, Description: 'Rửa nguyên liệu' }]);
  expect(request.body.get('DifficultyLevel')).toBe('easy');
});
