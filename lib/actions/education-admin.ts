"use server";

import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api";

export async function getEducationData() {
  try {
    const [groups, levels, categories, subjects] = await Promise.all([
      apiGet("/api/v1/education/groups"),
      apiGet("/api/v1/education/levels"),
      apiGet("/api/v1/education/categories"),
      apiGet("/api/v1/education/subjects"),
    ]);
    return {
      success: true,
      groups: (groups as any).data || [],
      levels: (levels as any).data || [],
      categories: (categories as any).data || [],
      subjects: (subjects as any).data || [],
    };
  } catch {
    return { success: false, groups: [], levels: [], categories: [], subjects: [] };
  }
}

export async function createLevelGroup(data: { name: string; sort_order?: number }) {
  return apiPost("/api/v1/education/dashboard/level-groups", data);
}

export async function updateLevelGroup(id: string, data: { name?: string; sort_order?: number; is_active?: boolean }) {
  return apiPatch(`/api/v1/education/dashboard/level-groups/${id}`, data);
}

export async function deleteLevelGroup(id: string) {
  return apiDelete(`/api/v1/education/dashboard/level-groups/${id}`);
}

export async function createLevel(data: { group_id: string; name: string; sort_order?: number }) {
  return apiPost("/api/v1/education/dashboard/levels", data);
}

export async function updateLevel(id: string, data: { name?: string; sort_order?: number; is_active?: boolean }) {
  return apiPatch(`/api/v1/education/dashboard/levels/${id}`, data);
}

export async function deleteLevel(id: string) {
  return apiDelete(`/api/v1/education/dashboard/levels/${id}`);
}

export async function createSubjectCategory(data: { name: string }) {
  return apiPost("/api/v1/education/dashboard/subject-categories", data);
}

export async function updateSubjectCategory(id: string, data: { name?: string; is_active?: boolean }) {
  return apiPatch(`/api/v1/education/dashboard/subject-categories/${id}`, data);
}

export async function deleteSubjectCategory(id: string) {
  return apiDelete(`/api/v1/education/dashboard/subject-categories/${id}`);
}

export async function createSubject(data: { category_id: string; name: string }) {
  return apiPost("/api/v1/education/dashboard/subjects", data);
}

export async function updateSubject(id: string, data: { name?: string; is_active?: boolean }) {
  return apiPatch(`/api/v1/education/dashboard/subjects/${id}`, data);
}

export async function deleteSubject(id: string) {
  return apiDelete(`/api/v1/education/dashboard/subjects/${id}`);
}
