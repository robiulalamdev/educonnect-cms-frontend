"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import env from "@/config/.env";

const API_BASE = env.API_BASE_URL;

async function serverFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");
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

export async function getStoriesFeed() {
  try {
    return await serverFetch(`/api/v1/stories/`);
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") redirect(ROUTES.LOGIN);
    return { success: false, data: [] };
  }
}

export async function getUserStories(userId: string) {
  try {
    return await serverFetch(`/api/v1/stories/user/${userId}`);
  } catch (err: any) {
    return { success: false, data: [] };
  }
}

export async function viewStory(storyId: string) {
  try {
    return await serverFetch(`/api/v1/stories/${storyId}/view`, { method: "POST" });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") redirect(ROUTES.LOGIN);
    return { success: false };
  }
}

export async function getStoryViewers(storyId: string) {
  try {
    return await serverFetch(`/api/v1/stories/${storyId}/viewers`);
  } catch (err: any) {
    return { success: false, data: [] };
  }
}

export async function deleteStory(storyId: string) {
  try {
    return await serverFetch(`/api/v1/stories/${storyId}`, { method: "DELETE" });
  } catch (err: any) {
    return { success: false };
  }
}
