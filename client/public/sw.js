/* public/sw.js */
self.addEventListener("push", (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch {}
  const title = data.title || "Notification";
  const body  = data.body  || "";
  const url   = data.url   || "/notifications";

  const options = {
    body,
    icon: "/icons/icon-192x192.png",   // adjust to your assets
    badge: "/icons/icon-192x192.png",
    data: { url },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification?.data?.url || "/notifications";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        const u = new URL(client.url);
        if (u.pathname === url) return client.focus();
      }
      return clients.openWindow(url);
    })
  );
});
