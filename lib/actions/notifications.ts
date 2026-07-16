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
