"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Search, CreditCard, DollarSign, CheckCircle, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { apiGet } from "@/lib/api";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  method: string;
  transaction_id: string;
  sender_name: string;
  sender_number: string;
  note: string;
  payment_for: string;
  status: string;
  rejection_note: string;
  created_at: string;
  enrollment?: {
    id: string;
    batch?: {
      id: string;
      name: string;
      service?: {
        id: string;
        title: string;
        teacher_id: string;
      };
    };
    student?: {
      id: string;
      user?: {
        id: string;
        full_name: string;
        email: string;
      };
    };
  };
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  PENDING: { label: "Pending", color: "bg-amber-50 text-amber-600", icon: Clock },
  APPROVED: { label: "Approved", color: "bg-green-50 text-green-600", icon: CheckCircle },
  REJECTED: { label: "Rejected", color: "bg-red-50 text-red-600", icon: XCircle },
};

const methodLabels: Record<string, string> = {
  BKASH: "bKash",
  NAGAD: "Nagad",
  ROCKET: "Rocket",
  BANK_TRANSFER: "Bank Transfer",
  CASH: "Cash",
  OTHER: "Other",
};

export function AdminPaymentsContent() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, total_pages: 0 });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0, totalCollected: 0 });

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: "20" });
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      if (methodFilter) params.set("method", methodFilter);

      const [paymentsRes, statsRes] = await Promise.all([
        apiGet<{ success: boolean; data: Payment[]; meta: any }>(
          `/api/v1/admin/dashboard/payments?${params}`,
          { isAdmin: true }
        ),
        apiGet<{ success: boolean; data: any }>(
          "/api/v1/payment/stats",
          { isAdmin: true }
        ),
      ]);

      if (paymentsRes.success) {
        setPayments(paymentsRes.data);
        setMeta(paymentsRes.meta || { total: 0, total_pages: 0 });
      } else {
        toast.error("Failed to load payments");
      }

      if (statsRes.success && statsRes.data) {
        setStats({
          total: statsRes.data.total_payments || 0,
          pending: statsRes.data.pending || 0,
          approved: statsRes.data.approved || 0,
          rejected: statsRes.data.rejected || 0,
          totalCollected: statsRes.data.total_collected || 0,
        });
      }
    } catch {
      toast.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, methodFilter]);

  useEffect(() => { load(page); }, [page, load]);

  const handleSearch = () => {
    setPage(1);
    load(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Payments</h1>
        <p className="mt-1 text-sm text-gray-500">Track and manage all payment records</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border border-gray-100 dark:border-gray-800 rounded-[20px]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center">
                <CreditCard className="size-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-100 dark:border-gray-800 rounded-[20px]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center">
                <Clock className="size-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
                <p className="text-xs text-gray-500">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-100 dark:border-gray-800 rounded-[20px]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-green-50 dark:bg-green-950/50 flex items-center justify-center">
                <CheckCircle className="size-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.approved}</p>
                <p className="text-xs text-gray-500">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-100 dark:border-gray-800 rounded-[20px]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center">
                <DollarSign className="size-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCollected.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Collected</p>
              </div>
            </div>
          </CardContent>
        </Card>
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
                  placeholder="Search by name, transaction ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <select
              value={methodFilter}
              onChange={(e) => { setMethodFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Methods</option>
              {Object.entries(methodLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <Button variant="outline" size="sm" className="rounded-xl" onClick={handleSearch}>
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payments List */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="border border-gray-100 dark:border-gray-800 rounded-[16px]">
              <CardContent className="p-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-40 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div className="h-2 w-24 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  </div>
                  <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : payments.length === 0 ? (
        <Card className="border border-gray-100 dark:border-gray-800 rounded-[24px]">
          <CardContent className="p-16 text-center">
            <CreditCard className="size-12 text-gray-300 dark:text-gray-600 mx-auto" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No payments found</h3>
            <p className="mt-2 text-sm text-gray-500">No payment records match your filters.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {payments.map((p) => {
            const status = statusConfig[p.status] || statusConfig.PENDING;
            const StatusIcon = status.icon;
            return (
              <Card key={p.id} className="border border-gray-100 dark:border-gray-800 rounded-[16px] hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {p.enrollment?.student?.user?.full_name || "Unknown Student"}
                        </h3>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${status.color}`}>
                          <StatusIcon className="size-3" />
                          {status.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {p.enrollment?.batch?.service?.title || "Service"} &middot; {p.enrollment?.batch?.name || "Batch"}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-xs text-gray-400">
                          {methodLabels[p.method] || p.method} &middot; {p.transaction_id || "N/A"}
                        </span>
                        {p.sender_name && (
                          <span className="text-xs text-gray-400">from {p.sender_name}</span>
                        )}
                        <span className="text-xs text-gray-400">
                          {new Date(p.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {p.currency} {p.amount.toLocaleString()}
                      </p>
                      {p.rejection_note && (
                        <p className="text-xs text-red-500 mt-0.5 max-w-[200px] truncate">{p.rejection_note}</p>
                      )}
                    </div>
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
