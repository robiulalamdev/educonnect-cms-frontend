"use client";

import { useEffect, useState, useCallback } from "react";
import { getEnrollments } from "@/lib/actions/batches";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, CreditCard, ChevronLeft, ChevronRight, Calendar, DollarSign, BookOpen } from "lucide-react";

interface Enrollment {
  id: string; status: string; enrolled_at: string;
  batch?: { id: string; name: string; service?: { title: string } };
  payment_records?: Array<{ id: string; amount: number; status: string; method: string }>;
}

const statusColors: Record<string, string> = {
  APPROVED: "bg-green-50 text-green-600",
  PENDING: "bg-amber-50 text-amber-600",
  REJECTED: "bg-red-50 text-red-500",
  WAITLISTED: "bg-blue-50 text-blue-600",
  SUSPENDED: "bg-orange-50 text-orange-600",
};

export function EnrollmentsContent() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, total_pages: 0 });

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = (await getEnrollments(p, 10)) as any;
      if (res.success) { setEnrollments(res.data); setMeta(res.meta); }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(page); }, [page, load]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Enrollments</h1>
        <p className="mt-1 text-sm text-gray-500">View and manage your enrollments</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border border-gray-100 dark:border-gray-800 rounded-[20px]">
              <CardContent className="p-6 animate-pulse">
                <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded-full mb-3" />
                <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : enrollments.length === 0 ? (
        <Card className="border border-gray-100 dark:border-gray-800 rounded-[24px]">
          <CardContent className="p-16 text-center">
            <CreditCard className="size-12 text-gray-300 dark:text-gray-600 mx-auto" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No enrollments yet</h3>
            <p className="mt-2 text-sm text-gray-500">Enroll in a batch to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {enrollments.map((e) => (
            <Card key={e.id} className="border border-gray-100 dark:border-gray-800 rounded-[20px] hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusColors[e.status] || ""}`}>{e.status}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{e.batch?.name || "Batch"}</h3>
                    <p className="text-sm text-gray-500 mt-1">{e.batch?.service?.title || ""}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-[13px] text-gray-400">
                      <span className="flex items-center gap-1.5"><Calendar className="size-3.5" />{new Date(e.enrolled_at).toLocaleDateString()}</span>
                      {e.payment_records && e.payment_records.length > 0 && (
                        <span className="flex items-center gap-1.5"><DollarSign className="size-3.5" />${e.payment_records.reduce((sum, p) => sum + (p.amount || 0), 0)} paid</span>
                      )}
                    </div>
                  </div>
                </div>
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
