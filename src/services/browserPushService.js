import notifications from './notificationService';
import { getAccessToken } from '../utils/authStorage';

const storageKey = 'veganhelper.browserPush';
let epoch = 0;
let pendingSave = null;
let starting = false;
const supported = () => window.isSecureContext && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
const stored = () => { try { return JSON.parse(localStorage.getItem(storageKey)); } catch { return null; } };
const registration = () => navigator.serviceWorker.getRegistration('/notification-sw.js');
function accountId() {
  try {
    const part = getAccessToken().split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const claims = JSON.parse(atob(part.padEnd(Math.ceil(part.length / 4) * 4, '=')));
    return String(claims.sub ?? claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']);
  } catch { return null; }
}

export async function browserPushStatus(userId) {
  if (!supported()) return { supported: false, active: false };
  const config = await notifications.getPushConfig();
  const worker = await registration();
  const subscription = await worker?.pushManager.getSubscription();
  const saved = stored();
  return { supported: true, ...config, permission: Notification.permission,
    active: Notification.permission === 'granted' && String(saved?.userId) === String(userId) && saved?.endpoint === subscription?.endpoint };
}

export async function enableBrowserPush(userId, publicKey) {
  if (starting) throw new Error('A browser push update is already in progress. Please wait.');
  starting = true;
  try { return await subscribeBrowserPush(userId, publicKey); }
  finally { starting = false; }
}

async function subscribeBrowserPush(userId, publicKey) {
  if (!supported() || !userId || !publicKey) throw new Error('Browser push is not available.');
  const version = ++epoch;
  // Refreshing a JWT for the same account is valid; logout/account changes cancel the operation.
  const check = () => { if (version !== epoch || accountId() !== String(userId)) throw new Error('Your session changed. Please try again.'); };
  check();
  // This function is called only from the Enable button's click handler.
  const permission = Notification.permission === 'granted' ? 'granted' : await Notification.requestPermission();
  if (permission !== 'granted') throw new Error('Notifications were not allowed. You can change permission in your browser site settings.');
  check();
  await navigator.serviceWorker.register('/notification-sw.js');
  const worker = await navigator.serviceWorker.ready;
  check();
  let subscription = await worker.pushManager.getSubscription();
  const saved = stored();
  const base64 = publicKey.replace(/-/g, '+').replace(/_/g, '/');
  const key = Uint8Array.from(atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')), char => char.charCodeAt(0));
  const currentKey = subscription?.options?.applicationServerKey;
  const sameKey = currentKey && Array.from(new Uint8Array(currentKey)).join(',') === Array.from(key).join(',');
  if (subscription && (!sameKey || String(saved?.userId) !== String(userId))) {
    await subscription.unsubscribe();
    subscription = null;
  }
  subscription ??= await worker.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: key });
  try {
    check();
    pendingSave = notifications.subscribePush(subscription.toJSON()).then(result => {
      localStorage.setItem(storageKey, JSON.stringify({ userId, id: result.id, endpoint: subscription.endpoint }));
    });
    await pendingSave;
    check();
  } catch (error) {
    await subscription.unsubscribe().catch(() => {});
    throw error;
  } finally { pendingSave = null; }
}

export async function disableBrowserPush() {
  ++epoch;
  // Logout must wait for an already-started registration POST before revoking the JWT.
  await pendingSave?.catch(() => {});
  const saved = stored();
  const worker = supported() ? await registration() : null;
  const subscription = await worker?.pushManager.getSubscription();
  let serverError;
  try { if (saved?.id) await notifications.unsubscribePush(saved.id); }
  catch (error) { if (error.response?.status !== 404) serverError = error; }
  // Also revoke at the browser provider, even if the API is temporarily unreachable.
  if (subscription) await subscription.unsubscribe();
  const displayed = await worker?.getNotifications();
  displayed?.forEach(notification => notification.close());
  localStorage.removeItem(storageKey);
  if (serverError) throw Object.assign(new Error('Browser push is off locally, but server cleanup failed. An in-flight notification may still arrive.'), { localDisabled: true });
}
