"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getPublicFeed, getTrendingFeed } from "@/lib/actions/feed";
import { getTrendingTopics, getSuggestedUsers } from "@/lib/actions/discover";
import { getSubscriptionPackages } from "@/lib/actions/modules";
import { getCurrentUser } from "@/lib/actions/get-current-user";
import { LikeButton } from "@/components/social/like-button";
import { CommentSection } from "@/components/social/comment-section";
import { StoryBubbles } from "@/components/social/story-bubbles";
import { CreatePostModal } from "@/components/social/create-post-modal";
import { CreateStoryModal } from "@/components/social/create-story-modal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Home, Search, Bell, MessageSquare, Bookmark, User, Settings, MoreHorizontal, Share2, Plus, Crown, ArrowUp, Hash, Loader2, X, ChevronDown, TrendingUp } from "lucide-react";
import { getCloudinaryUrl } from "@/lib/utils";

interface Post { id: string; title: string; content: string; type: string; created_at: string; author: { id: string; full_name: string; avatar?: { key: string } | null }; media: Array<{ id: string; key: string; filename: string; mime_type: string }>; subjects: Array<{ subject: { id: string; name: string } }>; }

function getMediaUrl(key: string) { return getCloudinaryUrl(key, { w: 680 }); }
function getInitials(name: string) { return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2); }
function timeAgo(date: string) { const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000); if (s < 60) return "now"; const m = Math.floor(s / 60); if (m < 60) return `${m}m`; const h = Math.floor(m / 60); if (h < 24) return `${h}h`; return `${Math.floor(h / 24)}d`; }
function stripHtml(html: string) { return html.replace(/<[^>]*>/g, "").trim(); }

export function FeedContent() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [feedType, setFeedType] = useState<"trending" | "latest">("latest");
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateStory, setShowCreateStory] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [imageModal, setImageModal] = useState<string | null>(null);
  const [trendingTopics, setTrendingTopics] = useState<Array<{ tag: string; posts: string }>>([]);
  const [whoToFollow, setWhoToFollow] = useState<Array<{ id: string; name: string; handle: string; avatar_key?: string | null }>>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [featuredPackage, setFeaturedPackage] = useState<any>(null);
  const observerRef = useRef<HTMLDivElement>(null);

  const loadPosts = useCallback(async (p: number, append = false) => {
    if (append) setLoadingMore(true); else setLoading(true);
    try {
      const fetcher = feedType === "trending" ? getTrendingFeed : getPublicFeed;
      const res = (await fetcher(p, 10)) as any;
      if (res.success) { if (append) setPosts((prev) => [...prev, ...res.data]); else setPosts(res.data); setHasMore(p < res.meta.total_pages); }
    } catch (err) { console.error(err); }
    finally { setLoading(false); setLoadingMore(false); }
  }, [feedType]);

  useEffect(() => { setPage(1); setPosts([]); loadPosts(1); }, [feedType, loadPosts]);

  useEffect(() => {
    const obs = new IntersectionObserver((e) => { if (e[0].isIntersecting && hasMore && !loadingMore) { setPage((p) => { const n = p + 1; loadPosts(n, true); return n; }); } }, { threshold: 0.1, rootMargin: "200px" });
    if (observerRef.current) obs.observe(observerRef.current);
    return () => obs.disconnect();
  }, [hasMore, loadingMore, loadPosts]);

  useEffect(() => { const h = () => setShowBackToTop(window.scrollY > 500); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) setCurrentUser(user);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    getSubscriptionPackages().then((res: any) => {
      if (res.success && res.data?.length) {
        const featured = res.data.find((p: any) => p.is_featured) || res.data.find((p: any) => p.slug === "pro") || res.data[0];
        setFeaturedPackage(featured);
      }
    }).catch(() => {});
  }, []);

  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) {
      setFilteredPosts([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const q = searchQuery.toLowerCase();
    const filtered = posts.filter(
      (post) =>
        post.title?.toLowerCase().includes(q) ||
        post.content?.toLowerCase().includes(q) ||
        post.author?.full_name?.toLowerCase().includes(q)
    );
    setFilteredPosts(filtered);
  }, [searchQuery, posts]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setFilteredPosts([]);
    setIsSearching(false);
  }, []);

  const displayPosts = isSearching ? filteredPosts : posts;

  useEffect(() => {
    Promise.all([getTrendingTopics(), getSuggestedUsers()]).then(([topics, users]) => {
      if (topics.success) setTrendingTopics(topics.data);
      if (users.success) setWhoToFollow(users.data);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F5F7] dark:bg-[#0D0D12]">
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#16161D] border-b border-gray-200/80 dark:border-gray-800/80">
        <div className="max-w-[1280px] mx-auto px-4 h-[56px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-xl bg-[#0066FF]"><GraduationCapIcon /></div>
              <span className="text-[17px] font-bold text-gray-900 dark:text-white hidden sm:block tracking-tight">EduConnect</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-0.5">
            {[{ label: "Home", href: "/feed" }, { label: "Discover", href: "/discover" }, { label: "Communities", href: "#" }].map((tab, i) => (
              <Link key={tab.label} href={tab.href} className={`px-4 py-2 rounded-lg text-[14px] font-medium transition-all ${i === 0 ? "text-[#0066FF] bg-[#0066FF]/8" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"}`}>{tab.label}</Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" /><Input placeholder="Search posts, people, or topics..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }} className="pl-10 pr-9 h-9 w-56 lg:w-72 rounded-full bg-gray-100 dark:bg-gray-800/80 border-0 text-[13px]" />{searchQuery && <button onClick={handleClearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><X className="size-3.5" /></button>}</div>
            <button onClick={() => document.documentElement.classList.toggle("dark")} className="size-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors text-[15px]">🌙</button>
            <Link href="/dashboard/notifications" className="relative size-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors">
              <Bell className="size-[18px] text-gray-500 dark:text-gray-400" />
            </Link>
            <button className="flex items-center gap-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1.5 transition-colors">
              <Avatar className="size-8">
                {currentUser?.avatar?.key ? (
                  <img src={getCloudinaryUrl(currentUser.avatar.key, { w: 64, h: 64 })} alt="" className="w-full h-full object-cover" />
                ) : (
                  <AvatarFallback className="text-[11px] font-bold bg-blue-50 dark:bg-blue-950/50 text-[#0066FF]">{getInitials(currentUser?.full_name || "U")}</AvatarFallback>
                )}
              </Avatar>
              <ChevronDown className="size-3 text-gray-400 hidden sm:block" />
            </button>
          </div>
        </div>
      </nav>

      {/* 3-Column Layout */}
      <div className="max-w-[1280px] mx-auto px-4 pt-[72px] pb-8">
        <div className="flex gap-5">
          {/* Left Sidebar */}
          <aside className="hidden lg:block w-[240px] shrink-0">
            <div className="sticky top-[72px]">
              <div className="space-y-0.5">
                {[{ icon: Home, label: "Home", href: "/feed", active: true }, { icon: Search, label: "Explore", href: "#" }, { icon: Bell, label: "Notifications", href: "/dashboard/notifications" }, { icon: MessageSquare, label: "Messages", href: "/dashboard/messages" }, { icon: Bookmark, label: "Bookmarks", href: "#" }, { icon: User, label: "Profile", href: "/dashboard/profile" }, { icon: Settings, label: "Settings", href: "/dashboard/settings" }].map((item) => (
                  <Link key={item.label} href={item.href} className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-[15px] font-medium transition-all ${item.active ? "text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white"}`}>
                    <item.icon className="size-[18px]" /><span>{item.label}</span>
                  </Link>
                ))}
              </div>
              <button onClick={() => setShowCreatePost(true)} className="flex items-center justify-center gap-2 w-full mt-4 py-2.5 rounded-full bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold text-[14px] shadow-lg shadow-blue-500/20 transition-all">
                <Plus className="size-4" /> Create Post
              </button>
              <div className="mt-4 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-[#16161D] p-4 text-center">
                <Crown className="size-8 text-[#0066FF] mx-auto" />
                <p className="mt-2 text-[13px] font-bold text-gray-900 dark:text-white">Upgrade to {featuredPackage?.name || "Pro"}</p>
                <p className="mt-1 text-[12px] text-gray-500">Unlock premium features</p>
                <Link href="/dashboard/subscription">
                  <Button variant="outline" size="sm" className="mt-3 rounded-full text-[12px] h-7 px-4 border-[#0066FF] text-[#0066FF] hover:bg-[#0066FF] hover:text-white">Upgrade Now</Button>
                </Link>
              </div>
            </div>
          </aside>

          {/* Center Feed */}
          <main className="flex-1 max-w-full lg:max-w-[580px] min-w-0">
            <div className="bg-white dark:bg-[#16161D] rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[14px] font-bold text-gray-900 dark:text-white">Stories</h3>
                
              </div>
              <StoryBubbles onCreateStory={() => setShowCreateStory(true)} />
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5 p-0.5 bg-white dark:bg-[#16161D] rounded-full border border-gray-200/80 dark:border-gray-800/80">
                <button onClick={() => setFeedType("latest")} className={`px-5 py-2 rounded-full text-[13px] font-semibold transition-all ${feedType === "latest" ? "bg-[#0066FF] text-white shadow-md shadow-blue-500/20" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"}`}>For You</button>
                <button onClick={() => setFeedType("trending")} className={`px-5 py-2 rounded-full text-[13px] font-semibold transition-all ${feedType === "trending" ? "bg-[#0066FF] text-white shadow-md shadow-blue-500/20" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"}`}>Trending</button>
              </div>
            </div>

            {loading ? <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <PostSkeleton key={i} />)}</div>
            : displayPosts.length === 0 ? (isSearching ? <div className="bg-white dark:bg-[#16161D] rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-16 text-center"><div className="size-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto"><Search className="size-6 text-gray-300 dark:text-gray-600" /></div><h3 className="mt-4 text-[16px] font-bold text-gray-900 dark:text-white">No results found</h3><p className="mt-1.5 text-[14px] text-gray-500">Try a different search query.</p><button onClick={handleClearSearch} className="mt-3 text-[13px] font-semibold text-[#0066FF] hover:underline">Clear search</button></div> : <EmptyState />)
            : <div className="space-y-4">{displayPosts.map((post) => <PostCard key={post.id} post={post} expandedComments={expandedComments} setExpandedComments={setExpandedComments} expandedPost={expandedPost} setExpandedPost={setExpandedPost} onImageClick={setImageModal} />)}</div>}

            <div ref={observerRef} className="h-4" />
            {loadingMore && <div className="flex justify-center py-8"><Loader2 className="size-6 text-[#0066FF] animate-spin" /></div>}
            {!hasMore && posts.length > 0 && <p className="text-center text-[13px] text-gray-400 py-8">You&apos;ve seen all posts</p>}
          </main>

          {/* Right Sidebar */}
          <aside className="hidden xl:block w-[300px] shrink-0">
            <div className="sticky top-[72px] space-y-4">
              <div className="bg-white dark:bg-[#16161D] rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-5">
                <div className="flex items-center justify-between mb-4"><h3 className="text-[15px] font-bold text-gray-900 dark:text-white">Trending Topics</h3></div>
                <div className="space-y-3.5">
                  {trendingTopics.length > 0 ? trendingTopics.map((topic, i) => (
                    <div key={topic.tag} className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center gap-3"><span className="text-[12px] font-bold text-gray-300 dark:text-gray-600 w-5">{i + 1}</span><div><p className="text-[14px] font-semibold text-[#0066FF] group-hover:text-[#0052CC]">{topic.tag}</p><p className="text-[12px] text-gray-400">{topic.posts}</p></div></div>
                      <TrendingUp className="size-3.5 text-gray-300" />
                    </div>
                  )) : <p className="text-[13px] text-gray-400">No trending topics yet</p>}
                </div>
              </div>
              <div className="bg-white dark:bg-[#16161D] rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-5">
                <div className="flex items-center justify-between mb-4"><h3 className="text-[15px] font-bold text-gray-900 dark:text-white">Who to follow</h3></div>
                <div className="space-y-3.5">
                  {whoToFollow.length > 0 ? whoToFollow.map((user) => (
                    <div key={user.id || user.handle} className="flex items-center gap-3">
                      <Avatar className="size-10">
                        {user.avatar_key ? (
                          <img src={getCloudinaryUrl(user.avatar_key, { w: 80, h: 80 })} alt="" className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <AvatarFallback className="text-[11px] font-bold bg-blue-50 dark:bg-blue-950/50 text-[#0066FF]">{getInitials(user.name)}</AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1 min-w-0"><p className="text-[14px] font-semibold text-gray-900 dark:text-white truncate">{user.name}</p><p className="text-[12px] text-gray-400">{user.handle}</p></div>
                      <Button variant="outline" size="sm" className="rounded-full text-[12px] h-7 px-3.5 border-gray-200 dark:border-gray-700 text-[#0066FF] hover:bg-[#0066FF] hover:text-white hover:border-[#0066FF]">Follow</Button>
                    </div>
                  )) : <p className="text-[13px] text-gray-400">No suggestions yet</p>}
                </div>
              </div>
              <div className="rounded-2xl border border-blue-200/50 dark:border-blue-900/50 bg-gradient-to-br from-blue-50/80 to-white dark:from-blue-950/20 dark:to-[#16161D] p-5">
                <Crown className="size-10 text-[#0066FF] mx-auto" />
                <h3 className="mt-3 text-[15px] font-bold text-gray-900 dark:text-white text-center">Get More with {featuredPackage?.name || "Pro"}</h3>
                <div className="mt-3 space-y-2">
                  {(featuredPackage?.features?.length ? featuredPackage.features.filter((f: any) => f.is_included).map((f: any) => f.label) : ["Enhanced visibility", "Priority listing", "Advanced tools"]).map((label: string) => (
                    <div key={label} className="flex items-center gap-2 text-[13px] text-gray-600 dark:text-gray-400"><CheckIcon className="size-3.5 text-[#0066FF] shrink-0" /> {label}</div>
                  ))}
                </div>
                <Link href="/dashboard/subscription">
                  <Button className="mt-4 w-full rounded-full bg-[#0066FF] hover:bg-[#0052CC] text-white h-9 text-[13px] font-semibold shadow-lg shadow-blue-500/20">Upgrade Now</Button>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {showBackToTop && <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="fixed bottom-6 right-6 size-11 rounded-full bg-[#0066FF] text-white shadow-xl shadow-blue-500/30 flex items-center justify-center hover:bg-[#0052CC] transition-all hover:scale-110 z-50"><ArrowUp className="size-5" /></button>}

      {imageModal && <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={() => setImageModal(null)}><button className="absolute top-4 right-4 size-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20" onClick={() => setImageModal(null)}><X className="size-5" /></button><img src={imageModal} alt="" className="max-w-full max-h-[90vh] object-contain rounded-2xl" onClick={(e) => e.stopPropagation()} /></div>}

      <CreatePostModal open={showCreatePost} onClose={() => setShowCreatePost(false)} onCreated={() => loadPosts(1)} />
      <CreateStoryModal open={showCreateStory} onClose={() => setShowCreateStory(false)} onCreated={() => loadPosts(1)} />
    </div>
  );
}

function PostCard({ post, expandedComments, setExpandedComments, expandedPost, setExpandedPost, onImageClick }: any) {
  const [showMenu, setShowMenu] = useState(false);
  const isExpanded = expandedPost === post.id;
  const content = stripHtml(post.content);
  const shouldTruncate = content.length > 280 && !isExpanded;

  return (
    <article className="bg-white dark:bg-[#16161D] rounded-2xl border border-gray-200/80 dark:border-gray-800/80 overflow-hidden hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-full overflow-hidden ring-2 ring-gray-100 dark:ring-gray-800 shrink-0">
            {post.author.avatar ? <img src={getCloudinaryUrl(post.author.avatar.key, { w: 88, h: 88 })} alt="" className="w-full h-full object-cover" loading="lazy" />
            : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600"><span className="text-[11px] font-bold text-white">{getInitials(post.author.full_name)}</span></div>}
          </div>
          <div>
            <span className="text-[15px] font-semibold text-gray-900 dark:text-white">{post.author.full_name}</span>
            <div className="flex items-center gap-1.5 text-[12px] text-gray-400">
              <span>{timeAgo(post.created_at)}</span>
              {post.type === "OFFERING" && <><span>·</span><span className="text-[#22C55E] font-medium">Offering</span></>}
              {post.type === "SEEKING" && <><span>·</span><span className="text-[#F59E0B] font-medium">Seeking</span></>}
            </div>
          </div>
        </div>
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} className="size-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center"><MoreHorizontal className="size-4 text-gray-400" /></button>
          {showMenu && <><div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} /><div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-1.5 z-20">{["Save", "Report", "Copy Link"].map((item) => (<button key={item} className="w-full px-4 py-2 text-left text-[13px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50" onClick={() => setShowMenu(false)}>{item}</button>))}</div></>}
        </div>
      </div>
      <div className="px-5 pb-3">
        {post.title && <h2 className="text-[17px] font-bold text-gray-900 dark:text-white mb-1.5">{post.title}</h2>}
        <p className={`text-[15px] text-gray-600 dark:text-gray-300 leading-[1.65] ${shouldTruncate ? "line-clamp-3" : ""}`}>{content}</p>
        {shouldTruncate && <button onClick={() => setExpandedPost(post.id)} className="text-[#0066FF] text-[13px] font-semibold mt-1 hover:underline">See more</button>}
        {isExpanded && <button onClick={() => setExpandedPost(null)} className="text-[#0066FF] text-[13px] font-semibold mt-1 hover:underline">Show less</button>}
      </div>
      {post.subjects?.length > 0 && <div className="px-5 pb-3 flex flex-wrap gap-1.5">{post.subjects.map((s: any) => (<span key={s.subject.id} className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-950/30 px-2.5 py-1 text-[12px] font-medium text-[#0066FF]"><Hash className="size-3" />{s.subject.name}</span>))}</div>}
      {post.media?.length > 0 && <div className="px-5 pb-3">{post.media.length === 1 ? (<div className="rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer" onClick={() => onImageClick(getMediaUrl(post.media[0].key))}><img src={getMediaUrl(post.media[0].key)} alt="" className="w-full aspect-[16/10] object-cover hover:scale-[1.01] transition-transform duration-500" loading="lazy" /></div>) : (<div className="grid grid-cols-2 gap-1 rounded-2xl overflow-hidden">{post.media.slice(0, 4).map((m: any, i: number) => (<div key={m.id} className="relative overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer aspect-square" onClick={() => onImageClick(getMediaUrl(m.key))}><img src={getMediaUrl(m.key)} alt="" className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500" loading="lazy" />{post.media.length > 4 && i === 3 && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><span className="text-white text-lg font-bold">+{post.media.length - 4}</span></div>}</div>))}</div>)}</div>}
      <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between">
        <div className="flex items-center gap-0.5">
          <LikeButton postId={post.id} />
          <Button variant="ghost" size="sm" className="rounded-full px-3 h-8 text-[13px] font-medium text-gray-500 hover:text-[#0066FF] hover:bg-[#0066FF]/5" onClick={() => setExpandedComments((p: any) => ({ ...p, [post.id]: !p[post.id] }))}>💬 Comment</Button>
          <Button variant="ghost" size="sm" className="rounded-full px-3 h-8 text-[13px] font-medium text-gray-500 hover:text-[#22C55E] hover:bg-[#22C55E]/5">Share</Button>
        </div>
        <Button variant="ghost" size="sm" className="rounded-full px-3 h-8 text-[13px] font-medium text-gray-500 hover:text-[#F59E0B]">Save</Button>
      </div>
      {expandedComments[post.id] && <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-800/80 pt-4"><CommentSection postId={post.id} /></div>}
    </article>
  );
}

function PostSkeleton() { return <div className="bg-white dark:bg-[#16161D] rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-5 animate-pulse"><div className="flex items-center gap-3 mb-4"><div className="size-11 rounded-full bg-gray-200 dark:bg-gray-700" /><div className="space-y-2"><div className="h-3.5 w-32 bg-gray-200 dark:bg-gray-700 rounded-full" /><div className="h-2.5 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" /></div></div><div className="space-y-2 mb-4"><div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-full" /><div className="h-3.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full" /></div><div className="aspect-[16/10] rounded-2xl bg-gray-200 dark:bg-gray-700" /></div>; }
function EmptyState() { return <div className="bg-white dark:bg-[#16161D] rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-16 text-center"><div className="size-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-6 text-gray-300 dark:text-gray-600"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></div><h3 className="mt-4 text-[16px] font-bold text-gray-900 dark:text-white">No posts yet</h3><p className="mt-1.5 text-[14px] text-gray-500">Be the first to share something.</p></div>; }
function GraduationCapIcon() { return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="size-4"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3z"/></svg>; }
function CheckIcon(props: any) { return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={props.className}><polyline points="20 6 9 17 4 12"/></svg>; }
