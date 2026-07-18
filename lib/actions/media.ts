"use server";

import { apiGet } from "@/lib/api";

/**
 * Get my media (extracted from posts).
 */
export async function getMyMedia(page = 1, limit = 20) {
  try {
    const data = await apiGet<{ success: boolean; data: any[]; meta: any }>(
      `/api/v1/posts/profile/?page=1&limit=100`,
    );

    if (!data.success || !data.data) {
      return { success: true, data: [], meta: { total: 0, total_pages: 0 } };
    }

    // Extract all media from posts
    const allMedia: any[] = [];
    for (const post of data.data) {
      if (post.media?.length > 0) {
        for (const m of post.media) {
          allMedia.push({
            ...m,
            post_id: post.id,
            post_title: post.title,
            created_at: post.created_at,
          });
        }
      }
    }

    // Paginate client-side
    const total = allMedia.length;
    const start = (page - 1) * limit;
    const paged = allMedia.slice(start, start + limit);

    return {
      success: true,
      data: paged,
      meta: {
        total,
        total_pages: Math.ceil(total / limit),
        page,
        limit,
      },
    };
  } catch {
    return { success: false, data: [], meta: { total: 0, total_pages: 0 } };
  }
}
