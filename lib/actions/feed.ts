"use server";

import { apiGet } from "@/lib/api";

/**
 * Get public post feed (unauthenticated).
 */
export async function getPublicFeed(
  page = 1,
  limit = 10,
  type?: string,
) {
  try {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (type) params.set("type", type);
    return await apiGet(`/api/v1/posts/?${params}`);
  } catch {
    return { success: false, data: [], meta: { total: 0, total_pages: 0 } };
  }
}

/**
 * Get trending feed — fetches all posts and scores client-side.
 */
export async function getTrendingFeed(page = 1, limit = 10) {
  try {
    const data = await apiGet<{ success: boolean; data: any[]; meta: any }>(
      `/api/v1/posts/?page=1&limit=100`,
    );

    if (!data.success || !data.data) {
      return { success: true, data: [], meta: { total: 0, total_pages: 0 } };
    }

    // Score and sort
    const scored = data.data.map((post: any) => {
      const mediaCount = post.media?.length || 0;
      const contentLength = (post.content || "").length;
      const likes = post.likes_count || 0;
      const comments = post.comments_count || 0;
      const age = (Date.now() - new Date(post.created_at).getTime()) / 3600000;
      const recency = Math.max(0, 24 - age);
      const score = mediaCount * 2 + contentLength / 50 + likes * 3 + comments * 2 + recency;
      return { ...post, _score: score };
    });

    scored.sort((a: any, b: any) => b._score - a._score);

    const start = (page - 1) * limit;
    const paged = scored.slice(start, start + limit);

    return {
      success: true,
      data: paged,
      meta: {
        total: scored.length,
        total_pages: Math.ceil(scored.length / limit),
        page,
        limit,
      },
    };
  } catch {
    return { success: true, data: [], meta: { total: 0, total_pages: 0 } };
  }
}
