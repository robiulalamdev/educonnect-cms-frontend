"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2, Search } from "lucide-react";
import { getAdminBatches } from "@/lib/actions/admin";

interface Batch {
  id: string;
  name: string;
  status: string;
  max_students: number;
  enrolled_count: number;
  start_date: string;
  end_date: string;
  service?: { title: string };
  teacher?: { full_name: string };
}

export function AdminBatchesContent() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, total_pages: 0 });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: "20" });
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      const res = await getAdminBatches(params.toString());
      if (res.success) {
        setBatches(res.data || []);
        setMeta(res.meta || { total: 0, total_pages: 0 });
      }
    } catch {} finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => { load(page); }, [page, load]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Batches</h1>
        <p className="text-muted-foreground text-sm">Manage all batches across the platform</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            placeholder="Search batches..."
            className="w-full rounded-lg border bg-background pl-9 pr-3 py-2 text-sm"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select
          className="rounded-lg border bg-background px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Status</option>
          <option value="UPCOMING">Upcoming</option>
          <option value="ONGOING">Ongoing</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="size-6 animate-spin" /></div>
          ) : batches.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">No batches found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium">Name</th>
                    <th className="px-4 py-3 text-left font-medium">Service</th>
                    <th className="px-4 py-3 text-left font-medium">Teacher</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-left font-medium">Students</th>
                    <th className="px-4 py-3 text-left font-medium">Start</th>
                    <th className="px-4 py-3 text-left font-medium">End</th>
                  </tr>
                </thead>
                <tbody>
                  {batches.map((b) => (
                    <tr key={b.id} className="border-b last:border-0">
                      <td className="px-4 py-3 font-medium">{b.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{(b as any).service?.title || "-"}</td>
                      <td className="px-4 py-3">{(b as any).teacher?.full_name || "-"}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          b.status === "ONGOING" ? "bg-green-100 text-green-700" :
                          b.status === "UPCOMING" ? "bg-blue-100 text-blue-700" :
                          b.status === "COMPLETED" ? "bg-gray-100 text-gray-700" :
                          "bg-red-100 text-red-700"
                        }`}>{b.status}</span>
                      </td>
                      <td className="px-4 py-3">{b.enrolled_count}/{b.max_students}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {b.start_date ? new Date(b.start_date).toLocaleDateString() : "-"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {b.end_date ? new Date(b.end_date).toLocaleDateString() : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {meta.total_pages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Page {page} of {meta.total_pages} ({meta.total} total)
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              <ChevronLeft className="size-4" />
            </Button>
            <Button variant="outline" size="sm" disabled={page >= meta.total_pages} onClick={() => setPage(page + 1)}>
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
