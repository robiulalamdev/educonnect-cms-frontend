"use server";

import { apiGet } from "@/lib/api";

export async function getAdminStats() {
  try {
    const data = await apiGet<{ success: boolean; data: any }>("/api/v1/admin/dashboard/stats", { isAdmin: true });
    return data;
  } catch (err: any) {
    return { success: false, data: null, error: err.message };
  }
}

export async function getTeacherStats() {
  try {
    const data = await apiGet<{ success: boolean; data: any }>("/api/v1/statistics/profile/teacher");
    return data;
  } catch (err: any) {
    return { success: false, data: null, error: err.message };
  }
}

export async function getStudentStats() {
  try {
    const data = await apiGet<{ success: boolean; data: any }>("/api/v1/statistics/profile/student");
    return data;
  } catch (err: any) {
    return { success: false, data: null, error: err.message };
  }
}

export async function getGuardianStats() {
  try {
    const data = await apiGet<{ success: boolean; data: any }>("/api/v1/statistics/profile/guardian");
    return data;
  } catch (err: any) {
    return { success: false, data: null, error: err.message };
  }
}
