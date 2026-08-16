"use server";

import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api";

export async function getGuardianProfile(): Promise<{ success: boolean; data?: any; error?: any }> {
  try {
    const data = await apiGet<{ success: boolean; data: any }>("/api/v1/guardian/me");
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateGuardianProfile(input: { occupation?: string }): Promise<{ success: boolean; data?: any; message?: string; error?: any }> {
  try {
    const data = await apiPatch<{ success: boolean; data: any; message: string }>(
      "/api/v1/guardian/profile",
      input
    );
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function sendGuardianLinkRequest(studentEmail: string, relationLabel: string): Promise<{ success: boolean; data?: any; message?: string; error?: any }> {
  try {
    const data = await apiPost<{ success: boolean; data: any; message: string }>(
      "/api/v1/guardian/link-request",
      { student_email: studentEmail, relation_label: relationLabel }
    );
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function respondToGuardianLink(linkId: string, status: "ACCEPTED" | "REJECTED"): Promise<{ success: boolean; data?: any; message?: string; error?: any }> {
  try {
    const data = await apiPatch<{ success: boolean; data: any; message: string }>(
      `/api/v1/guardian/link-request/${linkId}/respond`,
      { status }
    );
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getMyGuardianLinks(): Promise<{ success: boolean; data?: any; error?: any }> {
  try {
    const data = await apiGet<{ success: boolean; data: any }>("/api/v1/guardian/links");
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function removeGuardianLink(linkId: string): Promise<{ success: boolean; message?: string; error?: any }> {
  try {
    const data = await apiDelete<{ success: boolean; message: string }>(
      `/api/v1/guardian/links/${linkId}`
    );
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
