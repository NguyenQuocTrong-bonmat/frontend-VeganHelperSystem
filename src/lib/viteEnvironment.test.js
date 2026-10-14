import { afterEach, expect, test, vi } from 'vitest';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

// Allow cold module transformation on slower development/CI machines.
test('API requests use the configured Vite backend URL', async () => {
  vi.stubEnv('VITE_API_BASE_URL', 'https://api.example.test/api');
  vi.resetModules();
  const { default: client } = await import('./axios');
  expect(client.defaults.baseURL).toBe('https://api.example.test/api');
}, 30_000);

test('uploaded image paths use the configured backend host and preserve absolute URLs', async () => {
  vi.stubEnv('VITE_API_BASE_URL', 'https://api.example.test/api');
  vi.resetModules();
  const { getImageUrl } = await import('../utils/imageUtils');
  expect(getImageUrl('/uploads/recipe.jpg')).toBe('https://api.example.test/uploads/recipe.jpg');
  expect(getImageUrl('https://cdn.example.test/recipe.jpg')).toBe('https://cdn.example.test/recipe.jpg');
});
