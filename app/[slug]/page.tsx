import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProfilePublic } from "./profile-public";
import { searchPosts } from "@/lib/actions/discover";
import env from "@/config/.env";

export const metadata: Metadata = {
  title: "Profile",
  description: "View user profile and posts",
};

export default async function PublicProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const API_BASE = env.API_BASE_URL || "http://localhost:9000"; // Can be removed later if not needed

  let posts: any[] = [];
  let user: any = null;

  try {
    const data = await searchPosts({ page: 1, limit: 50 });
    
    if (data.success && data.data && data.data.length > 0) {
      // Get unique authors
      const authors = new Map<string, any>();
      for (const post of data.data) {
        if (post.author && !authors.has(post.author.id)) {
          authors.set(post.author.id, { ...post.author, created_at: post.created_at });
        }
      }

      // Match username to author by full_name slug
      const searchSlug = slug.toLowerCase().replace(/[^a-z0-9]/g, "");
      for (const [id, author] of authors) {
        const nameSlug = (author.full_name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
        if (nameSlug.includes(searchSlug) || searchSlug.includes(nameSlug) || nameSlug === searchSlug) {
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
