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
 * On success, redirects to verify-email page.
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

    // Redirect to verify-email page with email as search param
    redirect(`${ROUTES.VERIFY_EMAIL}?email=${encodeURIComponent(email)}`);
  } catch (err: any) {
    // redirect() throws a special error - don't catch it
    if (err.message === "NEXT_REDIRECT") throw err;
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

    // Forward Set-Cookie headers from backend to browser via Next.js cookie store
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
  } catch (err: any) {
    return { error: err.message ?? "Something went wrong. Please try again." };
  }

  redirect(ROUTES.ADMIN.DASHBOARD);
}

/**
 * Verify email action — submits the verification token.
 */
export async function verifyEmailAction(
  _prevState: any,
  formData: FormData,
): Promise<{ error?: string; success?: boolean; message?: string }> {
  const token = formData.get("token") as string;

  if (!token) {
    return { error: "Verification code is required." };
  }

  // Get email from FormData (hidden field)
  const email = formData.get("email") as string;

  try {
    const res = await fetch(`${env.API_BASE_URL}${API.AUTH.VERIFY_EMAIL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token: token.trim() }),
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      return { error: data.message ?? "Verification failed." };
    }

    return { success: true, message: data.message };
  } catch (err: any) {
    return { error: err.message ?? "Something went wrong. Please try again." };
  }
}

/**
 * Resend verification email action.
 */
export async function resendVerificationAction(
  _prevState: any,
  formData: FormData,
): Promise<{ error?: string; success?: boolean; message?: string }> {
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Email is required." };
  }

  try {
    const res = await fetch(
      `${env.API_BASE_URL}${API.AUTH.RESEND_VERIFICATION}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        cache: "no-store",
      },
    );

    const data = await res.json();

    // Always return success message (backend uses generic message to prevent enumeration)
    return {
      success: true,
      message:
        data.message ??
        "If this email is registered and unverified, a new verification code has been sent.",
    };
  } catch (err: any) {
    return { error: err.message ?? "Something went wrong. Please try again." };
  }
}

/**
 * Logout action — clears cookies and redirects.
 */
export async function logoutAction(role: "user" | "admin" = "user") {
  const cookieStore = await cookies();

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

  if (role === "admin") {
    cookieStore.delete(env.ADMIN_COOKIE_ACCESS_NAME);
    cookieStore.delete(env.ADMIN_COOKIE_REFRESH_NAME);
  } else {
    cookieStore.delete(env.COOKIE_ACCESS_NAME);
    cookieStore.delete(env.COOKIE_REFRESH_NAME);
  }

  redirect(role === "admin" ? ROUTES.ADMIN.LOGIN : ROUTES.LOGIN);
}

/**
 * Upload avatar via server action (multipart forwarding).
 */
export async function uploadAvatarAction(
  _prevState: any,
  formData: FormData,
): Promise<{ error?: string; success?: boolean; avatarUrl?: string }> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");

    const res = await fetch(`${env.API_BASE_URL}/api/v1/auth/me`, {
      method: "PATCH",
      headers: { Cookie: cookieHeader },
      body: formData,
      cache: "no-store",
    });

    if (!res.ok) {
      const data = await res.json();
      return { error: data.message || "Failed to upload avatar" };
    }

    const data = await res.json();
    const avatarKey = data.data?.avatar?.key;
    return { success: true, avatarUrl: avatarKey ? `https://res.cloudinary.com/dmlu7hni7/image/upload/f_auto,q_auto,w_192,h_192,c_fill/${avatarKey}` : undefined };
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") redirect(ROUTES.LOGIN);
    return { error: err.message ?? "Failed to upload avatar" };
  }
}

/**
 * Update profile via server action.
 */
export async function updateProfileAction(
  _prevState: any,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");

    // Send as FormData (backend expects multipart)
    const submitData = new FormData();
    const full_name = formData.get("full_name") as string;
    const phone = formData.get("phone") as string;
    const bio = formData.get("bio") as string;
    const city = formData.get("city") as string;
    const area = formData.get("area") as string;
    const country = formData.get("country") as string;

    if (full_name) submitData.append("full_name", full_name);
    if (phone) submitData.append("phone", phone);
    if (bio) submitData.append("bio", bio);
    if (city) submitData.append("city", city);
    if (area) submitData.append("area", area);
    if (country) submitData.append("country", country);

    const res = await fetch(`${env.API_BASE_URL}/api/v1/auth/me`, {
      method: "PATCH",
      headers: { Cookie: cookieHeader },
      body: submitData,
      cache: "no-store",
    });

    if (!res.ok) {
      const data = await res.json();
      return { error: data.message || "Failed to update profile" };
    }

    return { success: true };
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") redirect(ROUTES.LOGIN);
    return { error: err.message ?? "Failed to update profile" };
  }
}
