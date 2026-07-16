"use client";

import { useEffect, useState, useCallback } from "react";
import { getMyBatches } from "@/lib/actions/batches";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, GraduationCap, Users, Calendar, ChevronLeft, ChevronRight, Loader2, Plus } from "lucide-react";

interface Batch {
  id: string; name: string; description?: string; status: string;
  max_students: number; enrolled_count: number; waitlist_count: number;
  start_date?: string; end_date?: string; created_at: string;
  service?: { id: string; title: string };
}

const statusColors: Record<string, string> = {
  UPCOMING: "bg-amber-50 text-amber-600",
  ONGOING: "bg-green-50 text-green-600",
  COMPLETED: "bg-gray-100 text-gray-500",
  CANCELLED: "bg-red-50 text-red-500",
};

export function BatchesContent() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, total_pages: 0 });

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = (await getMyBatches(p, 10)) as any;
      if (res.success) { setBatches(res.data); setMeta(res.meta); }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(page); }, [page, load]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">My Batches</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your class batches</p>
        </div>
        <Button className="rounded-full bg-[#0066FF] hover:bg-[#0052CC] text-white shadow-lg shadow-blue-500/20 px-5">
          <Plus className="mr-2 size-4" /> New Batch
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border border-gray-100 dark:border-gray-800 rounded-[20px]">
              <CardContent className="p-6 animate-pulse">
                <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded-full mb-3" />
                <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full mb-2" />
                <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : batches.length === 0 ? (
        <Card className="border border-gray-100 dark:border-gray-800 rounded-[24px]">
          <CardContent className="p-16 text-center">
            <GraduationCap className="size-12 text-gray-300 dark:text-gray-600 mx-auto" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No batches yet</h3>
            <p className="mt-2 text-sm text-gray-500">Create a batch under your service to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {batches.map((batch) => (
            <Card key={batch.id} className="group border border-gray-100 dark:border-gray-800 rounded-[20px] hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusColors[batch.status] || ""}`}>{batch.status}</span>
                      {batch.service && <span className="text-xs text-gray-400">• {batch.service.title}</span>}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{batch.name}</h3>
                    {batch.description && <p className="mt-1 text-sm text-gray-500 line-clamp-2">{batch.description}</p>}
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-[13px] text-gray-400">
                      <span className="flex items-center gap-1.5"><Users className="size-3.5" />{batch.enrolled_count}/{batch.max_students} students</span>
                      {batch.start_date && <span className="flex items-center gap-1.5"><Calendar className="size-3.5" />{new Date(batch.start_date).toLocaleDateString()}</span>}
                      {batch.waitlist_count > 0 && <span className="text-amber-500">+{batch.waitlist_count} waitlisted</span>}
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
