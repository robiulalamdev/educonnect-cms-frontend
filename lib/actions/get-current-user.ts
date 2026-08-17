"use server";

import { cookies } from "next/headers";
import env from "../../config/env";

/**
 * Lightweight server action to get the current user.
 * Separated from auth.ts to avoid pulling heavy imports into client bundles.
 */
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    const res = await fetch(`${env.API_BASE_URL}/api/v1/auth/me`, {
      headers: { Cookie: cookieHeader },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data?.data ?? null;
  } catch {
    return null;
  }
}
