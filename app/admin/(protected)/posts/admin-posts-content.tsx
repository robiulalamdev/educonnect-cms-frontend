"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Search, FileText, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { getAdminPosts } from "@/lib/actions/admin";

interface Post {
  id: string;
  title: string;
  content: string;
  type: string;
  status: string;
  created_at: string;
  author?: { full_name: string; email: string };
  media?: { url: string }[];
}

const typeConfig: Record<string, { label: string; color: string }> = {
  OFFERING: { label: "Offering", color: "bg-blue-50 text-blue-600" },
  SEEKING: { label: "Seeking", color: "bg-purple-50 text-purple-600" },
};

const statusConfig: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: "Active", color: "bg-green-50 text-green-600" },
  CLOSED: { label: "Closed", color: "bg-gray-50 text-gray-600" },
  DELETED: { label: "Deleted", color: "bg-red-50 text-red-600" },
};

export function AdminPostsContent() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, total_pages: 0 });
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: "20" });
      if (search) params.set("search", search);
      if (typeFilter) params.set("type", typeFilter);

      const res = await getAdminPosts(params.toString());
      if (res.success) {
        setPosts(res.data);
        setMeta(res.meta || { total: 0, total_pages: 0 });
      } else {
        toast.error(res.error || "Failed to load posts");
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter]);

  useEffect(() => { load(page); }, [page, load]);

  const handleSearch = () => {
    setPage(1);
    load(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Posts Management</h1>
        <p className="mt-1 text-sm text-gray-500">Review and moderate user posts</p>
      </div>

      {/* Filters */}
      <Card className="border border-gray-100 dark:border-gray-800 rounded-[20px]">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="OFFERING">Offering</option>
              <option value="SEEKING">Seeking</option>
            </select>
            <Button variant="outline" size="sm" className="rounded-xl" onClick={handleSearch}>
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Posts List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="border border-gray-100 dark:border-gray-800 rounded-[16px]">
              <CardContent className="p-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div className="h-2 w-48 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  </div>
                  <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <Card className="border border-gray-100 dark:border-gray-800 rounded-[24px]">
          <CardContent className="p-16 text-center">
            <FileText className="size-12 text-gray-300 dark:text-gray-600 mx-auto" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No posts found</h3>
            <p className="mt-2 text-sm text-gray-500">Try adjusting your search or filters.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {posts.map((p) => {
            const type = typeConfig[p.type] || typeConfig.OFFERING;
            const status = statusConfig[p.status] || statusConfig.ACTIVE;
            return (
              <Card key={p.id} className="border border-gray-100 dark:border-gray-800 rounded-[16px] hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{p.title || "Untitled"}</h3>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${type.color}`}>
                          {type.label}
                        </span>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2">{p.content}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        by {p.author?.full_name || "Unknown"} &middot; {new Date(p.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {p.media?.[0]?.url && (
                      <img src={p.media[0].url} alt="" className="size-12 rounded-lg object-cover" />
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {meta.total_pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button variant="outline" size="sm" className="rounded-full" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            <ChevronLeft className="size-4" />
          </Button>
          <span className="text-sm text-gray-500">Page {page} of {meta.total_pages}</span>
          <Button variant="outline" size="sm" className="rounded-full" onClick={() => setPage((p) => Math.min(meta.total_pages, p + 1))} disabled={page === meta.total_pages}>
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
