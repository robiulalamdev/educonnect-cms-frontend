"use server";

import { apiGet, apiPost, apiDelete, apiPostFormData } from "@/lib/api";

/**
 * Get stories feed.
 */
export async function getStoriesFeed() {
  try {
    return await apiGet("/api/v1/stories/");
  } catch {
    return { success: false, data: [] };
  }
}

/**
 * Get user stories.
 */
export async function getUserStories(userId: string) {
  try {
    return await apiGet(`/api/v1/stories/user/${userId}`);
  } catch {
    return { success: false, data: [] };
  }
}

/**
 * View a story.
 */
export async function viewStory(storyId: string) {
  try {
    return await apiPost(`/api/v1/stories/${storyId}/view`);
  } catch {
    return { success: false };
  }
}

/**
 * Get story viewers.
 */
export async function getStoryViewers(storyId: string) {
  try {
    return await apiGet(`/api/v1/stories/${storyId}/viewers`);
  } catch {
    return { success: false, data: [] };
  }
}

/**
 * Delete a story.
 */
export async function deleteStory(storyId: string) {
  try {
    return await apiDelete(`/api/v1/stories/${storyId}`);
  } catch {
    return { success: false };
  }
}

/**
 * Create a story (multipart FormData).
 */
export async function createStoryAction(
  _prevState: any,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  try {
    await apiPostFormData("/api/v1/stories/", formData);
    return { success: true };
  } catch (err: any) {
    return { error: err.message ?? "Failed to create story" };
  }
}
