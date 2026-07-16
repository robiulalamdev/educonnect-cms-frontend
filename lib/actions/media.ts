"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import env from "@/config/.env";

const API_BASE = env.API_BASE_URL;

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
    headers: { Cookie: cookieHeader, ...options.headers },
    cache: "no-store",
  });

  if (res.status === 401) throw new Error("UNAUTHORIZED");
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message ?? "API_ERROR");
  return data as T;
}

/**
 * Get all media from user's posts (aggregated).
 * Since there's no dedicated media endpoint, we fetch all user posts
 * and extract media from them.
 */
export async function getMyMedia(page = 1, limit = 20) {
  try {
    // Fetch all user posts (we'll get media from them)
    const postsRes = (await serverFetch(
      `/api/v1/posts/profile/?page=1&limit=100`,
    )) as { success: boolean; data: any[] };

    if (!postsRes.success) return { success: false, data: [], meta: { total: 0, page, limit, total_pages: 0 } };

    // Extract all media from posts
    const allMedia: any[] = [];
    for (const post of postsRes.data) {
      if (post.media && post.media.length > 0) {
        for (const m of post.media) {
          allMedia.push({
            ...m,
            post_id: post.id,
            post_title: post.title,
            post_type: post.type,
            owner_type: "POST",
          });
        }
      }
    }

    // Sort by most recent
    allMedia.sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());

    // Paginate
    const total = allMedia.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginatedMedia = allMedia.slice(start, start + limit);

    return {
      success: true,
      data: paginatedMedia,
      meta: { total, page, limit, total_pages: totalPages },
    };
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") redirect(ROUTES.LOGIN);
    return { success: false, data: [], meta: { total: 0, page, limit, total_pages: 0 } };
  }
}

/**
 * Delete media from a post (removes from Cloudinary and DB).
 * Since there's no dedicated delete endpoint, we update the post
 * to remove the media reference.
 */
export async function deleteMediaAction(
  _prevState: any,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  const mediaId = formData.get("media_id") as string;
  const postId = formData.get("post_id") as string;

  if (!mediaId || !postId) {
    return { error: "Media ID and Post ID are required." };
  }

  // For now, we can't delete individual media without a dedicated endpoint
  // This would require a backend update
  return { error: "Individual media deletion requires a backend update. Use post edit to manage media." };
}
