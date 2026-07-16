"use client";

import { LikeButton } from "@/components/social/like-button";
import { CommentSection } from "@/components/social/comment-section";
import { useEffect, useState, useCallback, useRef } from "react";
import { getPublicFeed, getTrendingFeed } from "@/lib/actions/feed";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  FileImage,
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  Clock,
  Loader2,
  Flame,
  BookOpen,
  GraduationCap,
} from "lucide-react";

interface Post {
  id: string;
  title: string;
  content: string;
  type: string;
  status: string;
  created_at: string;
  author: { id: string; full_name: string; avatar?: { key: string } | null };
  media: Array<{ id: string; key: string; filename: string; mime_type: string; type: string }>;
  subjects: Array<{ subject: { id: string; name: string } }>;
}

interface FeedResponse {
  success: boolean;
  data: Post[];
  meta: { total: number; page: number; limit: number; total_pages: number };
}

function getMediaUrl(key: string) {
  return `https://res.cloudinary.com/dmlu7hni7/image/upload/f_auto,q_auto,w_800/${key}`;
}

function getMediaThumbUrl(key: string) {
  return `https://res.cloudinary.com/dmlu7hni7/image/upload/f_auto,q_auto,w_400,h_300,c_fill/${key}`;
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

export function FeedContent() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [feedType, setFeedType] = useState<"trending" | "latest">("latest");
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const observerRef = useRef<HTMLDivElement>(null);

  const loadPosts = useCallback(async (p: number, append = false) => {
    if (append) setLoadingMore(true);
    else setLoading(true);

    try {
      const fetcher = feedType === "trending" ? getTrendingFeed : getPublicFeed;
      const res = (await fetcher(p, 10)) as FeedResponse;

      if (res.success) {
        if (append) {
          setPosts((prev) => [...prev, ...res.data]);
        } else {
          setPosts(res.data);
        }
        setHasMore(p < res.meta.total_pages);
      }
    } catch (err) {
      console.error("Failed to load feed:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [feedType]);

  // Initial load
  useEffect(() => {
    setPage(1);
    setPosts([]);
    loadPosts(1);
  }, [feedType, loadPosts]);

  // Infinite scroll observer
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

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loadingMore, loadPosts]);

  return (
    <div className="space-y-6">
      {/* Feed Type Toggle */}
      <div className="flex items-center gap-2">
        <Button
          variant={feedType === "latest" ? "default" : "outline"}
          size="sm"
          className={`rounded-xl ${feedType === "latest" ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}`}
          onClick={() => setFeedType("latest")}
        >
          <Clock className="mr-1.5 size-3.5" />
          Latest
        </Button>
        <Button
          variant={feedType === "trending" ? "default" : "outline"}
          size="sm"
          className={`rounded-xl ${feedType === "trending" ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}`}
          onClick={() => setFeedType("trending")}
        >
          <Flame className="mr-1.5 size-3.5" />
          Trending
        </Button>
      </div>

      {/* Loading skeletons */}
      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                    <div className="space-y-2">
                      <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                      <div className="h-2 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                  </div>
                  <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-3 w-5/6 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="aspect-video rounded-xl bg-gray-200 dark:bg-gray-700" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Posts */}
      {!loading && (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="border-0 shadow-sm rounded-2xl dark:bg-gray-900 dark:border dark:border-gray-800 overflow-hidden">
              <CardContent className="p-6">
                {/* Author header */}
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="size-10">
                    {post.author.avatar ? (
                      <img
                        src={`https://res.cloudinary.com/dmlu7hni7/image/upload/f_auto,q_auto,w_80,h_80,c_fill/${post.author.avatar.key}`}
                        alt={post.author.full_name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <AvatarFallback className="text-xs font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                        {getInitials(post.author.full_name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {post.author.full_name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>{timeAgo(post.created_at)}</span>
                      <span>·</span>
                      <span className={`font-medium ${post.type === "OFFERING" ? "text-blue-600 dark:text-blue-400" : "text-green-600 dark:text-green-400"}`}>
                        {post.type === "OFFERING" ? "Offering" : "Seeking"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Title */}
                {post.title && (
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                    {post.title}
                  </h3>
                )}

                {/* Content */}
                <div
                  className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4 prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Media */}
                {post.media && post.media.length > 0 && (
                  <div className={`gap-2 mb-4 ${post.media.length === 1 ? "" : "grid grid-cols-2"}`}>
                    {post.media.slice(0, 4).map((m, i) => (
                      <div
                        key={m.id}
                        className={`relative overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 ${
                          post.media.length === 1 ? "aspect-video" : "aspect-square"
                        }`}
                      >
                        {m.mime_type.startsWith("image/") ? (
                          <img
                            src={i < 3 ? getMediaThumbUrl(m.key) : getMediaUrl(m.key)}
                            alt={m.filename}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : m.mime_type.startsWith("video/") ? (
                          <video
                            src={`https://res.cloudinary.com/dmlu7hni7/video/upload/${m.key}`}
                            className="w-full h-full object-cover"
                            controls
                            preload="metadata"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <FileImage className="size-8 text-gray-400" />
                          </div>
                        )}
                        {post.media.length > 4 && i === 3 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white text-lg font-bold">+{post.media.length - 4}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Subjects */}
                {post.subjects && post.subjects.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.subjects.map((s) => (
                      <span
                        key={s.subject.id}
                        className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 text-xs font-medium text-blue-600 dark:text-blue-400"
                      >
                        <BookOpen className="size-3" />
                        {s.subject.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-1 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <LikeButton postId={post.id} />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-gray-500 dark:text-gray-400 hover:text-blue-500 rounded-xl"
                    onClick={() => setExpandedComments((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                  >
                    <MessageCircle className="mr-1.5 size-4" />
                    Comment
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1 text-gray-500 dark:text-gray-400 hover:text-green-500 rounded-xl">
                    <Share2 className="mr-1.5 size-4" />
                    Share
                  </Button>
                </div>
                {expandedComments[post.id] && (
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                    <CommentSection postId={post.id} />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && posts.length === 0 && (
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-12 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-400">
              <BookOpen className="size-6" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">
              No posts yet
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Be the first to share something with the community.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Infinite scroll trigger */}
      <div ref={observerRef} className="h-4" />

      {/* Loading more */}
      {loadingMore && (
        <div className="flex justify-center py-4">
          <Loader2 className="size-6 text-blue-600 animate-spin" />
        </div>
      )}

      {/* End of feed */}
      {!hasMore && posts.length > 0 && (
        <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-4">
          You&apos;ve reached the end of the feed
        </p>
      )}
    </div>
  );
}
