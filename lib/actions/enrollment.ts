"use server";

import { apiPost, apiPatch, apiGet } from "@/lib/api";

// ── Student Enrollment ──────────────────────────────────────

export async function createEnrollment(batchId: string): Promise<{ success: boolean; data?: any; message?: string }> {
  try {
    const res = await apiPost<{ success: boolean; data: any; message?: string }>("/api/v1/enrollments/profile/student", { batch_id: batchId });
    if (!res.success) throw new Error(res.message);
    return res;
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to create enrollment" };
  }
}

export async function submitEnrollmentPayment(
  enrollmentId: string,
  payload: {
    amount: number;
    method: "BKASH" | "NAGAD" | "ROCKET" | "BANK_TRANSFER" | "CASH" | "OTHER";
    transaction_id: string;
    sender_name?: string;
    sender_number?: string;
    note?: string;
    payment_for?: string;
  }
): Promise<{ success: boolean; data?: any; message?: string }> {
  try {
    const res = await apiPost<{ success: boolean; data: any; message?: string }>(
      `/api/v1/enrollments/profile/student/${enrollmentId}/payment`,
      payload
    );
    if (!res.success) throw new Error(res.message);
    return res;
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to submit payment" };
  }
}

export async function getMyStudentEnrollments(page = 1, limit = 10): Promise<{ success: boolean; data?: any; meta?: any; error?: any }> {
  try {
    const data = await apiGet<{ success: boolean; data: any; meta: any }>(
      `/api/v1/enrollments/profile/student?page=${page}&limit=${limit}`
    );
    return data;
  } catch (err: any) {
    return { success: false, data: null, error: err.message };
  }
}

// ── Teacher Enrollment Management ───────────────────────────

export async function getTeacherEnrollments(params: string): Promise<{ success: boolean; data?: any; meta?: any; error?: any }> {
  try {
    const data = await apiGet<{ success: boolean; data: any; meta: any }>(
      `/api/v1/enrollments/profile/teacher?${params}`
    );
    return data;
  } catch (err: any) {
    return { success: false, data: null, error: err.message };
  }
}

export async function updateEnrollmentStatus(
  enrollmentId: string,
  payload: {
    status: string;
    suspension_reason?: string;
    suspension_until?: string;
    removal_reason?: string;
  }
): Promise<{ success: boolean; data?: any; message?: string; error?: any }> {
  try {
    const data = await apiPatch<{ success: boolean; data: any; message: string }>(
      `/api/v1/enrollments/profile/teacher/${enrollmentId}/status`,
      payload
    );
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateTeacherPaymentStatus(
  paymentId: string,
  payload: { status: string }
): Promise<{ success: boolean; data?: any; message?: string; error?: any }> {
  try {
    const data = await apiPatch<{ success: boolean; data: any; message: string }>(
      `/api/v1/enrollments/profile/teacher/payment/${paymentId}`,
      payload
    );
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ── Admin Enrollment Management ─────────────────────────────

export async function getAdminEnrollments(params: string): Promise<{ success: boolean; data?: any; meta?: any; error?: any }> {
  try {
    const data = await apiGet<{ success: boolean; data: any; meta: any }>(
      `/api/v1/enrollments/dashboard/?${params}`,
      { isAdmin: true }
    );
    return data;
  } catch (err: any) {
    return { success: false, data: null, error: err.message };
  }
}

export async function updateAdminEnrollmentStatus(
  enrollmentId: string,
  payload: {
    status: string;
    suspension_reason?: string;
    suspension_until?: string;
    removal_reason?: string;
  }
): Promise<{ success: boolean; data?: any; message?: string; error?: any }> {
  try {
    const data = await apiPatch<{ success: boolean; data: any; message: string }>(
      `/api/v1/enrollments/dashboard/${enrollmentId}/status`,
      payload,
      { isAdmin: true }
    );
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateAdminPaymentStatus(
  paymentId: string,
  payload: { status: string }
): Promise<{ success: boolean; data?: any; message?: string; error?: any }> {
  try {
    const data = await apiPatch<{ success: boolean; data: any; message: string }>(
      `/api/v1/enrollments/dashboard/payment/${paymentId}`,
      payload,
      { isAdmin: true }
    );
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
