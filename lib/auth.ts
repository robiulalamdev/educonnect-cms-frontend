import { cookies } from "next/headers";
import env from "@/config/.env";
import { API } from "./constants";

/**
 * Server-side authenticated fetcher.
 * Reads cookies from the current request and forwards them to the backend.
 * Handles token refresh transparently.
 *
 * Use this in: Server Components, Server Actions, Route Handlers (if any).
 */
async function serverFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const url = `${env.API_BASE_URL}${endpoint}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader,
      ...options.headers,
    },
    cache: "no-store",
  });

  // If unauthorized, the middleware already redirects — just throw here
  if (res.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message ?? "API_ERROR");
  }

  return data as T;
}

/**
 * Authenticated GET request.
 */
export async function apiGet<T>(endpoint: string): Promise<T> {
  return serverFetch<T>(endpoint, { method: "GET" });
}

/**
 * Authenticated POST request.
 */
export async function apiPost<T>(
  endpoint: string,
  body?: unknown,
): Promise<T> {
  return serverFetch<T>(endpoint, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * Authenticated PUT request.
 */
export async function apiPut<T>(
  endpoint: string,
  body?: unknown,
): Promise<T> {
  return serverFetch<T>(endpoint, {
    method: "PUT",
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * Authenticated PATCH request.
 */
export async function apiPatch<T>(
  endpoint: string,
  body?: unknown,
): Promise<T> {
  return serverFetch<T>(endpoint, {
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * Authenticated DELETE request.
 */
export async function apiDelete<T>(endpoint: string): Promise<T> {
  return serverFetch<T>(endpoint, { method: "DELETE" });
}

/**
 * Get current user profile from backend.
 * Returns null if not authenticated.
 */
export async function getCurrentUser() {
  try {
    const res = await serverFetch<{ success: boolean; data: any }>(
      API.AUTH.ME,
    );
    return res.data ?? null;
  } catch {
    return null;
  }
}

/**
 * Server-side auth check — returns user or null.
 * Use in Server Components to conditionally render auth UI.
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}
