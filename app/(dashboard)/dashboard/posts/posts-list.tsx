"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMyPosts, deletePostAction } from "@/lib/actions/posts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import {
  FileText,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  Plus,
} from "lucide-react";

interface Post {
  id: string;
  title: string;
  content: string;
  type: string;
  status: string;
  created_at: string;
  media: Array<{ id: string; key: string; filename: string; mime_type: string }>;
  subjects: Array<{ subject: { id: string; name: string } }>;
}

interface PostsResponse {
  success: boolean;
  data: Post[];
  meta: { total: number; page: number; limit: number; total_pages: number };
}

export function PostsList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, total_pages: 0 });
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadPosts(page);
  }, [page]);

  async function loadPosts(p: number) {
    setLoading(true);
    try {
      const res = (await getMyPosts(p, 10)) as PostsResponse;
      if (res.success) {
        setPosts(res.data);
        setMeta(res.meta);
      }
    } catch (err) {
      console.error("Failed to load posts:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(postId: string) {
    if (!confirm("Are you sure you want to delete this post?")) return;
    setDeleting(postId);
    try {
      const result = await deletePostAction(postId);
      if (result.success) {
        setPosts((prev) => prev.filter((p) => p.id !== postId));
      }
    } catch (err) {
      console.error("Failed to delete post:", err);
    } finally {
      setDeleting(null);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-0 shadow-sm rounded-2xl">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardContent className="p-12 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-400">
            <FileText className="size-6" />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">
            No posts yet
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Create your first post to get started.
          </p>
          <Link href={`${ROUTES.USER.DASHBOARD}/posts/new`} className="mt-4 inline-block">
            <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="mr-2 size-4" />
              New Post
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card
          key={post.id}
          className="group border-0 shadow-sm hover:shadow-md dark:bg-gray-900 dark:border dark:border-gray-800 transition-all duration-300 rounded-2xl"
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      post.type === "OFFERING"
                        ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400"
                        : "bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400"
                    }`}
                  >
                    {post.type}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      post.status === "ACTIVE"
                        ? "bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                    }`}
                  >
                    {post.status === "ACTIVE" ? (
                      <Eye className="mr-1 size-3" />
                    ) : (
                      <EyeOff className="mr-1 size-3" />
                    )}
                    {post.status}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                  {post.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                  {post.content.replace(/<[^>]*>/g, "").slice(0, 150)}...
                </p>

                <div className="mt-3 flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                  <span>
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                  {post.media.length > 0 && (
                    <span>{post.media.length} media</span>
                  )}
                  {post.subjects.length > 0 && (
                    <span>
                      {post.subjects.map((s) => s.subject.name).join(", ")}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link href={`${ROUTES.USER.DASHBOARD}/posts/${post.id}/edit`}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <Pencil className="size-4" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                  onClick={() => handleDelete(post.id)}
                  disabled={deleting === post.id}
                >
                  {deleting === post.id ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Pagination */}
      {meta.total_pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Page {page} of {meta.total_pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl"
            onClick={() => setPage((p) => Math.min(meta.total_pages, p + 1))}
            disabled={page === meta.total_pages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
