"use server";

import { apiGet, apiPost, apiDelete } from "@/lib/api";

/**
 * Get comments for a post.
 */
export async function getComments(postId: string, page = 1, limit = 20) {
  try {
    return await apiGet(`/api/v1/posts/${postId}/comments?page=${page}&limit=${limit}`);
  } catch {
    return { success: false, data: [], meta: { total: 0, total_pages: 0 } };
  }
}

/**
 * Create a comment.
 */
export async function createComment(
  postId: string,
  content: string,
  parentId?: string,
) {
  try {
    return await apiPost(`/api/v1/posts/${postId}/comments`, {
      content,
      parent_id: parentId,
    });
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

/**
 * Delete a comment.
 */
export async function deleteComment(commentId: string) {
  try {
    return await apiDelete(`/api/v1/posts/comments/${commentId}`);
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

/**
 * Get replies to a comment.
 */
export async function getReplies(commentId: string, page = 1, limit = 10) {
  try {
    return await apiGet(`/api/v1/posts/comments/${commentId}/replies?page=${page}&limit=${limit}`);
  } catch {
    return { success: false, data: [], meta: { total: 0, total_pages: 0 } };
  }
}

/**
 * Toggle like on a post.
 */
export async function togglePostLike(postId: string) {
  try {
    return await apiPost(`/api/v1/posts/${postId}/like`);
  } catch {
    return { success: false };
  }
}

/**
 * Get likes for a post.
 */
export async function getPostLikes(postId: string) {
  try {
    return await apiGet(`/api/v1/posts/${postId}/like`);
  } catch {
    return { success: false, data: [] };
  }
}

/**
 * Toggle like on a comment.
 */
export async function toggleCommentLike(commentId: string) {
  try {
    return await apiPost(`/api/v1/posts/comments/${commentId}/like`);
  } catch {
    return { success: false };
  }
}
