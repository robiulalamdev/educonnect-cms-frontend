"use server";

import { apiGet } from "@/lib/api";

export async function getCalendarEventsAction(start: string, end: string): Promise<{ success: boolean; data?: any; error?: any }> {
  try {
    const data = await apiGet<{ success: boolean; data: any }>(`/api/v1/batches/calendar?start=${start}&end=${end}`);
    return data;
  } catch (err: any) {
    return { success: false, data: null, error: err.message };
  }
}
