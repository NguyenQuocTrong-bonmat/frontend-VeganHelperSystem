import { vi } from 'vitest';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import NotFound from './NotFound';
import { useAuth } from '../context/AuthContext';

vi.mock('../context/AuthContext', () => ({ useAuth: vi.fn() }));
let container, root, previousHistory;
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  useAuth.mockReturnValue({ isAuthenticated: false });
  previousHistory = window.history.state;
  window.history.replaceState({ idx: 0 }, '', window.location.href);
  container = document.createElement('div'); document.body.appendChild(container); root = createRoot(container);
});
afterEach(async () => { await act(async () => root.unmount()); container.remove(); window.history.replaceState(previousHistory, '', window.location.href); });
const render = async (entries = ['/does-not-exist']) => {
  await act(async () => root.render(<MemoryRouter initialEntries={entries} initialIndex={entries.length - 1} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Routes>
    <Route path="/" element={<h1>Guest home</h1>} /><Route path="/home" element={<h1>Member home</h1>} />
    <Route path="/404" element={<NotFound />} /><Route path="*" element={<NotFound />} />
  </Routes></MemoryRouter>));
};

test.each([false, true])('404 is accessible and returns to the correct home with authenticated=%s', async authenticated => {
  useAuth.mockReturnValue({ isAuthenticated: authenticated });
  await render();
  const heading = container.querySelector('h1');
  expect(heading.textContent).toBe('Page not found');
  expect(document.activeElement).toBe(heading);
  expect(document.title).toBe('Page not found | Vegan Helper');
  const home = [...container.querySelectorAll('a')].find(link => link.textContent.includes('Back to home'));
  expect(home.getAttribute('href')).toBe(authenticated ? '/home' : '/');
  await act(async () => home.click());
  expect(container.textContent).toContain(authenticated ? 'Member home' : 'Guest home');
});

test('directly opened 404 has a safe back fallback instead of trapping the user', async () => {
  await render(['/404']);
  await act(async () => container.querySelector('button').click());
  expect(container.textContent).toContain('Guest home');
});

test('Go back returns to the previous in-app page', async () => {
  window.history.replaceState({ idx: 1 }, '', window.location.href);
  await render(['/', '/bad-url']);
  await act(async () => container.querySelector('button').click());
  expect(container.textContent).toContain('Guest home');
});
