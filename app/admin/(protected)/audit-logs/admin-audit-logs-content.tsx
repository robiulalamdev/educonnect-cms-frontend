"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Search, ScrollText, Filter } from "lucide-react";
import { toast } from "sonner";
import { getAuditLogs } from "@/lib/actions/admin";

interface AuditLog {
  id: string;
  action: string;
  target_type: string;
  target_id: string;
  meta: Record<string, any>;
  created_at: string;
  admin?: { full_name: string; email: string };
}

const actionLabels: Record<string, { label: string; color: string }> = {
  USER_APPROVED: { label: "User Approved", color: "bg-green-50 text-green-600" },
  USER_SUSPENDED: { label: "User Suspended", color: "bg-amber-50 text-amber-600" },
  USER_BANNED: { label: "User Banned", color: "bg-red-50 text-red-600" },
  POST_REMOVED: { label: "Post Removed", color: "bg-red-50 text-red-600" },
  REVIEW_HIDDEN: { label: "Review Hidden", color: "bg-amber-50 text-amber-600" },
  SERVICE_CLOSED: { label: "Service Closed", color: "bg-gray-50 text-gray-600" },
  ADMIN_CREATED: { label: "Admin Created", color: "bg-blue-50 text-blue-600" },
  ADMIN_ROLE_CHANGED: { label: "Role Changed", color: "bg-purple-50 text-purple-600" },
  PACKAGE_CREATED: { label: "Package Created", color: "bg-blue-50 text-blue-600" },
  PACKAGE_UPDATED: { label: "Package Updated", color: "bg-blue-50 text-blue-600" },
  PACKAGE_ARCHIVED: { label: "Package Archived", color: "bg-gray-50 text-gray-600" },
  SUBSCRIPTION_GRANTED: { label: "Subscription Granted", color: "bg-green-50 text-green-600" },
  SUBSCRIPTION_REVOKED: { label: "Subscription Revoked", color: "bg-red-50 text-red-600" },
};

export function AdminAuditLogsContent() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, total_pages: 0 });
  const [actionFilter, setActionFilter] = useState("");
  const [targetFilter, setTargetFilter] = useState("");

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: "20" });
      if (actionFilter) params.set("action", actionFilter);
      if (targetFilter) params.set("target_type", targetFilter);

      const res = await getAuditLogs(params.toString());
      if (res.success) {
        setLogs(res.data);
        setMeta(res.meta || { total: 0, total_pages: 0 });
      } else {
        toast.error(res.error || "Failed to load audit logs");
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }, [actionFilter, targetFilter]);

  useEffect(() => { load(page); }, [page, load]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Audit Logs</h1>
        <p className="mt-1 text-sm text-gray-500">Track all administrative actions</p>
      </div>

      {/* Filters */}
      <Card className="border border-gray-100 dark:border-gray-800 rounded-[20px]">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <select
              value={actionFilter}
              onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Actions</option>
              {Object.entries(actionLabels).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <select
              value={targetFilter}
              onChange={(e) => { setTargetFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Targets</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="post">Post</option>
              <option value="review">Review</option>
              <option value="service">Service</option>
              <option value="package">Package</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Logs List */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="border border-gray-100 dark:border-gray-800 rounded-[16px]">
              <CardContent className="p-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-40 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div className="h-2 w-24 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : logs.length === 0 ? (
        <Card className="border border-gray-100 dark:border-gray-800 rounded-[24px]">
          <CardContent className="p-16 text-center">
            <ScrollText className="size-12 text-gray-300 dark:text-gray-600 mx-auto" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No audit logs found</h3>
            <p className="mt-2 text-sm text-gray-500">No actions have been recorded yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-1">
          {logs.map((log) => {
            const action = actionLabels[log.action] || { label: log.action, color: "bg-gray-50 text-gray-600" };
            return (
              <Card key={log.id} className="border border-gray-100 dark:border-gray-800 rounded-[12px] hover:shadow-sm transition-shadow">
                <CardContent className="px-4 py-3 flex items-center gap-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold shrink-0 ${action.color}`}>
                    {action.label}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium text-gray-900 dark:text-white">{log.admin?.full_name || "System"}</span>
                      {" "}&middot; {log.target_type}
                      {log.meta?.full_name ? ` — ${log.meta.full_name}` : log.meta?.action ? ` (${log.meta.action})` : ""}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">
                    {new Date(log.created_at).toLocaleString()}
                  </span>
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
