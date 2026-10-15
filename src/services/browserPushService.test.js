import { vi } from 'vitest';
import api from './notificationService';
import { browserPushStatus, enableBrowserPush, disableBrowserPush } from './browserPushService';
import { authService } from './authService';
import axios from '../lib/axios';
import { clearAuthTokens, storeAuthTokens, getAccessToken } from '../utils/authStorage';

vi.mock('./notificationService', () => ({ default: { getPushConfig: vi.fn(), subscribePush: vi.fn(), unsubscribePush: vi.fn() } }));
const key = 'B' + 'A'.repeat(86);
const token = (id = 7, version = 1) => `test.${btoa(JSON.stringify({ sub: String(id), version }))}.signature`;
let worker, subscription, manager, serviceWorker, notificationApi, originalAdapter;
beforeEach(() => {
  vi.resetAllMocks(); localStorage.clear(); clearAuthTokens();
  storeAuthTokens({ accessToken: token(), refreshToken: 'test-refresh' }, false);
  vi.stubGlobal('isSecureContext', true); vi.stubGlobal('PushManager', function () {});
  notificationApi = { permission: 'default', requestPermission: vi.fn(async () => 'granted') };
  vi.stubGlobal('Notification', notificationApi);
  subscription = { endpoint: 'https://fcm.googleapis.com/fcm/send/test-only', options: { applicationServerKey: Uint8Array.from(atob(key.replace(/-/g, '+').replace(/_/g, '/')), char => char.charCodeAt(0)).buffer }, unsubscribe: vi.fn(async () => true), toJSON: () => ({ endpoint: subscription.endpoint, keys: { p256dh: 'point', auth: 'auth' } }) };
  manager = { getSubscription: vi.fn(async () => null), subscribe: vi.fn(async () => subscription) };
  worker = { pushManager: manager, getNotifications: vi.fn(async () => []) };
  serviceWorker = { getRegistration: vi.fn(async () => worker), register: vi.fn(async () => worker), ready: Promise.resolve(worker) };
  vi.stubGlobal('navigator', { serviceWorker });
  api.getPushConfig.mockResolvedValue({ enabled: true, publicKey: key });
  api.subscribePush.mockResolvedValue({ id: 12 }); api.unsubscribePush.mockResolvedValue({});
  originalAdapter = axios.defaults.adapter;
});
afterEach(() => { axios.defaults.adapter = originalAdapter; vi.unstubAllGlobals(); localStorage.clear(); clearAuthTokens(); });

test('status check never asks permission or registers a worker', async () => {
  expect(await browserPushStatus(7)).toMatchObject({ enabled: true, active: false });
  expect(notificationApi.requestPermission).not.toHaveBeenCalled();
  expect(serviceWorker.register).not.toHaveBeenCalled();
});
test('enable registers the real subscription JSON with the authenticated API', async () => {
  await enableBrowserPush(7, key);
  expect(notificationApi.requestPermission).toHaveBeenCalledTimes(1);
  expect(serviceWorker.register).toHaveBeenCalledWith('/notification-sw.js');
  expect(api.subscribePush).toHaveBeenCalledWith(subscription.toJSON());
  notificationApi.permission = 'granted'; manager.getSubscription.mockResolvedValue(subscription);
  expect((await browserPushStatus(7)).active).toBe(true);
  expect((await browserPushStatus(8)).active).toBe(false);
});
test('denied permission does not create a server subscription', async () => {
  notificationApi.requestPermission.mockResolvedValue('denied');
  await expect(enableBrowserPush(7, key)).rejects.toThrow('not allowed');
  expect(api.subscribePush).not.toHaveBeenCalled();
});
test('registration failure rolls back provider subscription', async () => {
  api.subscribePush.mockRejectedValue(new Error('API offline'));
  await expect(enableBrowserPush(7, key)).rejects.toThrow('API offline');
  expect(subscription.unsubscribe).toHaveBeenCalledTimes(1);
});
test('another account never reuses the previous account endpoint', async () => {
  localStorage.setItem('veganhelper.browserPush', JSON.stringify({ userId: 6, id: 9, endpoint: subscription.endpoint }));
  manager.getSubscription.mockResolvedValue(subscription);
  await enableBrowserPush(7, key);
  expect(subscription.unsubscribe).toHaveBeenCalledTimes(1);
  expect(manager.subscribe).toHaveBeenCalledTimes(1);
});
test('disable revokes both server and provider, and closes displayed pushes', async () => {
  await enableBrowserPush(7, key); manager.getSubscription.mockResolvedValue(subscription);
  const close = vi.fn(); worker.getNotifications.mockResolvedValue([{ close }]);
  await disableBrowserPush();
  expect(api.unsubscribePush).toHaveBeenCalledWith(12);
  expect(subscription.unsubscribe).toHaveBeenCalled(); expect(close).toHaveBeenCalled();
  expect(localStorage.getItem('veganhelper.browserPush')).toBeNull();
});
test('server cleanup failure still unsubscribes locally', async () => {
  await enableBrowserPush(7, key); manager.getSubscription.mockResolvedValue(subscription);
  api.unsubscribePush.mockRejectedValue(new Error('offline'));
  await expect(disableBrowserPush()).rejects.toMatchObject({ message: expect.stringContaining('off locally'), localDisabled: true });
  expect(subscription.unsubscribe).toHaveBeenCalled();
});
test('logout unsubscribes before revoking session and clearing token', async () => {
  await enableBrowserPush(7, key); manager.getSubscription.mockResolvedValue(subscription);
  api.unsubscribePush.mockImplementation(async () => { expect(getAccessToken()).toBe(token()); });
  axios.defaults.adapter = vi.fn(async config => {
    expect(api.unsubscribePush).toHaveBeenCalledWith(12);
    expect(subscription.unsubscribe).toHaveBeenCalled();
    return { data: {}, status: 200, headers: {}, config };
  });
  await authService.logout(); expect(getAccessToken()).toBe('');
});

test('same-account access token refresh during subscription does not cancel valid registration', async () => {
  api.subscribePush.mockImplementation(async () => {
    storeAuthTokens({ accessToken: token(7, 2), refreshToken: 'rotated' }, false);
    return { id: 12 };
  });
  await enableBrowserPush(7, key);
  expect(subscription.unsubscribe).not.toHaveBeenCalled();
  expect(JSON.parse(localStorage.getItem('veganhelper.browserPush')).id).toBe(12);
});

test('account changes while requesting permission cannot register the old account subscription', async () => {
  notificationApi.requestPermission.mockImplementation(async () => {
    storeAuthTokens({ accessToken: token(8) }, false); return 'granted';
  });
  await expect(enableBrowserPush(7, key)).rejects.toThrow('session changed');
  expect(api.subscribePush).not.toHaveBeenCalled();
});
test('logout cancels a permission prompt still in progress without creating a subscription', async () => {
  let finish;
  notificationApi.requestPermission.mockImplementation(() => new Promise(resolve => { finish = resolve; }));
  const enabling = enableBrowserPush(7, key);
  const rejected = expect(enabling).rejects.toThrow('session changed');
  await disableBrowserPush(); clearAuthTokens(); finish('granted'); await rejected;
  expect(api.subscribePush).not.toHaveBeenCalled();
});

test('logout during a registration POST removes the returned server registration', async () => {
  let finish;
  api.subscribePush.mockImplementation(() => new Promise(resolve => { finish = resolve; }));
  const enabling = enableBrowserPush(7, key);
  const canceled = expect(enabling).rejects.toThrow('session changed');
  await vi.waitFor(() => expect(api.subscribePush).toHaveBeenCalled());
  const disabling = disableBrowserPush();
  finish({ id: 12 });
  await Promise.all([canceled, disabling]);
  expect(api.unsubscribePush).toHaveBeenCalledWith(12);
  expect(localStorage.getItem('veganhelper.browserPush')).toBeNull();
});
