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

export async function createStoryAction(
  _prevState: any,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  try {
    const content = formData.get("content") as string;
    const bg_color = formData.get("bg_color") as string;
    const file = formData.get("media") as File;

    let body: any = {};
    if (content) body.content = content;
    if (bg_color) body.bg_color = bg_color;
    if (file && file.size > 0) body.media_type = "IMAGE";

    // For text stories, send JSON
    if (!file || file.size === 0) {
      const cookieStore = await cookies();
      const cookieHeader = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");
      const res = await fetch(`${env.API_BASE_URL}/api/v1/stories/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Cookie: cookieHeader },
        body: JSON.stringify(body),
        cache: "no-store",
      });
      if (!res.ok) {
        const data = await res.json();
        return { error: data.message || "Failed to create story" };
      }
      return { success: true };
    }

    // For image stories, send FormData
    const submitData = new FormData();
    if (content) submitData.append("content", content);
    submitData.append("media_type", "IMAGE");
    submitData.append("media", file);

    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");
    const res = await fetch(`${env.API_BASE_URL}/api/v1/stories/`, {
      method: "POST",
      headers: { Cookie: cookieHeader },
      body: submitData,
      cache: "no-store",
    });
    if (!res.ok) {
      const data = await res.json();
      return { error: data.message || "Failed to create story" };
    }
    return { success: true };
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") redirect(ROUTES.LOGIN);
    return { error: err.message ?? "Something went wrong" };
  }
}
