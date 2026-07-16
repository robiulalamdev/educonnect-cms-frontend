import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProfilePublic } from "./profile-public";

export const metadata: Metadata = {
  title: "Profile",
  description: "View user profile and posts",
};

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const API_BASE = process.env.API_BASE_URL || "http://localhost:9000";

  let posts: any[] = [];
  let user: any = null;

  try {
    const res = await fetch(`${API_BASE}/api/v1/posts/?page=1&limit=50`, { cache: "no-store" });
    const data = await res.json();
    if (data.success && data.data.length > 0) {
      // Get unique authors
      const authors = new Map<string, any>();
      for (const post of data.data) {
        if (post.author && !authors.has(post.author.id)) {
          authors.set(post.author.id, { ...post.author, created_at: post.created_at });
        }
      }

      // Match username to author by full_name slug
      const slug = username.toLowerCase().replace(/[^a-z0-9]/g, "");
      for (const [id, author] of authors) {
        const nameSlug = (author.full_name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
        if (nameSlug.includes(slug) || slug.includes(nameSlug) || nameSlug === slug) {
          user = author;
          break;
        }
      }

      // Fallback: show first author
      if (!user && authors.size > 0) {
        user = authors.values().next().value;
      }

      if (user) {
        posts = data.data.filter((p: any) => p.author?.id === user.id);
      }
    }
  } catch {}

  if (!user) notFound();

  return <ProfilePublic user={user} posts={posts} />;
}
