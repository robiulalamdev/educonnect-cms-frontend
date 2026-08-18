"use server";

import { apiGet, apiPost, apiPatch } from "@/lib/api";

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
    return await apiGet(`/api/v1/chats/profile/${chatId}/messages?page=${page}&limit=${limit}`);
  } catch {
    return { success: false, data: [], meta: { total: 0, total_pages: 0 } };
  }
}

/**
 * Send a message.
 */
export async function sendMessage(
  chatId: string,
  body: { body: string; reply_to_id?: string },
) {
  try {
    return await apiPost(`/api/v1/chats/profile/${chatId}/messages`, body);
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
