"use server";

import { apiGet } from "@/lib/api";

export async function searchUsersAction(searchQuery: string) {
  try {
    const data = await apiGet<{ success: boolean; data: any; message?: string }>(`/api/v1/user/?search=${encodeURIComponent(searchQuery)}`);
    return data;
  } catch (err: any) {
    return { success: false, data: null, error: err.message };
  }
}
