"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { searchServices, searchPosts } from "@/lib/actions/discover";
import { LocationPicker } from "@/components/location/location-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search, MapPin, Loader2, BookOpen, User, SlidersHorizontal,
  GraduationCap, Clock, Star, ChevronDown, X, ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { getCloudinaryUrl } from "@/lib/utils";

function SearchContentInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQuery = searchParams.get("q") || "";
  const initialTab = (searchParams.get("tab") as "services" | "posts") || "services";

  const [tab, setTab] = useState<"services" | "posts">(initialTab);
  const [q, setQ] = useState(initialQuery);
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [format, setFormat] = useState("");
  const [mode, setMode] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState({ total: 0, total_pages: 0, page: 1 });

  const fetchResults = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params: Record<string, string | number | undefined> = {
        state,
        city,
        area,
        page,
        limit: 12,
        ...(q ? { q, search: q } : {}),
        ...(format ? { format } : {}),
        ...(mode ? { mode } : {}),
      };

      if (tab === "services") {
        const res = await searchServices(params);
        if (res.success) {
          setResults(res.data);
          setMeta(res.meta || { total: 0, total_pages: 0, page: 1 });
        }
      } else {
        const res = await searchPosts({ ...params, type: "SEEKING" });
        if (res.success) {
          setResults(res.data);
          setMeta(res.meta || { total: 0, total_pages: 0, page: 1 });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [tab, q, state, city, area, format, mode]);

  useEffect(() => {
    const timer = setTimeout(() => fetchResults(1), 400);
    return () => clearTimeout(timer);
  }, [fetchResults]);

  const clearFilters = () => {
    setState("");
    setCity("");
    setArea("");
    setFormat("");
    setMode("");
    setQ("");
  };

  const hasActiveFilters = state || city || area || format || mode;

  return (
    <div className="min-h-screen bg-[#F4F5F7] dark:bg-[#0D0D12]">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-[#16161D] border-b border-gray-200/80 dark:border-gray-800/80">
        <div className="max-w-[1280px] mx-auto px-4 h-[56px] flex items-center gap-4">
          <Link href="/feed" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
            <ArrowLeft className="size-4" />
          </Link>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              placeholder="Search coaching services, teachers, topics..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-10 pr-4 h-10 rounded-full bg-gray-100 dark:bg-gray-800/80 border-0 text-[14px]"
              autoFocus
            />
            {q && (
              <button onClick={() => setQ("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="size-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium transition-all ${
              showFilters || hasActiveFilters
                ? "bg-[#0066FF] text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <SlidersHorizontal className="size-4" />
            Filters
            {hasActiveFilters && (
              <span className="size-5 rounded-full bg-white/20 text-[11px] flex items-center justify-center">
                {[state, city, area, format, mode].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>
      </nav>

      <div className="max-w-[1280px] mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex gap-0.5 p-0.5 bg-white dark:bg-[#16161D] rounded-full border border-gray-200/80 dark:border-gray-800/80">
            <button
              onClick={() => setTab("services")}
              className={`px-5 py-2 rounded-full text-[13px] font-semibold transition-all ${
                tab === "services"
                  ? "bg-[#0066FF] text-white shadow-md shadow-blue-500/20"
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <BookOpen className="size-3.5 inline mr-1.5" />
              Coaching Services
            </button>
            <button
              onClick={() => setTab("posts")}
              className={`px-5 py-2 rounded-full text-[13px] font-semibold transition-all ${
                tab === "posts"
                  ? "bg-[#0066FF] text-white shadow-md shadow-blue-500/20"
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <User className="size-3.5 inline mr-1.5" />
              Student Requests
            </button>
          </div>
          {meta.total > 0 && (
            <span className="text-[13px] text-gray-400 ml-2">
              {meta.total} result{meta.total !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <aside className="w-full lg:w-[280px] shrink-0">
              <div className="bg-white dark:bg-[#16161D] rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-5 sticky top-[80px]">
                <h3 className="text-[15px] font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <MapPin className="size-4 text-[#0066FF]" /> Location
                </h3>
                <LocationPicker
                  state={state}
                  city={city}
                  area={area}
                  onStateChange={(v) => { setState(v); setCity(""); setArea(""); }}
                  onCityChange={(v) => { setCity(v); setArea(""); }}
                  onAreaChange={setArea}
                />

                {tab === "services" && (
                  <>
                    <div className="border-t border-gray-100 dark:border-gray-800 mt-4 pt-4">
                      <h4 className="text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-3">Format</h4>
                      <div className="flex flex-wrap gap-2">
                        {["BATCH", "INDIVIDUAL", "HOME_PRIVATE"].map((f) => (
                          <button
                            key={f}
                            onClick={() => setFormat(format === f ? "" : f)}
                            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${
                              format === f
                                ? "bg-[#0066FF] text-white"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200"
                            }`}
                          >
                            {f.replace("_", " ")}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-800 mt-4 pt-4">
                      <h4 className="text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-3">Mode</h4>
                      <div className="flex flex-wrap gap-2">
                        {["ONLINE", "OFFLINE", "HYBRID"].map((m) => (
                          <button
                            key={m}
                            onClick={() => setMode(mode === m ? "" : m)}
                            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${
                              mode === m
                                ? "bg-[#0066FF] text-white"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200"
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <Button
                  variant="outline"
                  className="w-full mt-4 h-10 rounded-xl border-gray-200 text-gray-600 hover:text-[#0066FF] hover:bg-blue-50"
                  onClick={clearFilters}
                >
                  Clear All Filters
                </Button>
              </div>
            </aside>
          )}

          {/* Results */}
          <main className="flex-1 min-w-0">
            {loading ? (
              <div className="flex py-20 justify-center">
                <Loader2 className="size-8 animate-spin text-[#0066FF]" />
              </div>
            ) : results.length === 0 ? (
              <div className="bg-white dark:bg-[#16161D] rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-16 text-center">
                <div className="size-16 rounded-3xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-4">
                  <Search className="size-8 text-[#0066FF]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {q ? `No results for "${q}"` : "Start searching"}
                </h3>
                <p className="mt-2 text-gray-500 max-w-md mx-auto">
                  {q
                    ? "Try different keywords or adjust your filters to find more matches."
                    : "Search for coaching services, teachers, or student requests in Bangladesh."
                  }
                </p>
                {hasActiveFilters && (
                  <Button variant="outline" className="mt-4 rounded-full" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {results.map((item) =>
                  tab === "services" ? (
                    <ServiceCard key={item.id} service={item} />
                  ) : (
                    <PostCard key={item.id} post={item} />
                  )
                )}
              </div>
            )}

            {/* Pagination */}
            {meta.total_pages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: Math.min(meta.total_pages, 5) }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => fetchResults(p)}
                    className={`size-10 rounded-xl text-[13px] font-semibold transition-all ${
                      p === meta.page
                        ? "bg-[#0066FF] text-white shadow-md"
                        : "bg-white dark:bg-[#16161D] border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export function SearchContent() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F4F5F7] dark:bg-[#0D0D12] flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#0066FF]" />
      </div>
    }>
      <SearchContentInner />
    </Suspense>
  );
}

// ── Cards ─────────────────────────────────────────────────

function ServiceCard({ service }: { service: any }) {
  return (
    <Link href={`/services/${service.slug}`}>
      <div className="bg-white dark:bg-[#16161D] rounded-2xl border border-gray-200/80 dark:border-gray-800/80 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 p-5 flex flex-col h-full cursor-pointer">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-green-50 text-green-600">
              {service.format}
            </span>
            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-blue-50 text-blue-600">
              {service.mode}
            </span>
          </div>
          {service.average_rating > 0 && (
            <div className="flex items-center gap-1 text-[12px] font-semibold text-amber-600">
              <Star className="size-3 fill-amber-400 text-amber-400" />
              {Number(service.average_rating).toFixed(1)}
            </div>
          )}
        </div>

        <h3 className="text-[16px] font-bold text-gray-900 dark:text-white line-clamp-2 mb-2">
          {service.title}
        </h3>

        {service.description && (
          <p className="text-[13px] text-gray-500 line-clamp-2 mb-3">
            {service.description}
          </p>
        )}

        <div className="flex items-center gap-2 text-[13px] text-gray-500 mb-3">
          <MapPin className="size-3.5 shrink-0 text-[#0066FF]" />
          <span className="truncate">
            {[service.area, service.city, service.state].filter(Boolean).join(", ")}
          </span>
        </div>

        {service.subjects?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {service.subjects.slice(0, 3).map((s: any) => (
              <span key={s.subject.id} className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:text-gray-400">
                {s.subject.name}
              </span>
            ))}
            {service.subjects.length > 3 && (
              <span className="text-[11px] text-gray-400">+{service.subjects.length - 3}</span>
            )}
          </div>
        )}

        <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {service.teacher?.avatar ? (
              <img src={getCloudinaryUrl(service.teacher.avatar.key, { w: 40, h: 40 })} alt="" className="size-6 rounded-full object-cover" />
            ) : (
              <div className="size-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[10px] font-bold">T</div>
            )}
            <span className="text-[13px] font-medium text-gray-700 dark:text-gray-300">
              {service.teacher?.full_name}
            </span>
          </div>
          <div className="text-[13px] font-bold text-[#0066FF]">
            {service.joining_fee ? `৳${service.joining_fee} joining` : "Free"}
          </div>
        </div>
      </div>
    </Link>
  );
}

function PostCard({ post }: { post: any }) {
  return (
    <div className="bg-white dark:bg-[#16161D] rounded-2xl border border-gray-200/80 dark:border-gray-800/80 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-amber-50 text-amber-600">
          SEEKING
        </span>
        {post.preferred_mode && (
          <span className="text-[12px] font-medium text-gray-500">{post.preferred_mode}</span>
        )}
      </div>

      <h3 className="text-[16px] font-bold text-gray-900 dark:text-white line-clamp-2 mb-2">
        {post.title || "Student looking for coaching"}
      </h3>

      {post.content && (
        <p className="text-[13px] text-gray-500 line-clamp-2 mb-3">
          {post.content.replace(/<[^>]*>/g, "").trim()}
        </p>
      )}

      <div className="flex items-center gap-2 text-[13px] text-gray-500 mb-3">
        <MapPin className="size-3.5 shrink-0 text-[#0066FF]" />
        <span className="truncate">
          {[post.area, post.city, post.state].filter(Boolean).join(", ") || "Virtual"}
        </span>
      </div>

      {post.budget_max && (
        <div className="text-[13px] font-bold text-gray-900 dark:text-white mb-3">
          Budget: ৳{post.budget_max}
        </div>
      )}

      <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {post.author?.avatar ? (
            <img src={getCloudinaryUrl(post.author.avatar.key, { w: 40, h: 40 })} alt="" className="size-6 rounded-full object-cover" />
          ) : (
            <div className="size-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 text-[10px] font-bold">S</div>
          )}
          <span className="text-[13px] font-medium text-gray-700 dark:text-gray-300">
            {post.author?.full_name}
          </span>
        </div>
        <Link href={`/feed`} className="text-[13px] font-bold text-[#0066FF] hover:underline">
          View Post
        </Link>
      </div>
    </div>
  );
}
