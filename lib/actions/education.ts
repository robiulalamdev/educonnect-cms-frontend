"use server";

import env from "@/config/.env";

const API_BASE = env.API_BASE_URL;

export async function getSubjects() {
  try {
    const res = await fetch(`${API_BASE}/api/v1/education/subjects`, { cache: "no-store" });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch { return []; }
}

export async function getLevels() {
  try {
    const res = await fetch(`${API_BASE}/api/v1/education/levels`, { cache: "no-store" });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch { return []; }
}
