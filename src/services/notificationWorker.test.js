import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { vi } from 'vitest';
import { notificationTarget } from '../utils/notificationTarget';

const source = readFileSync(resolve('public/notification-sw.js'), 'utf8');
let handlers, worker, client;
beforeEach(() => {
  handlers = {};
  client = { url: 'https://app.example/weekly-menu', postMessage: vi.fn(), navigate: vi.fn(async () => {}), focus: vi.fn(async () => {}) };
  worker = { addEventListener: (name, handler) => { handlers[name] = handler; }, location: { origin: 'https://app.example' },
    registration: { showNotification: vi.fn(async () => {}) }, clients: { matchAll: vi.fn(async () => [client]), openWindow: vi.fn(async () => {}) } };
  new Function('self', source)(worker);
});
async function push(payload) {
  let complete;
  handlers.push({ data: { json: () => payload }, waitUntil: promise => { complete = promise; } });
  await complete;
}
async function click(path) {
  let complete;
  const close = vi.fn();
  handlers.notificationclick({ notification: { data: { url: path }, close }, waitUntil: promise => { complete = promise; } });
  await complete; expect(close).toHaveBeenCalled();
}
test('actual BE push payload displays notification and refreshes open inboxes', async () => {
  await push({ notificationId: 12, title: 'New like', body: 'Someone liked your post.', url: '/posts/18', tag: 'notification-12' });
  expect(worker.registration.showNotification).toHaveBeenCalledWith('New like', expect.objectContaining({ body: 'Someone liked your post.', tag: 'notification-12', data: { url: '/posts/18' } }));
  expect(client.postMessage).toHaveBeenCalledWith({ type: 'notification-received' });
});
test.each(['/posts/18', '/posts/edit/18', '/users/7', '/weekly-menu'])('push and in-app links agree on internal target %s', async path => {
  expect(notificationTarget(path)).toBe(path); await click(path);
  expect(client.navigate).toHaveBeenCalledWith('https://app.example' + path); expect(client.focus).toHaveBeenCalled();
});
test.each(['https://outside.example', '//outside.example', '/\\outside.example', 'javascript:alert(1)', '/posts/0', null])('untrusted target %s falls back to local home', async path => {
  expect(notificationTarget(path)).toBe('/home'); await push({ url: path }); await click(path);
  expect(client.navigate).toHaveBeenCalledWith('https://app.example/home');
});
test('click opens a window when no site window exists', async () => {
  worker.clients.matchAll.mockResolvedValue([]); await click('/weekly-menu');
  expect(worker.clients.openWindow).toHaveBeenCalledWith('https://app.example/weekly-menu');
});
