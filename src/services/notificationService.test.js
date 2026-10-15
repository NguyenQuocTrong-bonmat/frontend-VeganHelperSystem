import { vi } from 'vitest';
import axios from '../lib/axios';
import notifications from './notificationService';
import { clearAuthTokens, storeAuthTokens } from '../utils/authStorage';

let original, adapter;
beforeEach(() => {
  original = axios.defaults.adapter;
  adapter = vi.fn(async config => ({ data: { updatedCount: 1, unreadCount: 4 }, status: 200, statusText: 'OK', headers: {}, config }));
  axios.defaults.adapter = adapter;
});

test('push configuration and subscription APIs use BE routes and JSON shape', async () => {
  const subscription = { endpoint: 'https://fcm.googleapis.com/fcm/send/test', keys: { p256dh: 'point', auth: 'auth' } };
  await notifications.getPushConfig(); await notifications.subscribePush(subscription); await notifications.unsubscribePush(12);
  const requests = adapter.mock.calls.map(([config]) => config);
  expect(requests.map(config => [config.method, config.url])).toEqual([
    ['get', '/notifications/push/config'], ['post', '/notifications/push/subscriptions'], ['delete', '/notifications/push/subscriptions/12'],
  ]);
  expect(JSON.parse(requests[1].data)).toEqual(subscription);
});
afterEach(() => { axios.defaults.adapter = original; clearAuthTokens(); });

test.each([false, true])('inbox endpoints have exactly one /api prefix with rememberMe=%s', async remember => {
  storeAuthTokens({ accessToken: 'notification-user' }, remember);
  await notifications.getNotifications(2, 20, true);
  await notifications.getUnreadCount();
  await notifications.markAsRead(18);
  await notifications.markAllAsRead();
  const requests = adapter.mock.calls.map(([config]) => config);
  expect(requests.map(config => axios.getUri(config).replace(axios.defaults.baseURL, ''))).toEqual([
    '/notifications?pageIndex=2&pageSize=20&unreadOnly=true', '/notifications/unread-count', '/notifications/18/read', '/notifications/read-all',
  ]);
  expect(requests.every(config => config.headers.Authorization === 'Bearer notification-user')).toBe(true);
  expect(requests.map(config => config.method)).toEqual(['get', 'get', 'patch', 'patch']);
});
