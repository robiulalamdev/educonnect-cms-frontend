"use client";

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io({
      path: "/socket.io",
      transports: ["websocket", "polling"],
      withCredentials: true,
    });
  }
  return socket;
}

export function joinPostRoom(postId: string) {
  getSocket().emit("join_post", postId);
}

export function leavePostRoom(postId: string) {
  getSocket().emit("leave_post", postId);
}

export function onNewComment(callback: (data: any) => void): () => void {
  const s = getSocket();
  s.on("new_comment", callback);
  return () => { s.off("new_comment", callback); };
}

export function onPostLiked(callback: (data: any) => void): () => void {
  const s = getSocket();
  s.on("post_liked", callback);
  return () => { s.off("post_liked", callback); };
}

export function onNewNotification(callback: (data: any) => void): () => void {
  const s = getSocket();
  s.on("new_notification", callback);
  return () => { s.off("new_notification", callback); };
}

export function joinChatRoom(chatId: string) {
  getSocket().emit("join_chat", chatId);
}

export function leaveChatRoom(chatId: string) {
  getSocket().emit("leave_chat", chatId);
}

export function emitTyping(chatId: string, name: string) {
  getSocket().emit("typing", { chatId, name });
}

export function onNewMessage(callback: (data: any) => void): () => void {
  const s = getSocket();
  s.on("new_message", callback);
  return () => { s.off("new_message", callback); };
}

export function onMessageRead(callback: (data: any) => void): () => void {
  const s = getSocket();
  s.on("message_read", callback);
  return () => { s.off("message_read", callback); };
}

export function onUserTyping(callback: (data: any) => void): () => void {
  const s = getSocket();
  s.on("user_typing", callback);
  return () => { s.off("user_typing", callback); };
}

export function onPresenceUpdate(callback: (data: { userId: string; online: boolean; last_seen?: string | null }) => void): () => void {
  const s = getSocket();
  s.on("presence_update", callback);
  return () => { s.off("presence_update", callback); };
}

export function onPresenceSnapshot(callback: (data: { chatId: string; members: Record<string, { online: boolean; last_seen: string | null }> }) => void): () => void {
  const s = getSocket();
  s.on("presence_snapshot", callback);
  return () => { s.off("presence_snapshot", callback); };
}

export function onMentionNotification(callback: (data: any) => void): () => void {
  const s = getSocket();
  s.on("mention_notification", callback);
  return () => { s.off("mention_notification", callback); };
}
