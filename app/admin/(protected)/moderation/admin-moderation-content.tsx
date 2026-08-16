"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Search, ShieldAlert, FileText, Star, Trash2, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getModerationItems, removePostAction, hideReviewAction } from "@/lib/actions/admin";

interface ModerationItem {
  id: string;
  item_type: "POST" | "REVIEW";
  title?: string;
  content?: string;
  comment?: string;
  rating?: number;
  type?: string;
  status: string;
  created_at: string;
  author?: { full_name: string; avatar?: { key: string } };
  reviewer?: { full_name: string; avatar?: { key: string } };
  service?: { title: string; teacher?: { full_name: string } };
  engagement?: { likes: number; comments: number };
}

const typeConfig: Record<string, { label: string; color: string }> = {
  POST: { label: "Post", color: "bg-blue-50 text-blue-600" },
  REVIEW: { label: "Review", color: "bg-amber-50 text-amber-600" },
};

const statusConfig: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: "Active", color: "bg-green-50 text-green-600" },
  VISIBLE: { label: "Visible", color: "bg-green-50 text-green-600" },
  CLOSED: { label: "Closed", color: "bg-gray-50 text-gray-600" },
  HIDDEN: { label: "Hidden", color: "bg-red-50 text-red-600" },
  DELETED: { label: "Deleted", color: "bg-red-50 text-red-600" },
};

export function AdminModerationContent() {
  const [items, setItems] = useState<ModerationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, total_pages: 0 });
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: "20", type: typeFilter });
      if (search) params.set("search", search);

      const res = await getModerationItems(params.toString());
      if (res.success) {
        setItems(res.data);
        setMeta(res.meta || { total: 0, total_pages: 0 });
      } else {
        toast.error(res.error || "Failed to load moderation items");
      }
    } catch {
      toast.error("Failed to load moderation items");
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter]);

  useEffect(() => { load(page); }, [page, load]);

  const handleSearch = () => {
    setPage(1);
    load(1);
  };

  const handleRemovePost = async (id: string) => {
    setActing(id);
    try {
      const res = await removePostAction(id);
      if (res.success) {
        toast.success("Post removed");
        load(page);
      } else {
        toast.error(res.error || "Failed to remove post");
      }
    } finally {
      setActing(null);
    }
  };

  const handleHideReview = async (id: string) => {
    setActing(id);
    try {
      const res = await hideReviewAction(id);
      if (res.success) {
        toast.success("Review hidden");
        load(page);
      } else {
        toast.error(res.error || "Failed to hide review");
      }
    } finally {
      setActing(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Content Moderation</h1>
        <p className="mt-1 text-sm text-gray-500">Review and moderate posts and reviews across the platform</p>
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
                  placeholder="Search content..."
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
              <option value="all">All Content</option>
              <option value="posts">Posts Only</option>
              <option value="reviews">Reviews Only</option>
            </select>
            <Button variant="outline" size="sm" className="rounded-xl" onClick={handleSearch}>
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Items List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="border border-gray-100 dark:border-gray-800 rounded-[16px]">
              <CardContent className="p-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-40 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div className="h-2 w-48 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  </div>
                  <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card className="border border-gray-100 dark:border-gray-800 rounded-[24px]">
          <CardContent className="p-16 text-center">
            <ShieldAlert className="size-12 text-gray-300 dark:text-gray-600 mx-auto" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No items to moderate</h3>
            <p className="mt-2 text-sm text-gray-500">All content is within guidelines.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {items.map((item) => {
            const type = typeConfig[item.item_type] || typeConfig.POST;
            const status = statusConfig[item.status] || statusConfig.ACTIVE;
            const authorName = item.item_type === "POST"
              ? item.author?.full_name || "Unknown"
              : item.reviewer?.full_name || "Unknown";

            return (
              <Card key={`${item.item_type}-${item.id}`} className="border border-gray-100 dark:border-gray-800 rounded-[16px] hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${type.color}`}>
                          {item.item_type === "POST" ? <FileText className="size-3 mr-1" /> : <Star className="size-3 mr-1" />}
                          {type.label}
                        </span>
                        {item.type && (
                          <span className="text-[10px] text-gray-400 uppercase">{item.type}</span>
                        )}
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {item.title || item.comment?.slice(0, 80) || "No content"}
                      </h3>
                      {item.item_type === "REVIEW" && item.rating && (
                        <div className="flex items-center gap-0.5 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`size-3 ${i < item.rating! ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                          ))}
                        </div>
                      )}
                      {item.item_type === "POST" && item.engagement && (
                        <p className="text-xs text-gray-400 mt-1">
                          {item.engagement.likes} likes &middot; {item.engagement.comments} comments
                        </p>
                      )}
                      {item.item_type === "REVIEW" && item.service && (
                        <p className="text-xs text-gray-400 mt-1">
                          for {item.service.title} by {item.service.teacher?.full_name}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-0.5">
                        by {authorName} &middot; {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {item.item_type === "POST" && item.status === "ACTIVE" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleRemovePost(item.id)}
                          disabled={acting === item.id}
                        >
                          {acting === item.id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                        </Button>
                      )}
                      {item.item_type === "REVIEW" && item.status === "VISIBLE" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleHideReview(item.id)}
                          disabled={acting === item.id}
                        >
                          {acting === item.id ? <Loader2 className="size-4 animate-spin" /> : <Eye className="size-4" />}
                        </Button>
                      )}
                    </div>
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
