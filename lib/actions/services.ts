"use server";

import { apiGet, apiPostFormData } from "@/lib/api";
import { API } from "@/lib/constants";

/**
 * Get teacher's services.
 */
export async function getMyServices(page = 1, limit = 10) {
  try {
    return await apiGet(`/api/v1/services/profile/teacher?page=${page}&limit=${limit}`);
  } catch {
    return { success: false, data: [], meta: { total: 0, total_pages: 0 } };
  }
}

/**
 * Get service by ID.
 */
export async function getServiceById(id: string) {
  try {
    return await apiGet(`${API.SERVICE}/${id}`);
  } catch {
    return { success: false, data: null };
  }
}

/**
 * Create a new service.
 */
export async function createServiceAction(
  _prevState: any,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  const data: Record<string, any> = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });

  try {
    await apiPostFormData(API.SERVICE + "/profile/teacher", formData);
    return { success: true };
  } catch (err: any) {
    return { error: err.message ?? "Failed to create service" };
  }
}

/**
 * Update a service.
 */
export async function updateServiceAction(
  serviceId: string,
  _prevState: any,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  try {
    await apiPostFormData(`${API.SERVICE}/profile/teacher/${serviceId}`, formData);
    return { success: true };
  } catch (err: any) {
    return { error: err.message ?? "Failed to update service" };
  }
}
