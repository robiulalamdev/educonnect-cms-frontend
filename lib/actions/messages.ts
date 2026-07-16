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

export async function getChatList(page = 1, limit = 20) {
  try {
    return await serverFetch(`/api/v1/messaging/profile/?page=${page}&limit=${limit}`);
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") redirect(ROUTES.LOGIN);
    return { success: false, data: [], meta: { total: 0, page, limit, total_pages: 0 } };
  }
}

export async function getOrCreateDirectChat(recipientId: string, initialMessage?: string) {
  try {
    const body: any = { recipient_id: recipientId };
    if (initialMessage) body.initial_message = initialMessage;
    return await serverFetch(`/api/v1/messaging/profile/direct`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") redirect(ROUTES.LOGIN);
    throw err;
  }
}

export async function getMessages(chatId: string, page = 1, limit = 50) {
  try {
    return await serverFetch(`/api/v1/messaging/profile/${chatId}/messages?page=${page}&limit=${limit}`);
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") redirect(ROUTES.LOGIN);
    return { success: false, data: [], meta: { total: 0, page, limit, total_pages: 0 } };
  }
}

export async function sendMessage(chatId: string, body: string, replyToId?: string) {
  try {
    return await serverFetch(`/api/v1/messaging/profile/${chatId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body, reply_to_id: replyToId }),
    });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") redirect(ROUTES.LOGIN);
    throw err;
  }
}

export async function markChatRead(chatId: string) {
  try {
    return await serverFetch(`/api/v1/messaging/profile/${chatId}/read`, { method: "PATCH" });
  } catch (err: any) {
    return { success: false };
  }
}
