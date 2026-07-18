"use server";

import { apiGet, apiPost, apiPostFormData } from "@/lib/api";

// ─── Attendance ───────────────────────────────────────────────

export async function markAttendance(batchId: string, data: any) {
  try {
    return await apiPost(`/api/v1/attendance/batch/${batchId}`, data);
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function bulkMarkAttendance(batchId: string, data: any) {
  try {
    return await apiPost(`/api/v1/attendance/batch/${batchId}/bulk`, data);
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function getAttendanceList(page = 1, limit = 20, filters?: { batch_id?: string; date?: string }) {
  try {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (filters?.batch_id) params.set("batch_id", filters.batch_id);
    if (filters?.date) params.set("date", filters.date);
    return await apiGet(`/api/v1/attendance?${params}`);
  } catch {
    return { success: false, data: [], meta: { total: 0, total_pages: 0 } };
  }
}

export async function getStudentAttendanceSummary(batchId: string, studentProfileId: string) {
  try {
    return await apiGet(`/api/v1/attendance/batch/${batchId}/student/${studentProfileId}/summary`);
  } catch {
    return { success: false, data: {} };
  }
}

// ─── Tasks ────────────────────────────────────────────────────

export async function createTask(batchId: string, data: any) {
  try {
    return await apiPostFormData(`/api/v1/tasks/batch/${batchId}`, data);
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function getTaskList(page = 1, limit = 20, filters?: { batch_id?: string; status?: string }) {
  try {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (filters?.batch_id) params.set("batch_id", filters.batch_id);
    if (filters?.status) params.set("status", filters.status);
    return await apiGet(`/api/v1/tasks?${params}`);
  } catch {
    return { success: false, data: [], meta: { total: 0, total_pages: 0 } };
  }
}

export async function getMyTasks(page = 1, limit = 20) {
  try {
    return await apiGet(`/api/v1/tasks/my?page=${page}&limit=${limit}`);
  } catch {
    return { success: false, data: [], meta: { total: 0, total_pages: 0 } };
  }
}

export async function getTaskById(id: string) {
  try {
    return await apiGet(`/api/v1/tasks/${id}`);
  } catch {
    return { success: false, data: null };
  }
}

export async function updateTask(id: string, data: any) {
  try {
    const { apiPatch } = await import("@/lib/api");
    return await apiPatch(`/api/v1/tasks/${id}`, data);
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function deleteTask(id: string) {
  try {
    const { apiDelete } = await import("@/lib/api");
    return await apiDelete(`/api/v1/tasks/${id}`);
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

// ─── Daily Notes ──────────────────────────────────────────────

export async function createDailyNote(batchId: string, data: any) {
  try {
    return await apiPostFormData(`/api/v1/daily-notes/batch/${batchId}`, data);
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function getDailyNoteList(page = 1, limit = 20, filters?: { batch_id?: string }) {
  try {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (filters?.batch_id) params.set("batch_id", filters.batch_id);
    return await apiGet(`/api/v1/daily-notes?${params}`);
  } catch {
    return { success: false, data: [], meta: { total: 0, total_pages: 0 } };
  }
}

export async function getMyNotes(page = 1, limit = 20) {
  try {
    return await apiGet(`/api/v1/daily-notes/my?page=${page}&limit=${limit}`);
  } catch {
    return { success: false, data: [], meta: { total: 0, total_pages: 0 } };
  }
}

export async function getDailyNoteById(id: string) {
  try {
    return await apiGet(`/api/v1/daily-notes/${id}`);
  } catch {
    return { success: false, data: null };
  }
}

// ─── Announcements ────────────────────────────────────────────

export async function createAnnouncement(batchId: string, data: any) {
  try {
    return await apiPostFormData(`/api/v1/announcements/batch/${batchId}`, data);
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function getAnnouncementList(page = 1, limit = 20, filters?: { batch_id?: string }) {
  try {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (filters?.batch_id) params.set("batch_id", filters.batch_id);
    return await apiGet(`/api/v1/announcements?${params}`);
  } catch {
    return { success: false, data: [], meta: { total: 0, total_pages: 0 } };
  }
}

export async function getAnnouncementById(id: string) {
  try {
    return await apiGet(`/api/v1/announcements/${id}`);
  } catch {
    return { success: false, data: null };
  }
}

// ─── Reviews ──────────────────────────────────────────────────

export async function getReviewList(page = 1, limit = 20, filters?: { teacher_id?: string; rating?: number }) {
  try {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (filters?.teacher_id) params.set("teacher_id", filters.teacher_id);
    if (filters?.rating) params.set("rating", String(filters.rating));
    return await apiGet(`/api/v1/reviews?${params}`);
  } catch {
    return { success: false, data: [], meta: { total: 0, total_pages: 0 } };
  }
}

export async function createReview(data: { teacher_id: string; rating: number; comment: string }) {
  try {
    const { apiPost: post } = await import("@/lib/api");
    return await post("/api/v1/reviews", data);
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function replyToReview(reviewId: string, data: { reply: string }) {
  try {
    const { apiPost: post } = await import("@/lib/api");
    return await post(`/api/v1/reviews/${reviewId}/reply`, data);
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

// ─── Subscriptions ────────────────────────────────────────────

export async function getSubscriptionPackages() {
  try {
    return await apiGet("/api/v1/subscription/packages");
  } catch {
    return { success: false, data: [] };
  }
}

export async function getMySubscription() {
  try {
    return await apiGet("/api/v1/subscription/me");
  } catch {
    return { success: false, data: null };
  }
}

export async function getMySubscriptionHistory(page = 1, limit = 10) {
  try {
    return await apiGet(`/api/v1/subscription/me/history?page=${page}&limit=${limit}`);
  } catch {
    return { success: false, data: [], meta: { total: 0, total_pages: 0 } };
  }
}

export async function subscribeToPackage(packageId: string) {
  try {
    const { apiPost: post } = await import("@/lib/api");
    return await post("/api/v1/subscription/subscribe", { package_id: packageId });
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

// ─── Blocks ───────────────────────────────────────────────────

export async function blockUser(userId: string) {
  try {
    const { apiPost: post } = await import("@/lib/api");
    return await post("/api/v1/blocks", { user_id: userId });
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function getBlockedUsers() {
  try {
    return await apiGet("/api/v1/blocks");
  } catch {
    return { success: false, data: [] };
  }
}

export async function unblockUser(blockId: string) {
  try {
    const { apiDelete } = await import("@/lib/api");
    return await apiDelete(`/api/v1/blocks/${blockId}`);
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

// ─── Follows ──────────────────────────────────────────────────

export async function followUser(userId: string) {
  try {
    const { apiPost: post } = await import("@/lib/api");
    return await post("/api/v1/follows", { user_id: userId });
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function unfollowUser(followId: string) {
  try {
    const { apiDelete } = await import("@/lib/api");
    return await apiDelete(`/api/v1/follows/${followId}`);
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function getFollowers(userId: string) {
  try {
    return await apiGet(`/api/v1/follows/${userId}/followers`);
  } catch {
    return { success: false, data: [] };
  }
}

export async function getFollowing(userId: string) {
  try {
    return await apiGet(`/api/v1/follows/${userId}/following`);
  } catch {
    return { success: false, data: [] };
  }
}
