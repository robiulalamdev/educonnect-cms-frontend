"use server";

import { apiGet, apiPatch, apiDelete } from "@/lib/api";

/**
 * Get the public Firebase Web Push config (project id + VAPID public key).
 * Uses silent mode — no auth required.
 */
export async function getFirebaseConfig(): Promise<{
  project_id?: string;
  vapid_public_key?: string;
  sender_id?: string;
} | null> {
  try {
    const data = await apiGet<{ success: boolean; data: any }>(
      "/api/v1/notifications/firebase-config",
      { silent: true },
    );
    if (data.success && data.data) return data.data;
    return null;
  } catch {
    return null;
  }
}

/**
 * Get notifications list.
 */
export async function getNotifications(page = 1, limit = 20) {
  try {
    return await apiGet(`/api/v1/notifications?page=${page}&limit=${limit}`);
  } catch {
    return { success: false, data: [], meta: { total: 0, total_pages: 0 } };
  }
}

/**
 * Mark a notification as read.
 */
export async function markAsRead(notificationId: string) {
  try {
    return await apiPatch(`/api/v1/notifications/${notificationId}/read`);
  } catch {
    return { success: false };
  }
}

/**
 * Mark all notifications as read.
 */
export async function markAllAsRead() {
  try {
    return await apiPatch("/api/v1/notifications/read-all");
  } catch {
    return { success: false };
  }
}

/**
 * Delete a notification.
 */
export async function deleteNotification(notificationId: string) {
  try {
    return await apiDelete(`/api/v1/notifications/${notificationId}`);
  } catch {
    return { success: false };
  }
}

/**
 * Get notification preferences.
 */
export async function getNotificationPreferences() {
  try {
    return await apiGet("/api/v1/notification-preferences");
  } catch {
    return { success: false, data: {} };
  }
}

/**
 * Update notification preferences.
 */
export async function updateNotificationPreferences(
  _prevState: any,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  const prefs: Record<string, boolean> = {};
  formData.forEach((value, key) => {
    prefs[key] = value === "true";
  });

  try {
    await apiPatch("/api/v1/notification-preferences", prefs);
    return { success: true };
  } catch (err: any) {
    return { error: err.message ?? "Failed to update preferences" };
  }
}
