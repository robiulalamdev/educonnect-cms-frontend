"use server";

import { apiGet } from "@/lib/api";

/**
 * Get teacher's batches.
 */
export async function getMyBatches(page = 1, limit = 10) {
  try {
    return await apiGet(`/api/v1/batches/profile/teacher?page=${page}&limit=${limit}`);
  } catch {
    return { success: false, data: [], meta: { total: 0, total_pages: 0 } };
  }
}

/**
 * Get student's enrollments.
 */
export async function getEnrollments(page = 1, limit = 10) {
  try {
    return await apiGet(`/api/v1/enrollments/profile/student?page=${page}&limit=${limit}`);
  } catch {
    return { success: false, data: [], meta: { total: 0, total_pages: 0 } };
  }
}
