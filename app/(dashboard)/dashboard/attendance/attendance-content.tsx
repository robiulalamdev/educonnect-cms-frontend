"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "@/lib/contexts/user-context";
import { getAttendanceList, markAttendance, bulkMarkAttendance } from "@/lib/actions/modules";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2, CheckCircle, XCircle, Clock, Users } from "lucide-react";
import { toast } from "sonner";

interface AttendanceRecord {
  id: string; status: string; date: string; marked_at: string;
  student?: { user?: { full_name: string } };
  batch?: { name: string };
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  PRESENT: { label: "Present", color: "bg-green-50 text-green-600", icon: CheckCircle },
  ABSENT: { label: "Absent", color: "bg-red-50 text-red-500", icon: XCircle },
  LATE: { label: "Late", color: "bg-amber-50 text-amber-600", icon: Clock },
  EXCUSED: { label: "Excused", color: "bg-blue-50 text-blue-600", icon: CheckCircle },
};

export function AttendanceContent() {
  const user = useUser();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, total_pages: 0 });

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = (await getAttendanceList(p, 20)) as any;
      if (res.success) { setRecords(res.data); setMeta(res.meta); }
    } catch { }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(page); }, [page, load]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Attendance</h1>
        <p className="mt-1 text-sm text-gray-500">
          {user?.role === "TEACHER" ? "Mark and manage class attendance" : "View your attendance history"}
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="border border-gray-100 dark:border-gray-800 rounded-[20px]">
              <CardContent className="p-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-gray-200 dark:bg-gray-700" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-40 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div className="h-2 w-24 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : records.length === 0 ? (
        <Card className="border border-gray-100 dark:border-gray-800 rounded-[24px]">
          <CardContent className="p-16 text-center">
            <Users className="size-12 text-gray-300 dark:text-gray-600 mx-auto" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No attendance records</h3>
            <p className="mt-2 text-sm text-gray-500">
              {user?.role === "TEACHER" ? "Mark attendance from your batch." : "No attendance data yet."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {records.map((r) => {
            const config = statusConfig[r.status] || statusConfig.PRESENT;
            const Icon = config.icon;
            return (
              <Card key={r.id} className="border border-gray-100 dark:border-gray-800 rounded-[16px] hover:shadow-sm transition-shadow">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`flex size-10 items-center justify-center rounded-xl ${config.color}`}>
                    <Icon className="size-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{r.student?.user?.full_name || "Student"}</p>
                    <p className="text-xs text-gray-500">{r.batch?.name || ""} &middot; {new Date(r.date).toLocaleDateString()}</p>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${config.color}`}>{config.label}</span>
                </CardContent>
              </Card>
            );
          })}
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
