import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi } from 'vitest';
import { AuthProvider } from './AuthContext';
import GuestRoute from '../components/layout/GuestRoute';
import { authService } from '../services/authService';
import { storeAuthTokens, clearAuthTokens } from '../utils/authStorage';

vi.mock('../services/authService', () => ({ authService: { getProfile: vi.fn() } }));
let root, container;
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  clearAuthTokens();
  container = document.createElement('div'); document.body.appendChild(container); root = createRoot(container);
});
afterEach(async () => { await act(async () => root.unmount()); container.remove(); vi.restoreAllMocks(); clearAuthTokens(); });
async function render() {
  await act(async () => root.render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><AuthProvider><Routes>
    <Route path="/" element={<GuestRoute><p>Guest home</p></GuestRoute>} />
    <Route path="/home" element={<p>Member home</p>} />
  </Routes></AuthProvider></MemoryRouter>));
}
test('opening the root URL restores a remembered session and enters member home', async () => {
  storeAuthTokens({ accessToken: 'remembered', refreshToken: 'refresh' }, true);
  sessionStorage.clear();
  authService.getProfile.mockResolvedValue({ id: 1 });
  await render();
  expect(container.textContent).toBe('Member home');
  expect(localStorage.getItem('refreshToken')).toBe('refresh');
});
test('a temporary backend failure keeps remembered credentials and offers retry', async () => {
  storeAuthTokens({ accessToken: 'remembered', refreshToken: 'refresh' }, true);
  authService.getProfile.mockRejectedValueOnce(new Error('Network Error')).mockResolvedValue({ id: 1 });
  await render();
  expect(localStorage.getItem('refreshToken')).toBe('refresh');
  expect(container.textContent).toContain('Retry');
  await act(async () => container.querySelector('button').click());
  expect(container.textContent).toBe('Member home');
});
test('without a saved session the root URL stays on guest home', async () => {
  authService.getProfile.mockClear();
  await render();
  expect(container.textContent).toBe('Guest home');
  expect(authService.getProfile).not.toHaveBeenCalled();
});
test('a rejected session is cleared and shows guest home', async () => {
  storeAuthTokens({ accessToken: 'invalid', refreshToken: 'revoked' }, true);
  authService.getProfile.mockRejectedValue({ response: { status: 401 } });
  await render();
  expect(container.textContent).toBe('Guest home');
  expect(localStorage.getItem('refreshToken')).toBeNull();
});
test('Strict Mode restores a session once instead of racing two profile responses', async () => {
  storeAuthTokens({ accessToken: 'remembered', refreshToken: 'refresh' }, true);
  authService.getProfile.mockReset().mockResolvedValueOnce({ id: 1 }).mockRejectedValueOnce(new Error('Network Error'));
  await act(async () => root.render(<React.StrictMode><MemoryRouter><AuthProvider><GuestRoute><p>Guest home</p></GuestRoute></AuthProvider></MemoryRouter></React.StrictMode>));
  expect(authService.getProfile).toHaveBeenCalledTimes(1);
  expect(container.textContent).not.toContain('Retry');
});
