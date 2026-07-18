"use server";

import { apiGet, apiPostFormData, apiPatchFormData } from "@/lib/api";
import { API } from "@/lib/constants";

/**
 * Get my posts.
 */
export async function getMyPosts(page = 1, limit = 10) {
  try {
    return await apiGet(`/api/v1/posts/profile/?page=${page}&limit=${limit}`);
  } catch {
    return { success: false, data: [], meta: { total: 0, total_pages: 0 } };
  }
}

/**
 * Get post by ID.
 */
export async function getPostById(id: string) {
  try {
    return await apiGet(`${API.POST}/${id}`);
  } catch {
    return { success: false, data: null };
  }
}

/**
 * Create a new post (multipart FormData with media).
 */
export async function createPostAction(
  _prevState: any,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  try {
    await apiPostFormData("/api/v1/posts/profile/", formData);
    return { success: true };
  } catch (err: any) {
    return { error: err.message ?? "Failed to create post" };
  }
}

/**
 * Update a post (multipart FormData).
 */
export async function updatePostAction(
  postId: string,
  _prevState: any,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  try {
    await apiPatchFormData(`/api/v1/posts/profile/${postId}`, formData);
    return { success: true };
  } catch (err: any) {
    return { error: err.message ?? "Failed to update post" };
  }
}

/**
 * Delete a post (soft delete).
 */
export async function deletePostAction(
  postId: string,
): Promise<{ error?: string; success?: boolean }> {
  try {
    await apiPatchFormData(`/api/v1/posts/profile/${postId}`, new FormData());
    return { success: true };
  } catch (err: any) {
    return { error: err.message ?? "Failed to delete post" };
  }
}
