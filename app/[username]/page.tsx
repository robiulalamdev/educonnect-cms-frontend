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
      const authors = new Map();
      for (const post of data.data) {
        if (post.author && !authors.has(post.author.id)) {
          authors.set(post.author.id, post.author);
        }
      }

      // Try to match username to an author
      const slug = username.toLowerCase();
      for (const [id, author] of authors) {
        const nameSlug = (author.full_name || "").toLowerCase().replace(/\s+/g, "");
        const emailSlug = ""; // email not available in public API
        if (nameSlug.includes(slug) || slug.includes(nameSlug)) {
          user = author;
          break;
        }
      }

      // If no match, try first author (fallback)
      if (!user && authors.size > 0) {
        const firstAuthor = authors.values().next().value;
        if (firstAuthor) user = firstAuthor;
      }

      if (user) {
        posts = data.data.filter((p: any) => p.author?.id === user.id);
      }
    }
  } catch {}

  if (!user) notFound();

  return <ProfilePublic user={user} posts={posts} />;
}
