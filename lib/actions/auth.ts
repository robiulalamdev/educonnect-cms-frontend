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
 * Register a new user.
 * On success, redirects to login with success message.
 */
export async function registerAction(
  _prevState: any,
  formData: FormData,
): Promise<{ error?: string; success?: boolean; message?: string }> {
  const full_name = formData.get("full_name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;
  const phone = formData.get("phone") as string | null;

  if (!full_name || !email || !password || !role) {
    return { error: "All fields are required." };
  }

  try {
    const res = await fetch(`${env.API_BASE_URL}${API.AUTH.REGISTER}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name,
        email,
        password,
        role,
        phone: phone || undefined,
      }),
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      return { error: data.message ?? "Registration failed." };
    }

    return {
      success: true,
      message: "Registration successful! Please check your email to verify your account, then log in.",
    };
  } catch (err: any) {
    return { error: err.message ?? "Something went wrong. Please try again." };
  }
}

/**
 * Login action — server-side form handler.
 * Forwards Set-Cookie headers from backend to browser.
 */
export async function loginAction(
  _prevState: any,
  formData: FormData,
): Promise<{ error?: string; success?: boolean; message?: string }> {
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

    // Forward Set-Cookie headers from backend to browser via Next.js cookie store
    const setCookies = res.headers.getSetCookie();
    const cookieStore = await cookies();

    for (const cookieStr of setCookies) {
      // Parse: "name=value; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=86400000"
      const parts = cookieStr.split(";");
      const [nameValue] = parts;
      const eqIndex = nameValue.indexOf("=");
      const name = nameValue.substring(0, eqIndex).trim();
      const value = nameValue.substring(eqIndex + 1).trim();

      // Parse attributes
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
        maxAge: attrs["max-age"] ? Math.floor(parseInt(attrs["max-age"]) / 1000) : undefined,
      });
    }
  } catch (err: any) {
    return { error: err.message ?? "Something went wrong. Please try again." };
  }

  redirect(ROUTES.USER.DASHBOARD);
}

/**
 * Admin login action.
 */
export async function adminLoginAction(
  _prevState: any,
  formData: FormData,
): Promise<{ error?: string; success?: boolean; message?: string }> {
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

    // Forward Set-Cookie headers from backend to browser
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
        maxAge: attrs["max-age"] ? Math.floor(parseInt(attrs["max-age"]) / 1000) : undefined,
      });
    }
  } catch (err: any) {
    return { error: err.message ?? "Something went wrong. Please try again." };
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
