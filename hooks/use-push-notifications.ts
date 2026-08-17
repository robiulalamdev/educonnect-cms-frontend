"use client";

import { useEffect, useRef, useState } from "react";
import { registerDevice } from "@/lib/actions/devices";
import { getFirebaseConfig } from "@/lib/actions/notifications";

const SW_PATH = "/firebase-messaging-sw.js";

type PushStatus = "idle" | "loading" | "supported" | "unsupported" | "denied" | "registered" | "error";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Extracts the FCM registration token from a PushSubscription endpoint.
 * Endpoint format: https://fcm.googleapis.com/fcm/send/<TOKEN>
 */
function extractFcmToken(subscription: PushSubscription): string | null {
  const url = subscription.endpoint;
  const match = url.match(/\/fcm\/send\/(.+)$/) || url.match(/\/registration\/?(.+)$/);
  return match ? match[1] : null;
}

/**
 * Registers the browser for FCM Web Push and stores the token on the backend.
 * Runs once when a logged-in user loads the dashboard.
 */
export function usePushNotifications() {
  const [status, setStatus] = useState<PushStatus>("idle");
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    async function init() {
      try {
        // 1. Check browser support
        if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
          setStatus("unsupported");
          return;
        }

        setStatus("loading");

        // 2. Get VAPID public key from backend (fallback to env var)
        const config = await getFirebaseConfig();
        const vapidKey = config?.vapid_public_key || process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
        if (!vapidKey) {
          setStatus("error");
          return;
        }

        // 3. Ask for permission
        const perm = await Notification.requestPermission();
        setPermission(perm);
        if (perm !== "granted") {
          setStatus("denied");
          return;
        }

        // 4. Register service worker
        const registration = await navigator.serviceWorker.register(SW_PATH, { scope: "/" });
        await navigator.serviceWorker.ready;

        // 5. Get existing subscription or create a new one
        let subscription = await registration.pushManager.getSubscription();
        if (!subscription) {
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidKey) as BufferSource,
          });
        }

        // 6. Extract FCM token and register with backend
        const fcmToken = extractFcmToken(subscription);
        if (fcmToken) {
          const res = await registerDevice(fcmToken, "web");
          if (res.success) {
            setStatus("registered");
          } else {
            setStatus("error");
          }
        } else {
          // Non-FCM endpoint (e.g. local dev) — try full endpoint as token
          const res = await registerDevice(subscription.endpoint, "web");
          setStatus(res.success ? "registered" : "error");
        }
      } catch (err) {
        console.error("[Push] Subscription failed:", err);
        setStatus("error");
      }
    }

    init();
  }, []);

  return { status, permission };
}