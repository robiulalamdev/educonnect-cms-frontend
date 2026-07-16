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
  const s = getSocket();
  s.emit("join_post", postId);
}

export function leavePostRoom(postId: string) {
  const s = getSocket();
  s.emit("leave_post", postId);
}

export function onNewComment(callback: (data: any) => void) {
  const s = getSocket();
  s.on("new_comment", callback);
  return () => s.off("new_comment", callback);
}

export function onPostLiked(callback: (data: any) => void) {
  const s = getSocket();
  s.on("post_liked", callback);
  return () => s.off("post_liked", callback);
}
