"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getPublicFeed, getTrendingFeed } from "@/lib/actions/feed";
import { LikeButton } from "@/components/social/like-button";
import { CommentSection } from "@/components/social/comment-section";
import { StoryBubbles } from "@/components/social/story-bubbles";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MoreHorizontal,
  MessageCircle,
  Share2,
  Bookmark,
  Search,
  TrendingUp,
  Clock,
  Flame,
  BookOpen,
  Loader2,
  ArrowUp,
  X,
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
  _count?: { comments?: number };
}

function getMediaUrl(key: string, w = 800) {
  return `https://res.cloudinary.com/dmlu7hni7/image/upload/f_auto,q_auto,w_${w}/${key}`;
}

function getMediaThumb(key: string) {
  return `https://res.cloudinary.com/dmlu7hni7/image/upload/f_auto,q_auto,w_600,h_400,c_fill/${key}`;
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").trim();
}

export function FeedContent() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [feedType, setFeedType] = useState<"trending" | "latest">("latest");
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [imageModal, setImageModal] = useState<string | null>(null);
  const observerRef = useRef<HTMLDivElement>(null);

  const loadPosts = useCallback(async (p: number, append = false) => {
    if (append) setLoadingMore(true);
    else setLoading(true);
    try {
      const fetcher = feedType === "trending" ? getTrendingFeed : getPublicFeed;
      const res = (await fetcher(p, 10)) as any;
      if (res.success) {
        if (append) setPosts((prev) => [...prev, ...res.data]);
        else setPosts(res.data);
        setHasMore(p < res.meta.total_pages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [feedType]);

  useEffect(() => {
    setPage(1);
    setPosts([]);
    loadPosts(1);
  }, [feedType, loadPosts]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          setPage((prev) => { const next = prev + 1; loadPosts(next, true); return next; });
        }
      },
      { threshold: 0.1, rootMargin: "200px" },
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loadPosts]);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFB] dark:bg-gray-950">
      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-[#E5E7EB] dark:border-gray-800">
        <div className="max-w-[720px] mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#2563EB] text-white font-bold text-sm">C</div>
            <span className="text-lg font-bold text-[#111827] dark:text-white hidden sm:block">Feed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#9CA3AF]" />
              <Input placeholder="Search..." className="pl-9 h-9 w-64 rounded-full bg-[#F3F4F6] dark:bg-gray-800 border-0 text-sm" />
            </div>
            <ThemeToggleBtn />
          </div>
        </div>
      </nav>

      <div className="max-w-[720px] mx-auto px-4 py-6">
        {/* Stories */}
        <div className="mb-6">
          <StoryBubbles />
        </div>

        {/* Feed Type Toggle - Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-[#F3F4F6] dark:bg-gray-800 rounded-full w-fit mb-6">
          <button
            onClick={() => setFeedType("latest")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              feedType === "latest"
                ? "bg-white dark:bg-gray-700 text-[#111827] dark:text-white shadow-sm"
                : "text-[#6B7280] hover:text-[#111827] dark:hover:text-white"
            }`}
          >
            <Clock className="size-3.5" />
            Latest
          </button>
          <button
            onClick={() => setFeedType("trending")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              feedType === "trending"
                ? "bg-white dark:bg-gray-700 text-[#111827] dark:text-white shadow-sm"
                : "text-[#6B7280] hover:text-[#111827] dark:hover:text-white"
            }`}
          >
            <Flame className="size-3.5" />
            Trending
          </button>
        </div>

        {/* Posts */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <PostSkeleton key={i} />)}
          </div>
        ) : posts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                expandedComments={expandedComments}
                setExpandedComments={setExpandedComments}
                expandedPost={expandedPost}
                setExpandedPost={setExpandedPost}
                onImageClick={setImageModal}
              />
            ))}
          </div>
        )}

        {/* Infinite scroll trigger */}
        <div ref={observerRef} className="h-4" />

        {loadingMore && (
          <div className="flex justify-center py-8">
            <Loader2 className="size-6 text-[#2563EB] animate-spin" />
          </div>
        )}

        {!hasMore && posts.length > 0 && (
          <p className="text-center text-sm text-[#9CA3AF] py-8">You&apos;ve seen all posts</p>
        )}
      </div>

      {/* Back to top */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 size-12 rounded-full bg-[#2563EB] text-white shadow-lg shadow-blue-500/30 flex items-center justify-center hover:bg-[#1D4ED8] transition-all duration-300 hover:scale-110 z-50"
        >
          <ArrowUp className="size-5" />
        </button>
      )}

      {/* Image Lightbox */}
      {imageModal && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={() => setImageModal(null)}>
          <button className="absolute top-4 right-4 size-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20" onClick={() => setImageModal(null)}>
            <X className="size-5" />
          </button>
          <img src={imageModal} alt="" className="max-w-full max-h-[90vh] object-contain rounded-2xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}

function PostCard({ post, expandedComments, setExpandedComments, expandedPost, setExpandedPost, onImageClick }: {
  post: Post;
  expandedComments: Record<string, boolean>;
  setExpandedComments: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  expandedPost: string | null;
  setExpandedPost: React.Dispatch<React.SetStateAction<string | null>>;
  onImageClick: (url: string) => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const isExpanded = expandedPost === post.id;
  const content = stripHtml(post.content);
  const shouldTruncate = content.length > 300 && !isExpanded;

  return (
    <article className="bg-white dark:bg-gray-900 rounded-[24px] border border-[#E5E7EB] dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="size-12 ring-2 ring-[#F3F4F6] dark:ring-gray-800">
            {post.author.avatar ? (
              <img src={`https://res.cloudinary.com/dmlu7hni7/image/upload/f_auto,q_auto,w_96,h_96,c_fill/${post.author.avatar.key}`} alt="" className="w-full h-full object-cover" loading="lazy" />
            ) : (
              <AvatarFallback className="text-sm font-semibold bg-[#EFF6FF] dark:bg-blue-950/50 text-[#2563EB] dark:text-blue-400">{getInitials(post.author.full_name)}</AvatarFallback>
            )}
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-semibold text-[#111827] dark:text-white">{post.author.full_name}</span>
              {post.type === "OFFERING" && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#22C55E]/10 text-[#22C55E]">OFFERING</span>}
              {post.type === "SEEKING" && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#F59E0B]/10 text-[#F59E0B]">SEEKING</span>}
            </div>
            <p className="text-[13px] text-[#9CA3AF]">{timeAgo(post.created_at)}</p>
          </div>
        </div>
        <div className="relative">
          <Button variant="ghost" size="icon" className="size-8 rounded-full text-[#9CA3AF] hover:text-[#111827] dark:hover:text-white" onClick={() => setShowMenu(!showMenu)}>
            <MoreHorizontal className="size-4" />
          </Button>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-[#E5E7EB] dark:border-gray-700 py-2 z-20">
                {["Save", "Report", "Copy Link"].map((item) => (
                  <button key={item} className="w-full px-4 py-2.5 text-left text-sm text-[#111827] dark:text-white hover:bg-[#F3F4F6] dark:hover:bg-gray-700 transition-colors" onClick={() => setShowMenu(false)}>
                    {item}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Title */}
      {post.title && (
        <div className="px-5 pb-2">
          <h2 className="text-[20px] font-bold text-[#111827] dark:text-white leading-tight">{post.title}</h2>
        </div>
      )}

      {/* Content */}
      <div className="px-5 pb-3">
        <p className={`text-[15px] text-[#374151] dark:text-gray-300 leading-[1.7] ${shouldTruncate ? "line-clamp-4" : ""}`}>
          {content}
        </p>
        {shouldTruncate && (
          <button onClick={() => setExpandedPost(post.id)} className="text-[#2563EB] dark:text-blue-400 text-[15px] font-medium mt-1 hover:underline">
            See more
          </button>
        )}
        {isExpanded && (
          <button onClick={() => setExpandedPost(null)} className="text-[#2563EB] dark:text-blue-400 text-[15px] font-medium mt-1 hover:underline">
            Show less
          </button>
        )}
      </div>

      {/* Subjects */}
      {post.subjects && post.subjects.length > 0 && (
        <div className="px-5 pb-3 flex flex-wrap gap-1.5">
          {post.subjects.map((s) => (
            <span key={s.subject.id} className="inline-flex items-center gap-1 rounded-full bg-[#EFF6FF] dark:bg-blue-950/50 px-3 py-1 text-[13px] font-medium text-[#2563EB] dark:text-blue-400">
              <BookOpen className="size-3" />
              {s.subject.name}
            </span>
          ))}
        </div>
      )}

      {/* Media */}
      {post.media && post.media.length > 0 && (
        <div className="px-5 pb-3">
          {post.media.length === 1 ? (
            <div className="rounded-[20px] overflow-hidden bg-[#F3F4F6] dark:bg-gray-800 cursor-pointer group" onClick={() => onImageClick(getMediaUrl(post.media[0].key))}>
              <img
                src={getMediaThumb(post.media[0].key)}
                alt={post.media[0].filename}
                className="w-full aspect-[4/3] object-cover group-hover:scale-[1.02] transition-transform duration-500"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 rounded-[20px] overflow-hidden">
              {post.media.slice(0, 4).map((m, i) => (
                <div
                  key={m.id}
                  className="relative overflow-hidden bg-[#F3F4F6] dark:bg-gray-800 cursor-pointer group aspect-square"
                  onClick={() => onImageClick(getMediaUrl(m.key))}
                >
                  <img
                    src={getMediaThumb(m.key)}
                    alt={m.filename}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    loading="lazy"
                  />
                  {post.media.length > 4 && i === 3 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-xl font-bold">+{post.media.length - 4}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Engagement Bar */}
      <div className="px-5 py-3 border-t border-[#F3F4F6] dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <LikeButton postId={post.id} />
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full px-3 h-9 text-[13px] font-medium text-[#6B7280] hover:text-[#2563EB] hover:bg-[#EFF6FF] dark:hover:bg-blue-950/50 transition-all"
            onClick={() => setExpandedComments((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
          >
            <MessageCircle className="size-4 mr-1.5" />
            Comment
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full px-3 h-9 text-[13px] font-medium text-[#6B7280] hover:text-[#22C55E] hover:bg-[#F0FDF4] dark:hover:bg-green-950/50 transition-all">
            <Share2 className="size-4 mr-1.5" />
            Share
          </Button>
        </div>
        <Button variant="ghost" size="icon" className="size-9 rounded-full text-[#6B7280] hover:text-[#F59E0B] hover:bg-[#FFFBEB] dark:hover:bg-yellow-950/50 transition-all">
          <Bookmark className="size-4" />
        </Button>
      </div>

      {/* Comments */}
      {expandedComments[post.id] && (
        <div className="px-5 pb-5 border-t border-[#F3F4F6] dark:border-gray-800 pt-4">
          <CommentSection postId={post.id} />
        </div>
      )}
    </article>
  );
}

function PostSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-[24px] border border-[#E5E7EB] dark:border-gray-800 p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="size-12 rounded-full bg-[#F3F4F6] dark:bg-gray-800" />
        <div className="space-y-2">
          <div className="h-3.5 w-32 bg-[#F3F4F6] dark:bg-gray-800 rounded-full" />
          <div className="h-2.5 w-16 bg-[#F3F4F6] dark:bg-gray-800 rounded-full" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 w-3/4 bg-[#F3F4F6] dark:bg-gray-800 rounded-full" />
        <div className="h-3.5 w-full bg-[#F3F4F6] dark:bg-gray-800 rounded-full" />
        <div className="h-3.5 w-5/6 bg-[#F3F4F6] dark:bg-gray-800 rounded-full" />
      </div>
      <div className="aspect-[4/3] rounded-[20px] bg-[#F3F4F6] dark:bg-gray-800 mb-4" />
      <div className="flex gap-4 pt-3 border-t border-[#F3F4F6] dark:border-gray-800">
        {[1, 2, 3].map((i) => <div key={i} className="h-3.5 w-16 bg-[#F3F4F6] dark:bg-gray-800 rounded-full" />)}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-[24px] border border-[#E5E7EB] dark:border-gray-800 p-16 text-center">
      <BookOpen className="size-12 text-[#D1D5DB] dark:text-gray-700 mx-auto" />
      <h3 className="mt-4 text-[17px] font-semibold text-[#111827] dark:text-white">No posts yet</h3>
      <p className="mt-2 text-[15px] text-[#6B7280]">Be the first to share something with the community.</p>
    </div>
  );
}

function ThemeToggleBtn() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);
  return (
    <button
      onClick={() => {
        document.documentElement.classList.toggle("dark");
        setDark(!dark);
      }}
      className="size-9 rounded-full bg-[#F3F4F6] dark:bg-gray-800 flex items-center justify-center text-[#6B7280] hover:text-[#111827] dark:hover:text-white transition-colors"
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}
