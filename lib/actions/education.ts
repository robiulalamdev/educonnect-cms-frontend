"use server";

import { apiGet } from "@/lib/api";

/**
 * Get public education subjects (unauthenticated).
 */
export async function getSubjects() {
  try {
    const data = await apiGet<{ success: boolean; data: any[] }>("/api/v1/education/subjects");
    return data.data || [];
  } catch {
    return [];
  }
}

/**
 * Get public education levels (unauthenticated).
 */
export async function getLevels() {
  try {
    const data = await apiGet<{ success: boolean; data: any[] }>("/api/v1/education/levels");
    return data.data || [];
  } catch {
    return [];
  }
}
