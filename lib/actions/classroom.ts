"use server";

import { apiGet, apiPost, apiPostFormData } from "@/lib/api";

// ── Batch Details ──
export async function getBatchDetails(batchId: string) {
  try {
    return await apiGet<{ success: boolean; data: any }>(`/api/v1/batches/${batchId}`);
  } catch {
    return { success: false, data: null };
  }
}

// ── Attendance ──
export async function getAttendanceList(batchId: string, page = 1) {
  try {
    return await apiGet<{ success: boolean; data: any[]; meta: any }>(`/api/v1/attendance?batch_id=${batchId}&page=${page}&limit=20`);
  } catch {
    return { success: false, data: [], meta: { total: 0 } };
  }
}

export async function markBulkAttendance(batchId: string, records: { student_profile_id: string; status: string; note?: string }[], classDate: string): Promise<{ success: boolean; data?: any; message?: any }> {
  try {
    return await apiPost<{ success: boolean; data: any }>(`/api/v1/attendance/batch/${batchId}/bulk`, {
      class_date: classDate,
      records,
    });
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

// ── Tasks ──
export async function getTaskList(batchId: string, page = 1) {
  try {
    return await apiGet<{ success: boolean; data: any[]; meta: any }>(`/api/v1/tasks?batch_id=${batchId}&page=${page}&limit=20`);
  } catch {
    return { success: false, data: [], meta: { total: 0 } };
  }
}

export async function createTask(batchId: string, payload: { title: string; description?: string; due_date?: string }): Promise<{ success: boolean; data?: any; message?: any }> {
  try {
    return await apiPost<{ success: boolean; data: any }>(`/api/v1/tasks/batch/${batchId}`, payload);
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

// ── Daily Notes ──
export async function getDailyNotes(batchId: string, page = 1) {
  try {
    return await apiGet<{ success: boolean; data: any[]; meta: any }>(`/api/v1/daily-notes?batch_id=${batchId}&page=${page}&limit=20`);
  } catch {
    return { success: false, data: [], meta: { total: 0 } };
  }
}

export async function createDailyNote(batchId: string, payload: { note_date: string; title?: string; content: string; next_day_plan?: string }): Promise<{ success: boolean; data?: any; message?: any }> {
  try {
    return await apiPost<{ success: boolean; data: any }>(`/api/v1/daily-notes/batch/${batchId}`, payload);
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

// ── Announcements ──
export async function getAnnouncements(batchId: string, page = 1) {
  try {
    return await apiGet<{ success: boolean; data: any[]; meta: any }>(`/api/v1/announcements?batch_id=${batchId}&page=${page}&limit=20`);
  } catch {
    return { success: false, data: [], meta: { total: 0 } };
  }
}

export async function createAnnouncement(batchId: string, payload: { title: string; body: string }): Promise<{ success: boolean; data?: any; message?: any }> {
  try {
    return await apiPost<{ success: boolean; data: any }>(`/api/v1/announcements/batch/${batchId}`, payload);
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

// ── Enrollments for batch ──
export async function getBatchEnrollments(batchId: string) {
  try {
    return await apiGet<{ success: boolean; data: any[]; meta: any }>(`/api/v1/enrollments/profile/teacher?batch_id=${batchId}&limit=100`);
  } catch {
    return { success: false, data: [], meta: { total: 0 } };
  }
}

// ── Chat messages ──
export async function getChatMessages(chatId: string, page = 1) {
  try {
    const res = await apiGet<any>(`/api/v1/chats/profile/${chatId}/messages?page=${page}&limit=50`);
    const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
    return { success: true, data, meta: res.data?.meta ?? res.meta };
  } catch {
    return { success: false, data: [], meta: { total: 0 } };
  }
}

export async function sendChatMessage(chatId: string, body: string): Promise<{ success: boolean; data?: any; message?: any }> {
  try {
    return await apiPost<{ success: boolean; data: any }>(`/api/v1/chats/profile/${chatId}/messages`, { body });
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function sendChatMessageWithMedia(chatId: string, body: string, files: File[]): Promise<{ success: boolean; data?: any; message?: any }> {
  try {
    const formData = new FormData();
    formData.append("body", body);
    for (const file of files) {
      formData.append("media", file);
    }
    return await apiPostFormData<{ success: boolean; data: any }>(`/api/v1/chats/profile/${chatId}/messages`, formData);
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}
