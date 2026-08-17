import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProfilePublic } from "./profile-public";
import { getUserByUsername } from "@/lib/actions/get-user";
import { searchPosts } from "@/lib/actions/discover";

export const metadata: Metadata = {
  title: "Profile",
  description: "View user profile and posts",
};

export default async function PublicProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let user: any = null;
  let posts: any[] = [];

  try {
    // Fetch the user directly by their unique username
    const res = await getUserByUsername(slug);
    if (res?.success && res.data) {
      user = res.data;
    }
  } catch {}

  // If user not found by username, fall back to searching posts for a matching author
  if (!user) {
    try {
      const data = await searchPosts({ page: 1, limit: 50 });
      if (data.success && data.data && data.data.length > 0) {
        const authors = new Map<string, any>();
        for (const post of data.data) {
          if (post.author && !authors.has(post.author.id)) {
            authors.set(post.author.id, { ...post.author, created_at: post.created_at });
          }
        }
        const searchSlug = slug.toLowerCase().replace(/[^a-z0-9]/g, "");
        for (const [id, author] of authors) {
          const nameSlug = (author.full_name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
          if (nameSlug === searchSlug) {
            user = author;
            break;
          }
        }
      }
    } catch {}
  }

  if (!user) notFound();

  // Fetch this user's posts
  try {
    const data = await searchPosts({ page: 1, limit: 50 });
    if (data.success && data.data) {
      posts = data.data.filter((p: any) => p.author?.id === user.id);
    }
  } catch {}

  return <ProfilePublic user={user} posts={posts} />;
}
