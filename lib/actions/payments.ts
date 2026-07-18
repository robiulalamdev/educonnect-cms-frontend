"use server";

import { apiGet } from "@/lib/api";

/**
 * Get my payment history.
 */
export async function getMyPaymentHistory(page = 1, limit = 10) {
  try {
    return await apiGet(`/api/v1/payment/history?page=${page}&limit=${limit}`);
  } catch {
    return { success: false, data: [], meta: { total: 0, total_pages: 0 } };
  }
}

/**
 * Get payment records (admin/teacher).
 */
export async function getPaymentRecords(
  page = 1,
  limit = 10,
  filters?: { status?: string; method?: string; search?: string },
) {
  try {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (filters?.status) params.set("status", filters.status);
    if (filters?.method) params.set("method", filters.method);
    if (filters?.search) params.set("search", filters.search);
    return await apiGet(`/api/v1/payment?${params}`);
  } catch {
    return { success: false, data: [], meta: { total: 0, total_pages: 0 } };
  }
}

/**
 * Get payment stats.
 */
export async function getPaymentStats() {
  try {
    return await apiGet("/api/v1/payment/stats");
  } catch {
    return { success: false, data: {} };
  }
}
