import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import env from "@/config/.env";
import { ROUTES } from "./constants";

/**
 * Centralized server-side API client.
 * All server actions MUST use this — no more manual fetch + cookie forwarding.
 *
 * Features:
 * - Automatic cookie forwarding (reads from next/headers)
 * - Automatic 401 handling → clears cookies → redirects to login
 * - Standard error handling
 * - Supports both JSON and FormData bodies
 */

const API_BASE = env.API_BASE_URL || "http://localhost:9000";

// ─── Internal: get cookie header ──────────────────────────────
async function getCookieHeader(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
}

// ─── Internal: clear auth cookies ─────────────────────────────
async function clearAuthCookies(isAdmin = false): Promise<void> {
  const cookieStore = await cookies();
  if (isAdmin) {
    cookieStore.delete(env.ADMIN_COOKIE_ACCESS_NAME);
    cookieStore.delete(env.ADMIN_COOKIE_REFRESH_NAME);
  } else {
    cookieStore.delete(env.COOKIE_ACCESS_NAME);
    cookieStore.delete(env.COOKIE_REFRESH_NAME);
  }
}

// ─── Internal: handle 401 ─────────────────────────────────────
async function handle401(isAdmin = false): Promise<never> {
  await clearAuthCookies(isAdmin);
  redirect(isAdmin ? ROUTES.ADMIN.LOGIN : ROUTES.LOGIN);
}

// ─── Internal: forward Set-Cookie from backend ────────────────
async function forwardSetCookies(res: Response, isAdmin = false): Promise<void> {
  const setCookies = res.headers.getSetCookie();
  const cookieStore = await cookies();

  for (const cookieStr of setCookies) {
    const parts = cookieStr.split(";");
    const [nameValue] = parts;
    const eqIndex = nameValue.indexOf("=");
    const name = nameValue.substring(0, eqIndex).trim();
    const value = nameValue.substring(eqIndex + 1).trim();

    const attrs: Record<string, string> = {};
    for (let i = 1; i < parts.length; i++) {
      const part = parts[i].trim();
      const [key, val] = part.split("=");
      attrs[key.toLowerCase()] = val ?? "";
    }

    cookieStore.set(name, value, {
      httpOnly: true,
      secure: env.IS_PRODUCTION,
      sameSite: "lax",
      path: attrs["path"] || "/",
      maxAge: attrs["max-age"]
        ? Math.floor(parseInt(attrs["max-age"]) / 1000)
        : undefined,
    });
  }
}

// ─── Internal: forward Set-Cookie from backend for PUBLIC paths ──
async function forwardSetCookiesFromResponse(res: Response): Promise<void> {
  const setCookies = res.headers.getSetCookie();
  if (setCookies.length === 0) return;
  const cookieStore = await cookies();

  for (const cookieStr of setCookies) {
    const parts = cookieStr.split(";");
    const [nameValue] = parts;
    const eqIndex = nameValue.indexOf("=");
    const name = nameValue.substring(0, eqIndex).trim();
    const value = nameValue.substring(eqIndex + 1).trim();

    const attrs: Record<string, string> = {};
    for (let i = 1; i < parts.length; i++) {
      const part = parts[i].trim();
      const [key, val] = part.split("=");
      attrs[key.toLowerCase()] = val ?? "";
    }

    cookieStore.set(name, value, {
      httpOnly: true,
      secure: env.IS_PRODUCTION,
      sameSite: "lax",
      path: attrs["path"] || "/",
      maxAge: attrs["max-age"]
        ? Math.floor(parseInt(attrs["max-age"]) / 1000)
        : undefined,
    });
  }
}

// ─── Public API: Authenticated requests ───────────────────────

interface FetchOptions extends Omit<RequestInit, "body"> {
  /** If true, handles admin cookies instead of user cookies */
  isAdmin?: boolean;
}

/**
 * Authenticated GET request.
 * Returns parsed JSON response.
 */
export async function apiGet<T = any>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const { isAdmin = false, ...fetchOpts } = options;
  const cookieHeader = await getCookieHeader();

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...fetchOpts,
    method: "GET",
    headers: {
      Cookie: cookieHeader,
      ...fetchOpts.headers,
    },
    cache: "no-store",
  });

  if (res.status === 401) return handle401(isAdmin);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message ?? "API_ERROR");
  }

  return data as T;
}

/**
 * Authenticated POST request (JSON body).
 */
export async function apiPost<T = any>(
  endpoint: string,
  body?: unknown,
  options: FetchOptions = {},
): Promise<T> {
  const { isAdmin = false, ...fetchOpts } = options;
  const cookieHeader = await getCookieHeader();

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...fetchOpts,
    method: "POST",
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      Cookie: cookieHeader,
      ...fetchOpts.headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (res.status === 401) return handle401(isAdmin);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message ?? "API_ERROR");
  }

  return data as T;
}

/**
 * Authenticated PUT request (JSON body).
 */
export async function apiPut<T = any>(
  endpoint: string,
  body?: unknown,
  options: FetchOptions = {},
): Promise<T> {
  const { isAdmin = false, ...fetchOpts } = options;
  const cookieHeader = await getCookieHeader();

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...fetchOpts,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader,
      ...fetchOpts.headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (res.status === 401) return handle401(isAdmin);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message ?? "API_ERROR");
  }

  return data as T;
}

/**
 * Authenticated PATCH request (JSON body).
 */
export async function apiPatch<T = any>(
  endpoint: string,
  body?: unknown,
  options: FetchOptions = {},
): Promise<T> {
  const { isAdmin = false, ...fetchOpts } = options;
  const cookieHeader = await getCookieHeader();

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...fetchOpts,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader,
      ...fetchOpts.headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (res.status === 401) return handle401(isAdmin);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message ?? "API_ERROR");
  }

  return data as T;
}

/**
 * Authenticated PATCH request with FormData body (multipart).
 * Does NOT set Content-Type — lets browser set multipart boundary.
 */
export async function apiPatchFormData<T = any>(
  endpoint: string,
  formData: FormData,
  options: FetchOptions = {},
): Promise<T> {
  const { isAdmin = false, ...fetchOpts } = options;
  const cookieHeader = await getCookieHeader();

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...fetchOpts,
    method: "PATCH",
    headers: {
      Cookie: cookieHeader,
      ...fetchOpts.headers,
    },
    body: formData,
    cache: "no-store",
  });

  if (res.status === 401) return handle401(isAdmin);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message ?? "API_ERROR");
  }

  return data as T;
}

/**
 * Authenticated POST request with FormData body (multipart).
 * Does NOT set Content-Type — lets browser set multipart boundary.
 */
export async function apiPostFormData<T = any>(
  endpoint: string,
  formData: FormData,
  options: FetchOptions = {},
): Promise<T> {
  const { isAdmin = false, ...fetchOpts } = options;
  const cookieHeader = await getCookieHeader();

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...fetchOpts,
    method: "POST",
    headers: {
      Cookie: cookieHeader,
      ...fetchOpts.headers,
    },
    body: formData,
    cache: "no-store",
  });

  if (res.status === 401) return handle401(isAdmin);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message ?? "API_ERROR");
  }

  return data as T;
}

/**
 * Authenticated DELETE request.
 */
export async function apiDelete<T = any>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const { isAdmin = false, ...fetchOpts } = options;
  const cookieHeader = await getCookieHeader();

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...fetchOpts,
    method: "DELETE",
    headers: {
      Cookie: cookieHeader,
      ...fetchOpts.headers,
    },
    cache: "no-store",
  });

  if (res.status === 401) return handle401(isAdmin);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message ?? "API_ERROR");
  }

  return data as T;
}

// ─── Public API: Unauthenticated requests ─────────────────────

/**
 * Public (unauthenticated) GET request.
 */
export async function apiPublicGet<T = any>(
  endpoint: string,
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "GET",
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message ?? "API_ERROR");
  }

  return data as T;
}

/**
 * Public (unauthenticated) POST request (JSON body).
 */
export async function apiPublicPost<T = any>(
  endpoint: string,
  body?: unknown,
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message ?? "API_ERROR");
  }

  return data as T;
}

/**
 * Login action helper — forwards Set-Cookie headers from backend to browser.
 * Used only by login/register flows that need to set cookies.
 */
export async function apiLogin<T = any>(
  endpoint: string,
  body: unknown,
  options: { isAdmin?: boolean } = {},
): Promise<T> {
  const { isAdmin = false } = options;

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    return data as T;
  }

  // Forward Set-Cookie headers to browser
  await forwardSetCookiesFromResponse(res);

  return data as T;
}

// ─── Exported utilities ───────────────────────────────────────

export { clearAuthCookies, handle401, forwardSetCookiesFromResponse };
