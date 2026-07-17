"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import env from "@/config/.env";

const API_BASE = env.API_BASE_URL;

async function serverFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: { Cookie: cookieHeader, ...options.headers },
    cache: "no-store",
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message ?? "API_ERROR");
  return data as T;
}

export async function getNotifications(page = 1, limit = 20) {
  try {
    return await serverFetch(`/api/v1/notification/?page=${page}&limit=${limit}`);
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") redirect(ROUTES.LOGIN);
    return { success: false, data: [], meta: { total: 0, page, limit, total_pages: 0 }, unread_count: 0 };
  }
}

export async function markAsRead(notificationId: string) {
  try {
    return await serverFetch(`/api/v1/notification/${notificationId}/read`, { method: "PATCH" });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") redirect(ROUTES.LOGIN);
    return { success: false };
  }
}

export async function markAllAsRead() {
  try {
    return await serverFetch(`/api/v1/notification/read-all`, { method: "PATCH" });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") redirect(ROUTES.LOGIN);
    return { success: false };
  }
}

export async function deleteNotification(notificationId: string) {
  try {
    return await serverFetch(`/api/v1/notification/${notificationId}`, { method: "DELETE" });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") redirect(ROUTES.LOGIN);
    return { success: false };
  }
}

export async function getNotificationPreferences() {
  try {
    return await serverFetch("/api/v1/notification-preferences");
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") redirect(ROUTES.LOGIN);
    return { success: false, data: null };
  }
}

export async function updateNotificationPreferences(
  _prevState: any,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  const in_app_enabled = formData.get("in_app_enabled") === "true";
  const email_enabled = formData.get("email_enabled") === "true";
  const push_enabled = formData.get("push_enabled") === "true";
  const enrollment_notifications = formData.get("enrollment_notifications") === "true";
  const payment_notifications = formData.get("payment_notifications") === "true";
  const announcement_notifications = formData.get("announcement_notifications") === "true";
  const task_notifications = formData.get("task_notifications") === "true";
  const attendance_notifications = formData.get("attendance_notifications") === "true";
  const message_notifications = formData.get("message_notifications") === "true";
  const social_notifications = formData.get("social_notifications") === "true";

  try {
    await serverFetch("/api/v1/notification-preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        in_app_enabled,
        email_enabled,
        push_enabled,
        enrollment_notifications,
        payment_notifications,
        announcement_notifications,
        task_notifications,
        attendance_notifications,
        message_notifications,
        social_notifications,
      }),
    });

    return { success: true };
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") redirect(ROUTES.LOGIN);
    return { error: err.message ?? "Failed to update preferences" };
  }
}
