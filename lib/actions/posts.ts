"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import env from "@/config/.env";

const API_BASE = env.API_BASE_URL;

/**
 * Server-side fetch helper that forwards cookies.
 */
async function serverFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      Cookie: cookieHeader,
      ...options.headers,
    },
    cache: "no-store",
  });

  if (res.status === 401) throw new Error("UNAUTHORIZED");

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message ?? "API_ERROR");
  return data as T;
}

/**
 * Get my posts (paginated).
 */
export async function getMyPosts(page = 1, limit = 10) {
  return serverFetch(`/api/v1/post/profile/?page=${page}&limit=${limit}`);
}

/**
 * Get a single post by ID.
 */
export async function getPostById(id: string) {
  return serverFetch(`/api/v1/post/${id}`);
}

/**
 * Create a new post with optional media files.
 */
export async function createPostAction(
  _prevState: any,
  formData: FormData,
): Promise<{ error?: string; success?: boolean; postId?: string; message?: string }> {
  const type = formData.get("type") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const subject_id = formData.get("subject_id") as string | null;
  const level_id = formData.get("level_id") as string | null;
  const service_id = formData.get("service_id") as string | null;

  if (!type || !title || !content) {
    return { error: "Type, title, and content are required." };
  }

  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    // Build FormData for multipart upload
    const submitData = new FormData();
    submitData.append("type", type);
    submitData.append("title", title);
    submitData.append("content", content);
    if (subject_id) submitData.append("subject_id", subject_id);
    if (level_id) submitData.append("level_id", level_id);
    if (service_id) submitData.append("service_id", service_id);

    // Append media files
    const mediaFiles = formData.getAll("media");
    for (const file of mediaFiles) {
      if (file instanceof File && file.size > 0) {
        submitData.append("media", file);
      }
    }

    const res = await fetch(`${API_BASE}/api/v1/post/profile/`, {
      method: "POST",
      headers: { Cookie: cookieHeader },
      body: submitData,
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      return { error: data.message ?? "Failed to create post." };
    }

    return { success: true, postId: data.data?.id };
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      redirect(ROUTES.LOGIN);
    }
    return { error: err.message ?? "Something went wrong." };
  }
}

/**
 * Update an existing post.
 */
export async function updatePostAction(
  postId: string,
  _prevState: any,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  const type = formData.get("type") as string | null;
  const title = formData.get("title") as string | null;
  const content = formData.get("content") as string | null;
  const subject_id = formData.get("subject_id") as string | null;
  const level_id = formData.get("level_id") as string | null;
  const status = formData.get("status") as string | null;

  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    const submitData = new FormData();
    if (type) submitData.append("type", type);
    if (title) submitData.append("title", title);
    if (content) submitData.append("content", content);
    if (subject_id) submitData.append("subject_id", subject_id);
    if (level_id) submitData.append("level_id", level_id);
    if (status) submitData.append("status", status);

    // Append new media files if any
    const mediaFiles = formData.getAll("media");
    for (const file of mediaFiles) {
      if (file instanceof File && file.size > 0) {
        submitData.append("media", file);
      }
    }

    const res = await fetch(`${API_BASE}/api/v1/post/profile/${postId}`, {
      method: "PATCH",
      headers: { Cookie: cookieHeader },
      body: submitData,
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      return { error: data.message ?? "Failed to update post." };
    }

    return { success: true };
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      redirect(ROUTES.LOGIN);
    }
    return { error: err.message ?? "Something went wrong." };
  }
}

/**
 * Delete a post (soft delete by setting status to DELETED).
 */
export async function deletePostAction(
  postId: string,
): Promise<{ error?: string; success?: boolean }> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    const submitData = new FormData();
    submitData.append("status", "DELETED");

    const res = await fetch(`${API_BASE}/api/v1/post/profile/${postId}`, {
      method: "PATCH",
      headers: { Cookie: cookieHeader },
      body: submitData,
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      return { error: data.message ?? "Failed to delete post." };
    }

    return { success: true };
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      redirect(ROUTES.LOGIN);
    }
    return { error: err.message ?? "Something went wrong." };
  }
}
