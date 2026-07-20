"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronLeft, ChevronRight, Search, X, Users, GraduationCap,
  MoreVertical, Pencil, Calendar, BookOpen, Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { getAdminBatches } from "@/lib/actions/admin";

interface Batch {
  id: string;
  name: string;
  description?: string;
  status: string;
  max_students: number;
  enrolled_count: number;
  start_date?: string;
  end_date?: string;
  created_at: string;
  service?: { title: string; teacher?: { full_name: string } };
  schedule?: { day: string; start_time: string; end_time: string }[];
}

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  UPCOMING: { label: "Upcoming", color: "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400", dot: "bg-blue-500" },
  ONGOING: { label: "Ongoing", color: "bg-green-50 text-green-600 dark:bg-green-950/50 dark:text-green-400", dot: "bg-green-500" },
  COMPLETED: { label: "Completed", color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400", dot: "bg-gray-400" },
  CANCELLED: { label: "Cancelled", color: "bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400", dot: "bg-red-500" },
};

export function AdminClassRoomContent() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [meta, setMeta] = useState({ total: 0, total_pages: 0 });
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: String(limit) });
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      const res = await getAdminBatches(params.toString());
      if (res.success) {
        setBatches(res.data);
        setMeta(res.meta || { total: 0, total_pages: 0 });
      } else {
        toast.error(res.error || "Failed to load classes");
      }
    } catch {} finally {
      setLoading(false);
    }
  }, [search, statusFilter, limit]);

  useEffect(() => { load(page); }, [page, load]);

  const handleSearchInput = (value: string) => {
    setSearchInput(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => { setSearch(value); setPage(1); }, 400);
  };

  const startIdx = (page - 1) * limit + 1;
  const endIdx = Math.min(page * limit, meta.total);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900 dark:text-white">Class Room</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">Manage all classes and batches</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by class name, teacher..."
              value={searchInput}
              onChange={(e) => handleSearchInput(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 text-[13px] rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-700 placeholder:text-gray-400"
            />
            {searchInput && (
              <button onClick={() => handleSearchInput("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="size-4" />
              </button>
            )}
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-4 py-2.5 text-[13px] font-medium rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[130px]"
          >
            <option value="">All Status</option>
            <option value="UPCOMING">Upcoming</option>
            <option value="ONGOING">Ongoing</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5">Class</th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5">Service</th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5">Teacher</th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5">Students</th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5">Status</th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5">Schedule</th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50 dark:border-gray-800/50">
                    <td colSpan={7} className="px-6 py-4">
                      <div className="flex items-center gap-3 animate-pulse">
                        <div className="size-10 rounded-xl bg-gray-200 dark:bg-gray-700" />
                        <div className="space-y-1.5">
                          <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded-full" />
                          <div className="h-2.5 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : batches.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <GraduationCap className="size-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-[13px] font-medium text-gray-500">No classes found</p>
                  </td>
                </tr>
              ) : (
                batches.map((b) => {
                  const status = statusConfig[b.status] || statusConfig.UPCOMING;
                  const scheduleStr = b.schedule?.length
                    ? b.schedule.map((s) => `${s.day.slice(0, 3)} ${s.start_time?.slice(0, 5) || ""}`).join(", ")
                    : "—";
                  return (
                    <tr key={b.id} className="border-b border-gray-50 dark:border-gray-800/50 last:border-b-0 hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center shrink-0">
                            <BookOpen className="size-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-[13px] font-semibold text-gray-900 dark:text-white">{b.name}</p>
                            <p className="text-[11px] text-gray-400">ID: {b.id.slice(-8).toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[13px] text-gray-700 dark:text-gray-300">{b.service?.title || "—"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[13px] text-gray-700 dark:text-gray-300">{b.service?.teacher?.full_name || "—"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Users className="size-4 text-gray-400" />
                          <span className="text-[13px] font-medium text-gray-700 dark:text-gray-300">
                            {b.enrolled_count}/{b.max_students}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`size-2 rounded-full ${status.dot}`} />
                          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[12px] text-gray-500 max-w-[180px] truncate">{scheduleStr}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <button className="size-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors" title="Edit">
                            <Pencil className="size-4" />
                          </button>
                          <button className="size-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <MoreVertical className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {meta.total > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-[12px] text-gray-500">
            Showing <span className="font-semibold text-gray-700 dark:text-gray-300">{startIdx}</span> to <span className="font-semibold text-gray-700 dark:text-gray-300">{endIdx}</span> of <span className="font-semibold text-gray-700 dark:text-gray-300">{meta.total}</span> classes
          </p>
          <div className="flex items-center gap-3">
            <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} className="px-3 py-1.5 text-[12px] font-medium rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {[10, 20, 50].map((s) => <option key={s} value={s}>{s} per page</option>)}
            </select>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="size-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 transition-colors"><ChevronLeft className="size-4" /></button>
              {Array.from({ length: Math.min(5, meta.total_pages) }, (_, i) => {
                let n: number;
                if (meta.total_pages <= 5) n = i + 1;
                else if (page <= 3) n = i + 1;
                else if (page >= meta.total_pages - 2) n = meta.total_pages - 4 + i;
                else n = page - 2 + i;
                return <button key={n} onClick={() => setPage(n)} className={`size-8 rounded-lg text-[13px] font-semibold transition-colors ${page === n ? "bg-blue-600 text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}`}>{n}</button>;
              })}
              <button onClick={() => setPage((p) => Math.min(meta.total_pages, p + 1))} disabled={page === meta.total_pages} className="size-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 transition-colors"><ChevronRight className="size-4" /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
