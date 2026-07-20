import type { Metadata } from "next";
import { AdminPostsContent } from "./admin-posts-content";

export const metadata: Metadata = { title: "Posts Management", description: "Review and moderate posts" };

export default function AdminPostsPage() {
  return <AdminPostsContent />;
}
