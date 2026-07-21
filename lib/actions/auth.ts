"use server";

import { redirect } from "next/navigation";
import { ROUTES, API } from "@/lib/constants";
import env from "@/config/.env";
import {
  apiGet,
  apiPost,
  apiPatch,
  apiPatchFormData,
  apiPostFormData,
  apiLogin,
  clearAuthCookies,
} from "@/lib/api";

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
    const data = await apiLogin<{ success: boolean; message?: string }>(
      API.AUTH.REGISTER,
      { full_name, email, password, role, phone: phone || undefined },
    );

    if (!data.success) {
      return { error: data.message ?? "Registration failed." };
    }

    redirect(`${ROUTES.VERIFY_EMAIL}?email=${encodeURIComponent(email)}`);
  } catch (err: any) {
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
    const data = await apiLogin<{ success: boolean; message?: string }>(
      API.AUTH.LOGIN,
      { email, password },
    );

    if (!data.success) {
      return { error: data.message ?? "Invalid credentials." };
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
    const data = await apiLogin<{ success: boolean; message?: string }>(
      API.ADMIN.AUTH.LOGIN,
      { email, password },
      { isAdmin: true },
    );

    if (!data.success) {
      return { error: data.message ?? "Invalid credentials." };
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
  const email = formData.get("email") as string;

  if (!token) {
    return { error: "Verification code is required." };
  }

  try {
    const data = await apiPost<{ success: boolean; message?: string }>(
      API.AUTH.VERIFY_EMAIL,
      { email, token: token.trim() },
    );

    if (!data.success) {
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
    const data = await apiPost<{ success: boolean; message?: string }>(
      API.AUTH.RESEND_VERIFICATION,
      { email },
    );

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
  const isAdmin = role === "admin";

  try {
    await apiPost(
      isAdmin ? API.ADMIN.AUTH.LOGOUT : API.AUTH.LOGOUT,
      {},
      { isAdmin },
    );
  } catch {
    // Even if backend fails, clear local cookies
  }

  await clearAuthCookies(isAdmin);
  redirect(isAdmin ? ROUTES.ADMIN.LOGIN : ROUTES.LOGIN);
}

/**
 * Upload avatar via server action (multipart forwarding).
 */
export async function uploadAvatarAction(
  _prevState: any,
  formData: FormData,
): Promise<{ error?: string; success?: boolean; avatarUrl?: string }> {
  try {
    const data = await apiPatchFormData<{ success: boolean; data?: any; message?: string }>(
      API.AUTH.ME,
      formData,
    );

    if (!data.success) {
      return { error: (data as any).message || "Failed to upload avatar" };
    }

    const avatarKey = data.data?.avatar?.key;
    return {
      success: true,
      avatarUrl: avatarKey
        ? `https://res.cloudinary.com/dmlu7hni7/image/upload/f_auto,q_auto,w_192,h_192,c_fill/${avatarKey}`
        : undefined,
    };
  } catch (err: any) {
    return { error: err.message ?? "Failed to upload avatar" };
  }
}

/**
 * Change password via server action.
 */
export async function changePasswordAction(
  _prevState: any,
  formData: FormData,
): Promise<{ error?: string; success?: boolean; message?: string }> {
  const current_password = formData.get("current_password") as string;
  const new_password = formData.get("new_password") as string;

  if (!current_password || !new_password) {
    return { error: "Both fields are required." };
  }

  if (new_password.length < 8) {
    return { error: "New password must be at least 8 characters." };
  }

  try {
    const data = await apiPatch<{ success: boolean; message?: string }>(
      "/api/v1/auth/me/password",
      { current_password, new_password },
    );

    if (!data.success) {
      return { error: data.message || "Failed to change password" };
    }

    // Password changed — cookies cleared by backend, need re-login
    await clearAuthCookies();
    return { success: true, message: data.message };
  } catch (err: any) {
    if (err.message === "NEXT_REDIRECT") throw err;
    return { error: err.message ?? "Failed to change password" };
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
    const submitData = new FormData();
    const full_name = formData.get("full_name") as string;
    const phone = formData.get("phone") as string;
    const bio = formData.get("bio") as string;
    const country = formData.get("country") as string;
    const state = formData.get("state") as string;
    const city = formData.get("city") as string;
    const area = formData.get("area") as string;
    const address_line = formData.get("address_line") as string;

    if (full_name) submitData.append("full_name", full_name);
    if (phone) submitData.append("phone", phone);
    if (bio) submitData.append("bio", bio);
    if (country) submitData.append("country", country);
    if (state) submitData.append("state", state);
    if (city) submitData.append("city", city);
    if (area) submitData.append("area", area);
    if (address_line) submitData.append("address_line", address_line);

    await apiPatchFormData(API.AUTH.ME, submitData);
    return { success: true };
  } catch (err: any) {
    return { error: err.message ?? "Failed to update profile" };
  }
}

/**
 * Forgot password action.
 */
export async function forgotPasswordAction(
  email: string
): Promise<{ error?: string; success?: boolean; message?: string }> {
  try {
    const { apiPublicPost } = await import("@/lib/api");
    const data = await apiPublicPost<{ success: boolean; message?: string }>(
      API.AUTH.FORGOT_PASSWORD,
      { email }
    );
    return { success: true, message: data.message };
  } catch (err: any) {
    return { error: err.message ?? "Something went wrong. Please try again." };
  }
}

/**
 * Reset password action.
 */
export async function resetPasswordAction(
  token: string,
  password: string
): Promise<{ error?: string; success?: boolean; message?: string }> {
  try {
    const { apiPublicPost } = await import("@/lib/api");
    const data = await apiPublicPost<{ success: boolean; message?: string }>(
      API.AUTH.RESET_PASSWORD,
      { token, password }
    );
    return { success: true, message: data.message };
  } catch (err: any) {
    return { error: err.message ?? "Something went wrong. Please try again." };
  }
}
