import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants";
import { Plus, FileText } from "lucide-react";
import { PostsList } from "./posts-list";

export const metadata: Metadata = {
  title: "My Posts",
  description: "Manage your posts",
};

export default function PostsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            My Posts
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Create and manage your posts
          </p>
        </div>
        <Link href={`${ROUTES.USER.DASHBOARD}/posts/new`}>
          <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20">
            <Plus className="mr-2 size-4" />
            New Post
          </Button>
        </Link>
      </div>

      <PostsList />
    </div>
  );
}
