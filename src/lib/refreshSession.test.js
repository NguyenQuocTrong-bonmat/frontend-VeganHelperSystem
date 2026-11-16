import { beforeEach, expect, it, vi } from 'vitest';
import { refreshSession } from './refreshSession';
beforeEach(() => { localStorage.clear(); sessionStorage.clear(); vi.unstubAllGlobals(); });
it('serializes refresh across tabs and reuses the rotated tokens', async () => {
  localStorage.setItem('accessToken', 'old-access'); localStorage.setItem('refreshToken', 'old-refresh');
  let queue = Promise.resolve();
  vi.stubGlobal('navigator', { locks: { request: (_name, run) => { const next = queue.then(run); queue = next.catch(() => {}); return next; } } });
  const request = vi.fn().mockResolvedValue({ accessToken: 'new-access', refreshToken: 'new-refresh' });
  expect(await Promise.all([refreshSession(request), refreshSession(request)])).toEqual(['new-access', 'new-access']);
  expect(request).toHaveBeenCalledTimes(1);
});
it('does not restore tokens after logout during refresh', async () => {
  localStorage.setItem('accessToken', 'old-access'); localStorage.setItem('refreshToken', 'old-refresh');
  let resolve;
  const pending = refreshSession(() => new Promise(r => { resolve = r; }));
  localStorage.clear(); resolve({ accessToken: 'late-access', refreshToken: 'late-refresh' });
  await expect(pending).rejects.toThrow('Session changed');
  expect(localStorage.getItem('accessToken')).toBeNull();
});
