"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Search, Star, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getAdminReviews, hideReviewAction } from "@/lib/actions/admin";

interface Review {
  id: string;
  rating: number;
  comment: string;
  status: string;
  created_at: string;
  reviewer?: { full_name: string };
  service?: { title: string };
}

const statusConfig: Record<string, { label: string; color: string }> = {
  VISIBLE: { label: "Visible", color: "bg-green-50 text-green-600" },
  HIDDEN: { label: "Hidden", color: "bg-red-50 text-red-600" },
};

export function AdminReviewsContent() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, total_pages: 0 });
  const [search, setSearch] = useState("");
  const [hiding, setHiding] = useState<string | null>(null);

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: "20" });
      if (search) params.set("search", search);

      const res = await getAdminReviews(params.toString());
      if (res.success) {
        setReviews(res.data);
        setMeta(res.meta || { total: 0, total_pages: 0 });
      } else {
        toast.error(res.error || "Failed to load reviews");
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { load(page); }, [page, load]);

  const handleHide = async (id: string) => {
    setHiding(id);
    try {
      const res = await hideReviewAction(id);
      if (res.success) {
        toast.success("Review hidden");
        load(page);
      } else {
        toast.error(res.error || "Failed to hide review");
      }
    } finally {
      setHiding(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Reviews Management</h1>
        <p className="mt-1 text-sm text-gray-500">Review and moderate service reviews</p>
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
                  placeholder="Search reviews..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && setPage(1)}
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="border border-gray-100 dark:border-gray-800 rounded-[16px]">
              <CardContent className="p-4 animate-pulse">
                <div className="space-y-2">
                  <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  <div className="h-2 w-64 bg-gray-200 dark:bg-gray-700 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <Card className="border border-gray-100 dark:border-gray-800 rounded-[24px]">
          <CardContent className="p-16 text-center">
            <Star className="size-12 text-gray-300 dark:text-gray-600 mx-auto" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No reviews found</h3>
            <p className="mt-2 text-sm text-gray-500">No reviews to moderate at this time.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {reviews.map((r) => {
            const status = statusConfig[r.status] || statusConfig.VISIBLE;
            return (
              <Card key={r.id} className="border border-gray-100 dark:border-gray-800 rounded-[16px] hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`size-3.5 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                          ))}
                        </div>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{r.comment}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        by {r.reviewer?.full_name || "Unknown"} for {r.service?.title || "Service"} &middot; {new Date(r.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {r.status === "VISIBLE" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleHide(r.id)}
                        disabled={hiding === r.id}
                      >
                        {hiding === r.id ? <Loader2 className="size-4 animate-spin" /> : <EyeOff className="size-4" />}
                      </Button>
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
