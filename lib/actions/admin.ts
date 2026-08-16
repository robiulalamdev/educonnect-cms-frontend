"use server";

import { apiGet, apiPatch, apiPost, apiPostFormData, apiDelete } from "@/lib/api";

export async function getAdminTeachers(params: string): Promise<{ success: boolean; data?: any; meta?: any; error?: any }> {
  try {
    const data = await apiGet<{ success: boolean; data: any; meta: any }>(
      `/api/v1/admin/dashboard/teachers?${params}`,
      { isAdmin: true }
    );
    return data;
  } catch (err: any) {
    return { success: false, data: null, error: err.message };
  }
}

export async function rejectTeacherAction(id: string): Promise<{ success: boolean; message?: string; error?: any }> {
  try {
    const data = await apiPatch<{ success: boolean; message: string }>(
      `/api/v1/admin/dashboard/teachers/${id}/reject`,
      {},
      { isAdmin: true }
    );
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getAdminUsers(params: string): Promise<{ success: boolean; data?: any; meta?: any; error?: any }> {
  try {
    const data = await apiGet<{ success: boolean; data: any; meta: any }>(
      `/api/v1/admin/dashboard/users?${params}`,
      { isAdmin: true }
    );
    return data;
  } catch (err: any) {
    return { success: false, data: null, error: err.message };
  }
}

export async function getAdminUserById(id: string): Promise<{ success: boolean; data?: any; error?: any }> {
  try {
    const data = await apiGet<{ success: boolean; data: any }>(
      `/api/v1/admin/dashboard/users/${id}`,
      { isAdmin: true }
    );
    return data;
  } catch (err: any) {
    return { success: false, data: null, error: err.message };
  }
}

export async function createUserByAdminAction(input: {
  full_name: string;
  email: string;
  password: string;
  role: string;
  phone?: string;
}): Promise<{ success: boolean; data?: any; message?: string; error?: any }> {
  try {
    const data = await apiPost<{ success: boolean; data: any; message: string }>(
      "/api/v1/admin/dashboard/users",
      input,
      { isAdmin: true }
    );
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateUserByAdminAction(id: string, input: {
  full_name?: string;
  email?: string;
  phone?: string;
  role?: string;
  status?: string;
}): Promise<{ success: boolean; data?: any; message?: string; error?: any }> {
  try {
    const data = await apiPatch<{ success: boolean; data: any; message: string }>(
      `/api/v1/admin/dashboard/users/${id}`,
      input,
      { isAdmin: true }
    );
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function suspendUserAction(id: string): Promise<{ success: boolean; message?: string; error?: any }> {
  try {
    const data = await apiPatch<{ success: boolean; message: string }>(
      `/api/v1/admin/dashboard/users/${id}/suspend`,
      {},
      { isAdmin: true }
    );
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function banUserAction(id: string): Promise<{ success: boolean; message?: string; error?: any }> {
  try {
    const data = await apiPatch<{ success: boolean; message: string }>(
      `/api/v1/admin/dashboard/users/${id}/ban`,
      {},
      { isAdmin: true }
    );
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function reactivateUserAction(id: string): Promise<{ success: boolean; message?: string; error?: any }> {
  try {
    const data = await apiPatch<{ success: boolean; message: string }>(
      `/api/v1/admin/dashboard/users/${id}/reactivate`,
      {},
      { isAdmin: true }
    );
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function approveTeacherAction(id: string): Promise<{ success: boolean; message?: string; error?: any }> {
  try {
    const data = await apiPatch<{ success: boolean; message: string }>(
      `/api/v1/admin/dashboard/users/${id}/approve-teacher`,
      {},
      { isAdmin: true }
    );
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteUserAction(id: string): Promise<{ success: boolean; message?: string; error?: any }> {
  try {
    const data = await apiDelete<{ success: boolean; message: string }>(
      `/api/v1/admin/dashboard/users/${id}`,
      { isAdmin: true }
    );
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getAdminAdmins(params: string): Promise<{ success: boolean; data?: any; meta?: any; error?: any }> {
  try {
    const data = await apiGet<{ success: boolean; data: any; meta: any }>(
      `/api/v1/admin/dashboard/admins?${params}`,
      { isAdmin: true }
    );
    return data;
  } catch (err: any) {
    return { success: false, data: null, error: err.message };
  }
}

export async function getAdminPosts(params: string): Promise<{ success: boolean; data?: any; meta?: any; error?: any }> {
  try {
    const data = await apiGet<{ success: boolean; data: any; meta: any }>(
      `/api/v1/admin/dashboard/posts?${params}`,
      { isAdmin: true }
    );
    return data;
  } catch (err: any) {
    return { success: false, data: null, error: err.message };
  }
}

export async function getAdminReviews(params: string): Promise<{ success: boolean; data?: any; meta?: any; error?: any }> {
  try {
    const data = await apiGet<{ success: boolean; data: any; meta: any }>(
      `/api/v1/admin/dashboard/reviews?${params}`,
      { isAdmin: true }
    );
    return data;
  } catch (err: any) {
    return { success: false, data: null, error: err.message };
  }
}

export async function hideReviewAction(id: string): Promise<{ success: boolean; message?: string; error?: any }> {
  try {
    const data = await apiPatch<{ success: boolean; message: string }>(
      `/api/v1/admin/dashboard/reviews/${id}/hide`,
      {},
      { isAdmin: true }
    );
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getSubscriptionPackages(params: string): Promise<{ success: boolean; data?: any; meta?: any; error?: any }> {
  try {
    const data = await apiGet<{ success: boolean; data: any; meta: any }>(
      `/api/v1/admin/dashboard/subscriptions?${params}`,
      { isAdmin: true }
    );
    return data;
  } catch (err: any) {
    return { success: false, data: null, error: err.message };
  }
}

export async function registerAdminAction(
  full_name: string,
  email: string,
  password: string,
  role: string,
): Promise<{ success: boolean; data?: any; message?: string; error?: any }> {
  try {
    const formData = new FormData();
    formData.append("full_name", full_name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", role);

    const data = await apiPostFormData<{ success: boolean; data: any; message: string }>(
      "/api/v1/admin/dashboard/admins",
      formData,
      { isAdmin: true }
    );
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteAdminAction(id: string): Promise<{ success: boolean; message?: string; error?: any }> {
  try {
    const data = await apiDelete<{ success: boolean; message: string }>(
      `/api/v1/admin/dashboard/admins/${id}`,
      { isAdmin: true }
    );
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateAdminAction(id: string, input: {
  full_name?: string;
  email?: string;
  role?: string;
  status?: string;
}): Promise<{ success: boolean; data?: any; message?: string; error?: any }> {
  try {
    const data = await apiPatch<{ success: boolean; data: any; message: string }>(
      `/api/v1/admin/dashboard/admins/${id}`,
      input,
      { isAdmin: true }
    );
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getAuditLogs(params: string): Promise<{ success: boolean; data?: any; meta?: any; error?: any }> {
  try {
    const data = await apiGet<{ success: boolean; data: any; meta: any }>(
      `/api/v1/admin/dashboard/audit-logs?${params}`,
      { isAdmin: true }
    );
    return data;
  } catch (err: any) {
    return { success: false, data: null, error: err.message };
  }
}

// ── Class Room (Admin Batches) ──────────────────────────────
export async function getAdminBatches(params: string): Promise<{ success: boolean; data?: any; meta?: any; error?: any }> {
  try {
    const data = await apiGet<{ success: boolean; data: any; meta: any }>(
      `/api/v1/batches/dashboard?${params}`,
      { isAdmin: true }
    );
    return data;
  } catch (err: any) {
    return { success: false, data: null, error: err.message };
  }
}

// ── Guardian-Student Links ───────────────────────────────

export async function getGuardianLinks(params: string): Promise<{ success: boolean; data?: any; meta?: any; error?: any }> {
  try {
    const data = await apiGet<{ success: boolean; data: any; meta: any }>(
      `/api/v1/admin/dashboard/guardian-links?${params}`,
      { isAdmin: true }
    );
    return data;
  } catch (err: any) {
    return { success: false, data: null, error: err.message };
  }
}

export async function createGuardianLink(guardianUserId: string, studentUserId: string, relationLabel: string): Promise<{ success: boolean; data?: any; message?: string; error?: any }> {
  try {
    const data = await apiPost<{ success: boolean; data: any; message: string }>(
      "/api/v1/admin/dashboard/guardian-links",
      { guardian_user_id: guardianUserId, student_user_id: studentUserId, relation_label: relationLabel },
      { isAdmin: true }
    );
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function removeGuardianLink(linkId: string): Promise<{ success: boolean; message?: string; error?: any }> {
  try {
    const data = await apiDelete<{ success: boolean; message: string }>(
      `/api/v1/admin/dashboard/guardian-links/${linkId}`,
      { isAdmin: true }
    );
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ── Moderation ────────────────────────────────────────────
export async function getModerationItems(params: string): Promise<{ success: boolean; data?: any; meta?: any; error?: any }> {
  try {
    const data = await apiGet<{ success: boolean; data: any; meta: any }>(
      `/api/v1/admin/dashboard/moderation?${params}`,
      { isAdmin: true }
    );
    return data;
  } catch (err: any) {
    return { success: false, data: null, error: err.message };
  }
}

export async function removePostAction(id: string): Promise<{ success: boolean; message?: string; error?: any }> {
  try {
    const data = await apiPatch<{ success: boolean; message: string }>(
      `/api/v1/admin/dashboard/posts/${id}/remove`,
      {},
      { isAdmin: true }
    );
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ── Admin Payments ────────────────────────────────────────
export async function getAdminPayments(params: string): Promise<{ success: boolean; data?: any; meta?: any; error?: any }> {
  try {
    const data = await apiGet<{ success: boolean; data: any; meta: any }>(
      `/api/v1/admin/dashboard/payments?${params}`,
      { isAdmin: true }
    );
    return data;
  } catch (err: any) {
    return { success: false, data: null, error: err.message };
  }
}

export async function getPaymentStats(): Promise<{ success: boolean; data?: any; error?: any }> {
  try {
    const data = await apiGet<{ success: boolean; data: any }>(
      "/api/v1/payment/stats",
      { isAdmin: true }
    );
    return data;
  } catch (err: any) {
    return { success: false, data: null, error: err.message };
  }
}
