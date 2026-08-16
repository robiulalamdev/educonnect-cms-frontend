"use server";

import { apiGet, apiPost, apiPatch, apiPatchFormData, apiDelete } from "@/lib/api";

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

// ── Batch CRUD ─────────────────────────────────────────────

export async function createBatch(payload: {
  service_id: string;
  name: string;
  description?: string;
  max_students: number;
  waitlist_enabled?: boolean;
  start_date?: string;
  end_date?: string;
  schedule: Array<{ day: string; start_time: string; end_time: string }>;
}): Promise<{ success: boolean; data?: any; message?: string; error?: any }> {
  try {
    const data = await apiPost<{ success: boolean; data: any; message: string }>(
      "/api/v1/batches/profile/teacher",
      payload
    );
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateBatch(
  batchId: string,
  payload: {
    name?: string;
    description?: string;
    max_students?: number;
    waitlist_enabled?: boolean;
    start_date?: string;
    end_date?: string;
    status?: string;
    schedule?: Array<{ day: string; start_time: string; end_time: string }>;
  }
): Promise<{ success: boolean; data?: any; message?: string; error?: any }> {
  try {
    const data = await apiPatch<{ success: boolean; data: any; message: string }>(
      `/api/v1/batches/profile/teacher/${batchId}`,
      payload
    );
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ── Schedule Overrides ─────────────────────────────────────

export async function createScheduleOverride(
  batchId: string,
  payload: {
    override_date: string;
    type: string;
    reason?: string;
    new_start?: string;
    new_end?: string;
  }
): Promise<{ success: boolean; data?: any; message?: string; error?: any }> {
  try {
    const data = await apiPost<{ success: boolean; data: any; message: string }>(
      `/api/v1/batches/profile/teacher/${batchId}/schedule-overrides`,
      payload
    );
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getScheduleOverrides(batchId: string): Promise<{ success: boolean; data?: any; error?: any }> {
  try {
    const data = await apiGet<{ success: boolean; data: any }>(
      `/api/v1/batches/profile/teacher/${batchId}/schedule-overrides`
    );
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateScheduleOverride(
  overrideId: string,
  payload: {
    type?: string;
    reason?: string;
    new_start?: string;
    new_end?: string;
  }
): Promise<{ success: boolean; data?: any; message?: string; error?: any }> {
  try {
    const data = await apiPatch<{ success: boolean; data: any; message: string }>(
      `/api/v1/batches/schedule-overrides/${overrideId}`,
      payload
    );
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteScheduleOverride(overrideId: string): Promise<{ success: boolean; message?: string; error?: any }> {
  try {
    const data = await apiDelete<{ success: boolean; message: string }>(
      `/api/v1/batches/schedule-overrides/${overrideId}`
    );
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
