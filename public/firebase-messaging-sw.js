/* eslint-disable no-restricted-globals */
// EduConnect Web Push Service Worker
// Uses the Web Push API with the FCM VAPID key.
// The push payload is delivered by the backend firebase-admin SDK.
// Sends the browser FCM registration token to the backend at /api/v1/devices/register.

const APP_NAME = "EduConnect";
const DEFAULT_URL = "/dashboard/notifications";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let payload = null;
  try {
    payload = event.data ? event.data.json() : null;
  } catch {
    try {
      const text = event.data ? event.data.text() : "";
      payload = text ? { body: text } : null;
    } catch {
      payload = null;
    }
  }

  const title = payload?.notification?.title || payload?.title || APP_NAME;
  const body = payload?.notification?.body || payload?.body || "You have a new notification";

  // The URL the user should be taken to when clicking the notification.
  const url = payload?.data?.url || payload?.click_action || DEFAULT_URL;

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      data: { url },
      tag: payload?.data?.tag || "edueconnect-notification",
      renotify: false,
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  const urlToOpen = event.notification.data?.url || DEFAULT_URL;
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});