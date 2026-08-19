"use server";

import { apiGet, apiPost, apiPatch, apiPostFormData } from "@/lib/api";

/**
 * Get chat list.
 */
export async function getChatList(page = 1, limit = 20) {
  try {
    return await apiGet(`/api/v1/chats/profile?page=${page}&limit=${limit}`);
  } catch {
    return { success: false, data: [], meta: { total: 0, total_pages: 0 } };
  }
}

/**
 * Get or create direct chat.
 */
export async function getOrCreateDirectChat(
  recipientId: string,
  initialMessage?: string,
) {
  try {
    return await apiPost("/api/v1/chats/profile/direct", {
      recipient_id: recipientId,
      initial_message: initialMessage,
    });
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

/**
 * Get messages in a chat.
 */
export async function getMessages(chatId: string, page = 1, limit = 50) {
  try {
    const res = await apiGet<any>(`/api/v1/chats/profile/${chatId}/messages?page=${page}&limit=${limit}`);
    const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
    return { success: true, data, meta: res.data?.meta ?? res.meta };
  } catch {
    return { success: false, data: [], meta: { total: 0, total_pages: 0 } };
  }
}

/**
 * Send a message.
 */
export async function sendMessage(
  chatId: string,
  body: { body: string; reply_to_id?: string; context_service_id?: string },
) {
  try {
    return await apiPost(`/api/v1/chats/profile/${chatId}/messages`, body);
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

/**
 * Send a message with attachments (up to 3 files) via multipart.
 * `body`, `reply_to_id`, `context_service_id` are sent as text fields.
 */
export async function sendMessageWithMedia(
  chatId: string,
  payload: { body: string; reply_to_id?: string; context_service_id?: string },
  files: File[],
) {
  try {
    const formData = new FormData();
    formData.append("body", payload.body);
    if (payload.reply_to_id) formData.append("reply_to_id", payload.reply_to_id);
    if (payload.context_service_id) formData.append("context_service_id", payload.context_service_id);
    for (const file of files) {
      formData.append("media", file);
    }
    return await apiPostFormData(`/api/v1/chats/profile/${chatId}/messages`, formData);
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

/**
 * Mark chat as read.
 */
export async function markChatRead(chatId: string) {
  try {
    return await apiPatch(`/api/v1/chats/profile/${chatId}/read`);
  } catch {
    return { success: false };
  }
}
