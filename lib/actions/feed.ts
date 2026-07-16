"use server";

import env from "@/config/.env";

const API_BASE = env.API_BASE_URL;

/**
 * Get public post feed (no auth required).
 */
export async function getPublicFeed(page = 1, limit = 10, type?: string) {
  try {
    let url = `${API_BASE}/api/v1/posts/?page=${page}&limit=${limit}`;
    if (type) url += `&type=${type}`;

    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return { success: false, data: [], meta: { total: 0, page, limit, total_pages: 0 } };
  }
}

/**
 * Get trending posts (sorted by engagement).
 * Since there's no dedicated trending endpoint, we fetch recent posts
 * and sort by media count and content length as a proxy for engagement.
 */
export async function getTrendingFeed(page = 1, limit = 10) {
  try {
    const res = await fetch(
      `${API_BASE}/api/v1/posts/?page=1&limit=50`,
      { cache: "no-store" },
    );
    const data = await res.json();

    if (!data.success) return { success: false, data: [], meta: { total: 0, page, limit, total_pages: 0 } };

    // Simple trending algorithm: score by media count + content length + recency
    const scored = data.data.map((post: any) => {
      const mediaScore = (post.media?.length || 0) * 2;
      const contentScore = Math.min((post.content?.length || 0) / 500, 5);
      const hoursAgo = (Date.now() - new Date(post.created_at).getTime()) / (1000 * 60 * 60);
      const recencyScore = Math.max(0, 10 - hoursAgo / 24);
      const totalScore = mediaScore + contentScore + recencyScore;
      return { ...post, _score: totalScore };
    });

    scored.sort((a: any, b: any) => b._score - a._score);

    // Paginate the sorted results
    const start = (page - 1) * limit;
    const paginated = scored.slice(start, start + limit);

    return {
      success: true,
      data: paginated,
      meta: {
        total: scored.length,
        page,
        limit,
        total_pages: Math.ceil(scored.length / limit),
      },
    };
  } catch (err: any) {
    return { success: false, data: [], meta: { total: 0, page, limit, total_pages: 0 } };
  }
}
