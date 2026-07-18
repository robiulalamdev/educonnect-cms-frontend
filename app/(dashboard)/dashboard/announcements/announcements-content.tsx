"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "@/lib/contexts/user-context";
import { getAnnouncementList } from "@/lib/actions/modules";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Megaphone, AlertCircle } from "lucide-react";

interface Announcement {
  id: string; title: string; content: string;
  priority?: string; created_at: string;
  batch?: { name: string };
}

const priorityColors: Record<string, string> = {
  HIGH: "bg-red-50 text-red-600 border-red-200",
  MEDIUM: "bg-amber-50 text-amber-600 border-amber-200",
  LOW: "bg-blue-50 text-blue-600 border-blue-200",
  NORMAL: "bg-gray-50 text-gray-500 border-gray-200",
};

export function AnnouncementsContent() {
  const user = useUser();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, total_pages: 0 });

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = (await getAnnouncementList(p, 20)) as any;
      if (res.success) { setAnnouncements(res.data); setMeta(res.meta); }
    } catch { }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(page); }, [page, load]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Announcements</h1>
        <p className="mt-1 text-sm text-gray-500">Important updates from your batches</p>
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
      ) : announcements.length === 0 ? (
        <Card className="border border-gray-100 dark:border-gray-800 rounded-[24px]">
          <CardContent className="p-16 text-center">
            <Megaphone className="size-12 text-gray-300 dark:text-gray-600 mx-auto" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No announcements</h3>
            <p className="mt-2 text-sm text-gray-500">No announcements have been posted yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => (
            <Card key={a.id} className={`border rounded-[20px] hover:shadow-sm transition-shadow ${priorityColors[a.priority || "NORMAL"] || "border-gray-100 dark:border-gray-800"}`}>
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-white dark:bg-gray-800/50 shrink-0">
                    <Megaphone className="size-5 text-[#0066FF]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-[15px] font-semibold text-gray-900 dark:text-white">{a.title}</h3>
                      {a.priority && a.priority !== "NORMAL" && (
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${priorityColors[a.priority] || ""}`}>
                          {a.priority}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{a.content?.replace(/<[^>]*>/g, "").slice(0, 200)}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      {a.batch?.name && <span>📁 {a.batch.name}</span>}
                      <span>{new Date(a.created_at).toLocaleDateString()}</span>
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
