"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ROUTES, API } from "@/lib/constants";
import env from "@/config/.env";

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

/**
 * Server-side fetch helper that forwards cookies to the backend.
 */
async function serverFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
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

  const data = await res.json();
  return { ...data, _status: res.status } as ApiResponse<T> & { _status: number };
}

/**
 * Register a new user.
 * On success, sets auth cookies and redirects to dashboard.
 */
export async function registerAction(
  _prevState: any,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  const full_name = formData.get("full_name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;
  const phone = formData.get("phone") as string | null;

  if (!full_name || !email || !password || !role) {
    return { error: "All fields are required." };
  }

  try {
    const result = await serverFetch(API.AUTH.REGISTER, {
      method: "POST",
      body: JSON.stringify({
        full_name,
        email,
        password,
        role,
        phone: phone || undefined,
      }),
    });

    if (!result.success) {
      return { error: result.message ?? "Registration failed." };
    }

    // Set cookies from Set-Cookie headers
    const cookieStore = await cookies();
    // The backend sets cookies via Set-Cookie header — extract and forward
    // For now, the login after register will handle cookies
  } catch (err: any) {
    return { error: err.message ?? "Something went wrong." };
  }

  redirect(ROUTES.LOGIN);
}

/**
 * Login action — server-side form handler.
 * On success, the backend sets HTTP-only cookies.
 */
export async function loginAction(
  _prevState: any,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    const url = `${env.API_BASE_URL}${API.AUTH.LOGIN}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      return { error: data.message ?? "Invalid credentials." };
    }

    // Forward Set-Cookie headers to the browser
    const setCookies = res.headers.getSetCookie();
    const cookieStore = await cookies();

    for (const cookieStr of setCookies) {
      const [nameValue, ...rest] = cookieStr.split(";");
      const [name, value] = nameValue.split("=");

      const parts: Record<string, string> = {};
      for (const part of rest) {
        const [key, val] = part.trim().split("=");
        parts[key.toLowerCase()] = val ?? "";
      }

      cookieStore.set(name.trim(), value.trim(), {
        httpOnly: true,
        secure: env.IS_PRODUCTION,
        sameSite: "lax",
        path: parts["path"] ?? "/",
        maxAge: parts["max-age"] ? parseInt(parts["max-age"]) : undefined,
      });
    }
  } catch (err: any) {
    return { error: err.message ?? "Something went wrong." };
  }

  redirect(ROUTES.USER.DASHBOARD);
}

/**
 * Admin login action.
 */
export async function adminLoginAction(
  _prevState: any,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    const url = `${env.API_BASE_URL}${API.ADMIN.AUTH.LOGIN}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      return { error: data.message ?? "Invalid credentials." };
    }

    // Forward Set-Cookie headers to the browser
    const setCookies = res.headers.getSetCookie();
    const cookieStore = await cookies();

    for (const cookieStr of setCookies) {
      const [nameValue, ...rest] = cookieStr.split(";");
      const [name, value] = nameValue.split("=");

      const parts: Record<string, string> = {};
      for (const part of rest) {
        const [key, val] = part.trim().split("=");
        parts[key.toLowerCase()] = val ?? "";
      }

      cookieStore.set(name.trim(), value.trim(), {
        httpOnly: true,
        secure: env.IS_PRODUCTION,
        sameSite: "lax",
        path: parts["path"] ?? "/",
        maxAge: parts["max-age"] ? parseInt(parts["max-age"]) : undefined,
      });
    }
  } catch (err: any) {
    return { error: err.message ?? "Something went wrong." };
  }

  redirect(ROUTES.ADMIN.DASHBOARD);
}

/**
 * Logout action — clears cookies and redirects.
 */
export async function logoutAction(role: "user" | "admin" = "user") {
  const cookieStore = await cookies();

  // Call backend logout to invalidate refresh token
  try {
    const endpoint =
      role === "admin" ? API.ADMIN.AUTH.LOGOUT : API.AUTH.LOGOUT;
    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    await fetch(`${env.API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });
  } catch {
    // Even if backend fails, clear local cookies
  }

  // Clear all auth cookies
  if (role === "admin") {
    cookieStore.delete(env.ADMIN_COOKIE_ACCESS_NAME);
    cookieStore.delete(env.ADMIN_COOKIE_REFRESH_NAME);
  } else {
    cookieStore.delete(env.COOKIE_ACCESS_NAME);
    cookieStore.delete(env.COOKIE_REFRESH_NAME);
  }

  redirect(role === "admin" ? ROUTES.ADMIN.LOGIN : ROUTES.LOGIN);
}
