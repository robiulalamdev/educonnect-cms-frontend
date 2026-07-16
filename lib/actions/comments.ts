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

export async function getComments(postId: string, page = 1, limit = 20) {
  return serverFetch(`/api/v1/posts/${postId}/comments?page=${page}&limit=${limit}`);
}

export async function createComment(postId: string, content: string, parentId?: string) {
  try {
    return await serverFetch(`/api/v1/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, parent_id: parentId }),
    });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") redirect(ROUTES.LOGIN);
    throw err;
  }
}

export async function deleteComment(commentId: string) {
  try {
    return await serverFetch(`/api/v1/posts/comments/${commentId}`, { method: "DELETE" });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") redirect(ROUTES.LOGIN);
    throw err;
  }
}

export async function getReplies(commentId: string, page = 1, limit = 10) {
  return serverFetch(`/api/v1/posts/comments/${commentId}/replies?page=${page}&limit=${limit}`);
}

export async function togglePostLike(postId: string) {
  try {
    return await serverFetch(`/api/v1/posts/${postId}/like`, { method: "POST" });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") redirect(ROUTES.LOGIN);
    throw err;
  }
}

export async function getPostLikes(postId: string) {
  return serverFetch(`/api/v1/posts/${postId}/like`);
}

export async function toggleCommentLike(commentId: string) {
  try {
    return await serverFetch(`/api/v1/posts/comments/${commentId}/like`, { method: "POST" });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") redirect(ROUTES.LOGIN);
    throw err;
  }
}
