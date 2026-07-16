import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProfilePublic } from "./profile-public";

export const metadata: Metadata = {
  title: "Profile",
  description: "View user profile and posts",
};

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  // Fetch user by username (email prefix)
  let user: any = null;
  try {
    const res = await fetch(`${process.env.API_BASE_URL || "http://localhost:9000"}/api/v1/user/?search=${username}`, { cache: "no-store" });
    const data = await res.json();
    if (data.success && data.data?.length > 0) {
      user = data.data.find((u: any) => u.email?.split("@")[0] === username) || data.data[0];
    }
  } catch {}

  if (!user) notFound();

  return <ProfilePublic user={user} />;
}
