"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "@/lib/contexts/user-context";
import { getReviewList } from "@/lib/actions/modules";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star, MessageSquare } from "lucide-react";

interface Review {
  id: string; rating: number; comment: string; reply?: string;
  created_at: string;
  student?: { user?: { full_name: string } };
  teacher?: { user?: { full_name: string } };
}

export function ReviewsContent() {
  const user = useUser();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, total_pages: 0 });

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = (await getReviewList(p, 20)) as any;
      if (res.success) { setReviews(res.data); setMeta(res.meta); }
    } catch { }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(page); }, [page, load]);

  function renderStars(rating: number) {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`size-4 ${i < rating ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-600"}`} />
    ));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Reviews</h1>
        <p className="mt-1 text-sm text-gray-500">Student feedback and teacher replies</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border border-gray-100 dark:border-gray-800 rounded-[20px]">
              <CardContent className="p-5 animate-pulse">
                <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded-full mb-2" />
                <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <Card className="border border-gray-100 dark:border-gray-800 rounded-[24px]">
          <CardContent className="p-16 text-center">
            <Star className="size-12 text-gray-300 dark:text-gray-600 mx-auto" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No reviews yet</h3>
            <p className="mt-2 text-sm text-gray-500">Reviews will appear here once students leave feedback.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="border border-gray-100 dark:border-gray-800 rounded-[20px] hover:shadow-sm transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating)}
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {review.student?.user?.full_name || "Student"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{review.comment}</p>
                {review.reply && (
                  <div className="mt-3 pl-4 border-l-2 border-[#0066FF]/30">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare className="size-3.5 text-[#0066FF]" />
                      <span className="text-xs font-semibold text-[#0066FF]">
                        {review.teacher?.user?.full_name || "Teacher"} replied
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{review.reply}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {meta.total_pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button variant="outline" size="sm" className="rounded-full" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft className="size-4" /></Button>
          <span className="text-sm text-gray-500">Page {page} of {meta.total_pages}</span>
          <Button variant="outline" size="sm" className="rounded-full" onClick={() => setPage((p) => Math.min(meta.total_pages, p + 1))} disabled={page === meta.total_pages}><ChevronRight className="size-4" /></Button>
        </div>
      )}
    </div>
  );
}
