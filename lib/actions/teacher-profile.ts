"use server";

import { apiGet, apiPatchFormData } from "@/lib/api";

export async function getTeacherProfile(): Promise<{ success: boolean; data?: any; error?: any }> {
  try {
    const data = await apiGet<{ success: boolean; data: any }>("/api/v1/teacher/profile");
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateTeacherProfile(formData: FormData): Promise<{ success: boolean; data?: any; message?: string; error?: any }> {
  try {
    const data = await apiPatchFormData<{ success: boolean; data: any; message: string }>(
      "/api/v1/teacher/profile",
      formData
    );
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getTeacherDetails(teacherId: string): Promise<{ success: boolean; data?: any; error?: any }> {
  try {
    const data = await apiGet<{ success: boolean; data: any }>(`/api/v1/teacher/${teacherId}`);
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
