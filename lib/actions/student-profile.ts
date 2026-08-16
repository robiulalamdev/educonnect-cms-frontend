"use server";

import { apiGet, apiPatchFormData } from "@/lib/api";

export async function getStudentProfile(): Promise<{ success: boolean; data?: any; error?: any }> {
  try {
    const data = await apiGet<{ success: boolean; data: any }>("/api/v1/student/profile");
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateStudentProfile(formData: FormData): Promise<{ success: boolean; data?: any; message?: string; error?: any }> {
  try {
    const data = await apiPatchFormData<{ success: boolean; data: any; message: string }>(
      "/api/v1/student/profile",
      formData
    );
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getStudentDetails(studentId: string): Promise<{ success: boolean; data?: any; error?: any }> {
  try {
    const data = await apiGet<{ success: boolean; data: any }>(`/api/v1/student/${studentId}`);
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
