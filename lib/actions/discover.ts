"use server";

import { apiGet } from "@/lib/api";

/**
 * Get trending topics from the API (trending subjects from posts).
 */
export async function getTrendingTopics() {
  try {
    const data = await apiGet<{ success: boolean; data: any[] }>("/api/v1/posts/trending?limit=10");

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
 */
export async function getSuggestedUsers() {
  try {
    const data = await apiGet<{ success: boolean; data: any[] }>("/api/v1/user/suggestions?limit=3");

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
