"use server";

import env from "../../config/.env";

/**
 * Fetch a public user by their username (no auth required).
 */
export async function getUserByUsername(username: string) {
  try {
    const res = await fetch(
      `${env.API_BASE_URL}/api/v1/user/by-username/${encodeURIComponent(username)}`,
      { cache: "no-store" },
    );

    if (!res.ok) return { success: false, data: null };
    const data = await res.json();
    return data;
  } catch {
    return { success: false, data: null };
  }
}
