"use server";

import { apiGet } from "@/lib/api";

/**
 * Get trending topics from the API (trending subjects from posts).
 * Uses silent mode to avoid clearing cookies on 401.
 */
export async function getTrendingTopics() {
  try {
    const data = await apiGet<{ success: boolean; data: any[] }>(
      "/api/v1/posts/trending?limit=10",
      { silent: true },
    );

    if (!data.success || !data.data) {
      return { success: true, data: [] };
    }

    // Extract subjects from trending posts and count occurrences
    const subjectCounts: Record<string, { name: string; count: number }> = {};
    for (const post of data.data) {
      for (const s of post.subjects || []) {
        const name = s.subject.name;
        if (subjectCounts[name]) {
          subjectCounts[name].count++;
        } else {
          subjectCounts[name] = { name, count: 1 };
        }
      }
    }

    const topics = Object.values(subjectCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map((t) => ({
        tag: `#${t.name}`,
        posts: `${t.count} post${t.count > 1 ? "s" : ""}`,
      }));

    return { success: true, data: topics };
  } catch {
    return { success: true, data: [] };
  }
}

/**
 * Get suggested users from the API.
 * Uses silent mode to avoid clearing cookies on 401.
 */
export async function getSuggestedUsers() {
  try {
    const data = await apiGet<{ success: boolean; data: any[] }>(
      "/api/v1/user/suggestions?limit=3",
      { silent: true },
    );

    if (!data.success || !data.data) {
      return { success: true, data: [] };
    }

    const users = data.data.map((u: any) => ({
      id: u.id,
      name: u.full_name,
      handle: `@${u.full_name?.toLowerCase().replace(/\s+/g, "")}`,
      avatar_key: u.avatar?.key || null,
    }));

    return { success: true, data: users };
  } catch {
    return { success: true, data: [] };
  }
}

/**
 * Perform a dynamic search for Services.
 */
export async function searchServices(params: Record<string, string | number | undefined>) {
  try {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        searchParams.append(key, String(value));
      }
    });
    return await apiGet<{ success: boolean; data: any[]; meta: any }>(
      `/api/v1/services?${searchParams.toString()}`,
      { silent: true },
    );
  } catch {
    return { success: false, data: [], meta: { total: 0 } };
  }
}

/**
 * Perform a dynamic search for Posts.
 */
export async function searchPosts(params: Record<string, string | number | undefined>) {
  try {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        searchParams.append(key, String(value));
      }
    });
    return await apiGet<{ success: boolean; data: any[]; meta: any }>(
      `/api/v1/posts?${searchParams.toString()}`,
      { silent: true },
    );
  } catch {
    return { success: false, data: [], meta: { total: 0 } };
  }
}
