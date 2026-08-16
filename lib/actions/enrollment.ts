"use server";

import { apiPost, apiPatch } from "@/lib/api";

export async function createEnrollment(batchId: string) {
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
    method: "BKASH" | "NAGAD" | "ROCKET" | "BANK_TRANSFER" | "CASH";
    transaction_id: string;
  }
) {
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
