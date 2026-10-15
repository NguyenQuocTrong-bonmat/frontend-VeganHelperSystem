self.addEventListener('push', event => {
  let payload;
  try { payload = event.data?.json() ?? {}; } catch { payload = {}; }
  const url = typeof payload.url === 'string' && /^(\/posts\/(edit\/)?[1-9]\d*|\/users\/[1-9]\d*|\/weekly-menu)$/.test(payload.url) ? payload.url : '/home';
  event.waitUntil((async () => {
    await self.registration.showNotification(payload.title || 'Vegan Helper', {
      body: payload.body || 'You have a new notification.', icon: '/logo.png',
      tag: payload.tag || `notification-${payload.notificationId || 'new'}`, data: { url },
    });
    const pages = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    pages.forEach(page => page.postMessage({ type: 'notification-received' }));
  })());
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const path = event.notification.data?.url;
  const url = new URL(typeof path === 'string' && /^(\/posts\/(edit\/)?[1-9]\d*|\/users\/[1-9]\d*|\/weekly-menu)$/.test(path) ? path : '/home', self.location.origin).href;
  event.waitUntil((async () => {
    const pages = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const page = pages.find(item => new URL(item.url).origin === self.location.origin);
    if (page) { await page.navigate(url); await page.focus(); }
    else await self.clients.openWindow(url);
  })());
});
