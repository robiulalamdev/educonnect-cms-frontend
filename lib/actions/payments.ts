"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import env from "@/config/.env";

const API_BASE = env.API_BASE_URL;

async function serverFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: { Cookie: cookieHeader, ...options.headers },
    cache: "no-store",
  });

  if (res.status === 401) throw new Error("UNAUTHORIZED");
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message ?? "API_ERROR");
  return data as T;
}

/**
 * Get payment history for the current student.
 */
export async function getMyPaymentHistory(page = 1, limit = 20) {
  try {
    return await serverFetch(`/api/v1/payment/history?page=${page}&limit=${limit}`);
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") redirect(ROUTES.LOGIN);
    return {
      success: false,
      data: [],
      meta: { total: 0, page, limit, total_pages: 0, has_next: false },
    };
  }
}

/**
 * Get all payment records (teacher/admin view).
 */
export async function getPaymentRecords(
  page = 1,
  limit = 20,
  filters?: { status?: string; method?: string; search?: string },
) {
  try {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (filters?.status) params.set("status", filters.status);
    if (filters?.method) params.set("method", filters.method);
    if (filters?.search) params.set("search", filters.search);

    return await serverFetch(`/api/v1/payment?${params.toString()}`);
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") redirect(ROUTES.LOGIN);
    return {
      success: false,
      data: [],
      meta: { total: 0, page, limit, total_pages: 0, has_next: false },
    };
  }
}

/**
 * Get payment stats (teacher/admin view).
 */
export async function getPaymentStats() {
  try {
    return await serverFetch(`/api/v1/payment/stats`);
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") redirect(ROUTES.LOGIN);
    return { success: false, data: null };
  }
}
