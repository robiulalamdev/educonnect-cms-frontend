"use client";

import { usePushNotifications } from "@/hooks/use-push-notifications";

/**
 * Mounted once inside authenticated layouts.
 * Silently sets up FCM Web Push: requests permission, subscribes,
 * and registers the browser FCM token with the backend.
 */
export function PushNotificationSetup() {
  usePushNotifications();
  return null;
}