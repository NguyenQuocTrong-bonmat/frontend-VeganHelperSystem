import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { vi } from 'vitest';
import NotificationBell from './NotificationBell';
import api from '../../services/notificationService';

vi.mock('../../services/notificationService', () => ({ default: {
  getNotifications: vi.fn(), getUnreadCount: vi.fn(), markAsRead: vi.fn(), markAllAsRead: vi.fn(),
} }));
vi.mock('./BrowserPushControl', () => ({ default: () => <p>Browser push settings</p> }));
let container, root;
const item = (id, targetUrl = `/posts/${id}`, isRead = false) => ({ id, title: `Notice ${id}`, message: `Message ${id}`, targetUrl, isRead, createdAt: '2026-10-15T01:00:00Z' });
const page = (items, pageIndex = 1, totalPages = 1) => ({ items, pageIndex, totalPages });
const location = () => <output>{useLocation().pathname}</output>;
const Location = location;
const button = text => [...container.querySelectorAll('button')].find(node => node.textContent.includes(text));
const click = node => act(async () => node.click());
const render = (id = 7) => act(async () => root.render(<MemoryRouter><NotificationBell key={id} userId={id} /><Location /></MemoryRouter>));
const open = () => click(container.querySelector('button[title="Notifications"]'));
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  vi.resetAllMocks();
  api.getUnreadCount.mockResolvedValue({ unreadCount: 3 });
  api.getNotifications.mockResolvedValue(page([item(1), item(2)]));
  api.markAsRead.mockResolvedValue({ updatedCount: 1, unreadCount: 2 });
  api.markAllAsRead.mockResolvedValue({ updatedCount: 2, unreadCount: 1 });
  container = document.createElement('div'); document.body.appendChild(container); root = createRoot(container);
});
afterEach(async () => { await act(async () => root.unmount()); container.remove(); vi.useRealTimers(); });

test('loads unread badge and opens real inbox items without an array fallback', async () => {
  await render(); expect(container.querySelector('button').getAttribute('aria-label')).toBe('Notifications, 3 unread');
  await open(); expect(container.textContent).toContain('Message 1');
  expect(api.getNotifications.mock.calls[0].slice(0, 3)).toEqual([1, 20, false]);
});
test.each(['/posts/1', '/posts/edit/1', '/users/1', '/weekly-menu'])('marks an unread notification before navigating to %s', async target => {
  api.getNotifications.mockResolvedValue(page([item(1, target)]));
  await render(); await open(); await click(button('Notice 1'));
  expect(api.markAsRead).toHaveBeenCalledWith(1);
  expect(container.querySelector('output').textContent).toBe(target);
  expect(container.querySelector('button').getAttribute('aria-label')).toBe('Notifications, 2 unread');
});
test('read-all uses authoritative server count even when a new notification arrives', async () => {
  await render(); await open(); await click(button('Mark all as read'));
  expect(container.querySelector('button').getAttribute('aria-label')).toBe('Notifications, 1 unread');
  expect(container.textContent).not.toContain('(unread)');
});
test('marking an already-read item does not PATCH again', async () => {
  api.getNotifications.mockResolvedValue(page([item(1, '/posts/1', true)]));
  await render(); await open(); await click(button('Notice 1'));
  expect(api.markAsRead).not.toHaveBeenCalled();
});
test('load-more appends and deduplicates notifications across offset pages', async () => {
  api.getNotifications.mockResolvedValueOnce(page([item(1)], 1, 2)).mockResolvedValueOnce(page([item(1), item(2)], 2, 2));
  await render(); await open(); await click(button('Load more'));
  expect(container.querySelectorAll('time')).toHaveLength(2);
  expect(api.getNotifications.mock.calls[1][0]).toBe(2);
});
test('load failure has retry and is not shown as empty inbox', async () => {
  api.getNotifications.mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(page([]));
  await render(); await open(); expect(container.querySelector('[role="alert"]')).not.toBeNull();
  expect(container.textContent).not.toContain('no notifications yet');
  await click(button('Retry')); expect(container.textContent).toContain('no notifications yet');
});
test('failed mark keeps unread state, popup and current page', async () => {
  api.markAsRead.mockRejectedValue(new Error('offline'));
  await render(); await open(); await click(button('Notice 1'));
  expect(container.querySelector('[role="alert"]').textContent).toContain('Could not mark');
  expect(container.querySelector('output').textContent).toBe('/');
  expect(container.textContent).toContain('(unread)');
});
test('duplicate click does not decrement twice and stale poll cannot overwrite mutation result', async () => {
  let finishPoll, finishRead;
  api.getUnreadCount.mockResolvedValueOnce({ unreadCount: 3 }).mockImplementationOnce(() => new Promise(resolve => { finishPoll = resolve; }));
  api.markAsRead.mockImplementation(() => new Promise(resolve => { finishRead = resolve; }));
  await render(); await open(); const notice = button('Notice 1');
  await act(async () => { notice.click(); notice.click(); });
  expect(api.markAsRead).toHaveBeenCalledTimes(1);
  await act(async () => finishRead({ updatedCount: 1, unreadCount: 2 }));
  await act(async () => finishPoll({ unreadCount: 99 }));
  expect(container.querySelector('button').getAttribute('aria-label')).toBe('Notifications, 2 unread');
});
test('Escape closes the inbox and returns focus to its trigger', async () => {
  await render(); await open(); await act(async () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })));
  expect(container.querySelector('#notification-inbox')).toBeNull();
  expect(document.activeElement).toBe(container.querySelector('button'));
});
test('notification URL cannot navigate outside the application', async () => {
  api.getNotifications.mockResolvedValue(page([item(1, 'https://untrusted.example')]));
  await render(); await open(); await click(button('Notice 1'));
  expect(container.querySelector('output').textContent).toBe('/home');
});
test('switching accounts ignores the previous account unread response', async () => {
  let finish;
  api.getUnreadCount.mockImplementationOnce(() => new Promise(resolve => { finish = resolve; })).mockResolvedValue({ unreadCount: 1 });
  await render(7); await render(8); await act(async () => finish({ unreadCount: 55 }));
  expect(container.querySelector('button').getAttribute('aria-label')).toBe('Notifications, 1 unread');
});
