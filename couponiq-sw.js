
/* CouponIQ — service worker pour notifications Web Push */
self.addEventListener('push', event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; }
  catch (_) { data = { body: event.data ? event.data.text() : '' }; }

  const title = String(data.title || 'CouponIQ');
  const options = {
    body: String(data.body || 'Une nouvelle notification est disponible.'),
    icon: './logo-ouponiq.png',
    badge: './logo-ouponiq.png',
    tag: String(data.tag || 'couponiq-update'),
    data: { url: './index.html' }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(windows => {
      const existing = windows.find(
        w => new URL(w.url).origin === self.location.origin
      );

      if (existing) return existing.focus();
      return clients.openWindow('./index.html');
    })
  );
});
