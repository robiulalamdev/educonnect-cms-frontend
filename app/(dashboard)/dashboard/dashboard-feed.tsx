"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getPublicFeed } from "@/lib/actions/feed";
import { getMyPosts } from "@/lib/actions/posts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  FileImage,
  Heart,
  MessageCircle,
  Share2,
  Loader2,
  BookOpen,
  Pencil,
} from "lucide-react";
import Link from "next/link";
import { getCloudinaryUrl } from "@/lib/utils";

interface Post {
  id: string;
  title: string;
  content: string;
  type: string;
  status: string;
  created_at: string;
  author: { id: string; full_name: string; avatar?: { key: string } | null } | null;
  media: Array<{ id: string; key: string; filename: string; mime_type: string }>;
  subjects: Array<{ subject: { id: string; name: string } }>;
  _isOwn?: boolean;
}

function getMediaThumbUrl(key: string) {
  return getCloudinaryUrl(key, { w: 400, h: 300 });
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

interface DashboardFeedProps {
  userId: string;
}

export function DashboardFeed({ userId }: DashboardFeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement>(null);

  const loadPosts = useCallback(async (p: number, append = false) => {
    if (append) setLoadingMore(true);
    else setLoading(true);

    try {
      // Fetch both own posts and public feed
      const [ownRes, publicRes] = await Promise.all([
        getMyPosts(p, 5) as Promise<any>,
        getPublicFeed(p, 5) as Promise<any>,
      ]);

      const ownPosts = (ownRes?.data || []).map((p: any) => ({ ...p, _isOwn: true }));
      const publicPosts = (publicRes?.data || []).filter((p: any) => p.author_id !== userId);

      // Merge and sort by date
      const merged = [...ownPosts, ...publicPosts]
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10);

      if (append) {
        setPosts((prev) => [...prev, ...merged]);
      } else {
        setPosts(merged);
      }

      setHasMore(p < (ownRes?.meta?.total_pages || 1) || p < (publicRes?.meta?.total_pages || 1));
    } catch (err) {
      console.error("Failed to load feed:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [userId]);

  useEffect(() => {
    loadPosts(1);
  }, [loadPosts]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          setPage((prev) => {
            const next = prev + 1;
            loadPosts(next, true);
            return next;
          });
        }
      },
      { threshold: 0.1 },
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loadPosts]);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className="border-0 shadow-sm rounded-2xl">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="space-y-2">
                    <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-2 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                </div>
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <Card className="border-0 shadow-sm rounded-2xl dark:bg-gray-900 dark:border dark:border-gray-800">
        <CardContent className="p-8 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-400">
            <BookOpen className="size-6" />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">
            No activity yet
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Create your first post or browse the feed.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <Link href={`${ROUTES.USER.DASHBOARD}/posts/new}`}>
              <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white">
                <Pencil className="mr-2 size-4" />
                Create Post
              </Button>
            </Link>
            <Link href="/feed">
              <Button variant="outline" className="rounded-xl">
                Browse Feed
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id} className="border-0 shadow-sm rounded-2xl dark:bg-gray-900 dark:border dark:border-gray-800 overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="size-9">
                {post.author?.avatar ? (
                  <img
                    src={getCloudinaryUrl(post.author.avatar.key, { w: 80, h: 80 })}
                    alt={post.author.full_name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <AvatarFallback className="text-xs font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                    {getInitials(post.author?.full_name || "U")}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {post.author?.full_name || "Unknown"}
                  </p>
                  {post._isOwn && (
                    <span className="text-xs bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded-full font-medium">
                      You
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{timeAgo(post.created_at)}</p>
              </div>
              {post._isOwn && (
                <Link href={`/dashboard/posts/${post.id}/edit`}>
                  <Button variant="ghost" size="icon" className="size-8 text-gray-400 hover:text-blue-600">
                    <Pencil className="size-3.5" />
                  </Button>
                </Link>
              )}
            </div>

            {post.title && (
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{post.title}</h4>
            )}
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-3">
              {post.content?.replace(/<[^>]*>/g, "")}
            </p>

            {post.media && post.media.length > 0 && (
              <div className="flex gap-2 mb-3">
                {post.media.slice(0, 3).map((m) => (
                  <div key={m.id} className="size-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {m.mime_type.startsWith("image/") ? (
                      <img src={getMediaThumbUrl(m.key)} alt={m.filename} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="flex items-center justify-center h-full"><FileImage className="size-5 text-gray-400" /></div>
                    )}
                  </div>
                ))}
                {post.media.length > 3 && (
                  <div className="size-20 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-500">+{post.media.length - 3}</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-1 pt-2 border-t border-gray-100 dark:border-gray-800">
              <Button variant="ghost" size="sm" className="flex-1 text-gray-500 dark:text-gray-400 hover:text-red-500 rounded-lg h-8 text-xs">
                <Heart className="mr-1 size-3.5" />
                Like
              </Button>
              <Button variant="ghost" size="sm" className="flex-1 text-gray-500 dark:text-gray-400 hover:text-blue-500 rounded-lg h-8 text-xs">
                <MessageCircle className="mr-1 size-3.5" />
                Comment
              </Button>
              <Button variant="ghost" size="sm" className="flex-1 text-gray-500 dark:text-gray-400 hover:text-green-500 rounded-lg h-8 text-xs">
                <Share2 className="mr-1 size-3.5" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <div ref={observerRef} className="h-4" />
      {loadingMore && (
        <div className="flex justify-center py-4">
          <Loader2 className="size-5 text-blue-600 animate-spin" />
        </div>
      )}
      {!hasMore && posts.length > 0 && (
        <p className="text-center text-xs text-gray-400 dark:text-gray-500 py-2">
          You&apos;ve seen all recent activity
        </p>
      )}
    </div>
  );
}

const ROUTES = {
  USER: {
    DASHBOARD: "/dashboard",
  },
};
