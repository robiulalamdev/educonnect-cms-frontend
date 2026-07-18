"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Search, Users, Shield, ShieldCheck, ShieldX, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  full_name: string;
  email: string;
  role: string;
  status: string;
  is_email_verified: boolean;
  is_approved: boolean;
  created_at: string;
  avatar?: { url: string } | null;
}

const roleConfig: Record<string, { label: string; color: string }> = {
  TEACHER: { label: "Teacher", color: "bg-purple-50 text-purple-600" },
  STUDENT: { label: "Student", color: "bg-blue-50 text-blue-600" },
  GUARDIAN: { label: "Guardian", color: "bg-green-50 text-green-600" },
};

const statusConfig: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: "Active", color: "bg-green-50 text-green-600" },
  PENDING_VERIFICATION: { label: "Pending", color: "bg-amber-50 text-amber-600" },
  SUSPENDED: { label: "Suspended", color: "bg-red-50 text-red-600" },
  BANNED: { label: "Banned", color: "bg-red-50 text-red-600" },
};

export function AdminUsersContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, total_pages: 0 });
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: "20" });
      if (search) params.set("search", search);
      if (roleFilter) params.set("role", roleFilter);
      if (statusFilter) params.set("status", statusFilter);

      const res = await fetch(`/api/v1/admin/dashboard/users?${params}`, { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
        setMeta(data.meta);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, statusFilter]);

  useEffect(() => { load(page); }, [page, load]);

  const handleSearch = () => {
    setPage(1);
    load(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">User Management</h1>
        <p className="mt-1 text-sm text-gray-500">Manage all users in the system</p>
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
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Roles</option>
              <option value="TEACHER">Teacher</option>
              <option value="STUDENT">Student</option>
              <option value="GUARDIAN">Guardian</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING_VERIFICATION">Pending</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="BANNED">Banned</option>
            </select>
            <Button variant="outline" size="sm" className="rounded-xl" onClick={handleSearch}>
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="border border-gray-100 dark:border-gray-800 rounded-[16px]">
              <CardContent className="p-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div className="h-2 w-48 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  </div>
                  <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : users.length === 0 ? (
        <Card className="border border-gray-100 dark:border-gray-800 rounded-[24px]">
          <CardContent className="p-16 text-center">
            <Users className="size-12 text-gray-300 dark:text-gray-600 mx-auto" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No users found</h3>
            <p className="mt-2 text-sm text-gray-500">Try adjusting your search or filters.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {users.map((u) => {
            const role = roleConfig[u.role] || roleConfig.STUDENT;
            const status = statusConfig[u.status] || statusConfig.ACTIVE;
            return (
              <Card key={u.id} className="border border-gray-100 dark:border-gray-800 rounded-[16px] hover:shadow-sm transition-shadow">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="size-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    {u.avatar?.url ? (
                      <img src={u.avatar.url} alt={u.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm font-medium">
                        {u.full_name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{u.full_name}</p>
                    <p className="text-xs text-gray-500 truncate">{u.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${role.color}`}>
                      {role.label}
                    </span>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${status.color}`}>
                      {status.label}
                    </span>
                    {u.is_email_verified && (
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-green-50 text-green-600">
                        Verified
                      </span>
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
