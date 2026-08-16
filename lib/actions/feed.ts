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
 * Get trending feed — uses backend trending endpoint.
 */
export async function getTrendingFeed(page = 1, limit = 10) {
  try {
    const data = await apiGet<{ success: boolean; data: any[] }>(
      `/api/v1/posts/trending?limit=${limit}`,
    );

    if (!data.success || !data.data) {
      return { success: true, data: [], meta: { total: 0, total_pages: 0 } };
    }

    // Paginate the already-scored results from backend
    const start = (page - 1) * limit;
    const paged = data.data.slice(start, start + limit);

    return {
      success: true,
      data: paged,
      meta: {
        total: data.data.length,
        total_pages: Math.ceil(data.data.length / limit),
        page,
        limit,
      },
    };
  } catch {
    return { success: true, data: [], meta: { total: 0, total_pages: 0 } };
  }
}
