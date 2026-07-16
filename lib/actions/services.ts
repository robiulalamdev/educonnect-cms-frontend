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

export async function getMyServices(page = 1, limit = 10) {
  try {
    return await serverFetch(`/api/v1/services/profile/teacher?page=${page}&limit=${limit}`);
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") redirect(ROUTES.LOGIN);
    return { success: false, data: [], meta: { total: 0, page, limit, total_pages: 0 } };
  }
}

export async function getServiceById(id: string) {
  try {
    return await serverFetch(`/api/v1/services/${id}`);
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") redirect(ROUTES.LOGIN);
    return { success: false, data: null };
  }
}

export async function createServiceAction(
  _prevState: any,
  formData: FormData,
): Promise<{ error?: string; success?: boolean; serviceId?: string }> {
  try {
    const body: any = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      format: formData.get("format") as string,
      mode: formData.get("mode") as string,
      subject_ids: JSON.parse(formData.get("subject_ids") as string || "[]"),
      level_ids: JSON.parse(formData.get("level_ids") as string || "[]"),
    };

    const country = formData.get("country") as string;
    const city = formData.get("city") as string;
    const area = formData.get("area") as string;
    const meeting_link = formData.get("meeting_link") as string;
    const joining_fee = formData.get("joining_fee") as string;
    const monthly_fee = formData.get("monthly_fee") as string;
    const per_session_fee = formData.get("per_session_fee") as string;
    const fee_note = formData.get("fee_note") as string;
    const currency = formData.get("currency") as string;

    if (country) body.country = country;
    if (city) body.city = city;
    if (area) body.area = area;
    if (meeting_link) body.meeting_link = meeting_link;
    if (joining_fee) body.joining_fee = parseFloat(joining_fee);
    if (monthly_fee) body.monthly_fee = parseFloat(monthly_fee);
    if (per_session_fee) body.per_session_fee = parseFloat(per_session_fee);
    if (fee_note) body.fee_note = fee_note;
    if (currency) body.currency = currency;

    const res = await serverFetch<any>(`/api/v1/services/profile/teacher`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    return { success: true, serviceId: res.data?.id };
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") redirect(ROUTES.LOGIN);
    return { error: err.message ?? "Failed to create service" };
  }
}

export async function updateServiceAction(
  serviceId: string,
  _prevState: any,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  try {
    const body: any = {};
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const status = formData.get("status") as string;

    if (title) body.title = title;
    if (description) body.description = description;
    if (status) body.status = status;

    await serverFetch<any>(`/api/v1/services/profile/teacher/${serviceId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    return { success: true };
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") redirect(ROUTES.LOGIN);
    return { error: err.message ?? "Failed to update service" };
  }
}
