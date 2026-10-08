import axiosInstance from '../lib/axios';
import { authService } from './authService';
import { getMyPosts, createPost, updatePost } from './postService';
import { clearAuthTokens, getAccessToken, storeAuthTokens } from '../utils/authStorage';

const previousAdapter = axiosInstance.defaults.adapter;
let requestAdapter;

beforeEach(() => {
  clearAuthTokens();
  requestAdapter = jest.fn(async config => ({ data: {}, status: 200, statusText: 'OK', headers: {}, config }));
  axiosInstance.defaults.adapter = requestAdapter;
});

test('editing post sends multiple media removals and additions together', async () => {
  const images = [new File(['one'], 'one.jpg', { type: 'image/jpeg' }), new File(['two'], 'two.jpg', { type: 'image/jpeg' })];
  await updatePost(1, { title: 'Recipe', categoryId: 6, content: 'Content', mediaIdsToRemove: [11, 12], mediaFiles: images });
  const request = requestAdapter.mock.calls[0][0];
  expect(request.url).toBe('/Posts/1');
  expect(request.method).toBe('put');
  expect(request.data.getAll('MediaIdsToRemove')).toEqual(['11', '12']);
  expect(request.data.getAll('MediaFilesToAdd').map(file => file.name)).toEqual(['one.jpg', 'two.jpg']);
});

afterEach(() => {
  axiosInstance.defaults.adapter = previousAdapter;
  jest.restoreAllMocks();
});

test.each([true, false])('My Posts sends the current token with rememberMe=%s', async rememberMe => {
  storeAuthTokens({ accessToken: 'current-user', refreshToken: 'refresh' }, rememberMe);
  requestAdapter.mockImplementation(async config => ({ data: { items: [{ id: 7 }], totalCount: 1 }, status: 200, headers: {}, config }));
  expect((await getMyPosts()).items).toEqual([{ id: 7 }]);
  expect(requestAdapter.mock.calls[0][0].headers.Authorization).toBe('Bearer current-user');
  expect(requestAdapter.mock.calls[0][0].url).toContain('/Posts/my-posts?');
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
  requestAdapter.mockImplementation(async config => {
    throw Object.assign(new Error('Unauthorized'), { config, response: { status: 401, data: {} } });
  });
  await expect(getMyPosts()).rejects.toMatchObject({ status: 401 });
  expect(requestAdapter).toHaveBeenCalledTimes(1);
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
  await save({ title: 'Recipe', categoryId: 6, content: 'Content', ingredients: [' Đậu hũ '], steps: [' Rửa nguyên liệu '] });
  const request = requestAdapter.mock.calls[0][0];
  expect(request.headers.Authorization).toBe('Bearer session-user');
  expect(JSON.parse(request.data.get('IngredientsJson'))).toEqual([{ Name: 'Đậu hũ' }]);
  expect(JSON.parse(request.data.get('StepsJson'))).toEqual([{ StepNumber: 1, Description: 'Rửa nguyên liệu' }]);
  expect(request.data.get('DifficultyLevel')).toBe('easy');
});
