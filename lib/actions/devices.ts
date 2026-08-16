"use server";

import { apiGet, apiPost, apiDelete } from "@/lib/api";

export async function registerDevice(fcmToken: string, platform: string = "web"): Promise<{ success: boolean; data?: any; message?: string; error?: any }> {
  try {
    const data = await apiPost<{ success: boolean; data: any; message: string }>(
      "/api/v1/devices/register",
      { fcm_token: fcmToken, platform }
    );
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getDevices(): Promise<{ success: boolean; data?: any; error?: any }> {
  try {
    const data = await apiGet<{ success: boolean; data: any }>("/api/v1/devices/");
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function removeDevice(fcmToken: string): Promise<{ success: boolean; message?: string; error?: any }> {
  try {
    const data = await apiDelete<{ success: boolean; message: string }>(
      `/api/v1/devices/${encodeURIComponent(fcmToken)}`
    );
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function removeDeviceById(deviceId: string): Promise<{ success: boolean; message?: string; error?: any }> {
  try {
    const data = await apiDelete<{ success: boolean; message: string }>(
      `/api/v1/devices/id/${deviceId}`
    );
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deactivateAllDevices(): Promise<{ success: boolean; message?: string; error?: any }> {
  try {
    const data = await apiPost<{ success: boolean; message: string }>(
      "/api/v1/devices/deactivate-all"
    );
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
