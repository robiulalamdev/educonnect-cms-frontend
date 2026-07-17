"use client";

import { useEffect, useState, useCallback } from "react";
import { getMyPaymentHistory } from "@/lib/actions/payments";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  method: string;
  transaction_id: string | null;
  payment_for: string | null;
  status: string;
  created_at: string;
  enrollment?: {
    batch?: {
      name: string;
      service?: { title: string };
    };
  };
}

const statusConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  APPROVED: {
    color: "bg-green-50 text-green-600",
    icon: <CheckCircle className="size-3.5" />,
    label: "Approved",
  },
  PENDING: {
    color: "bg-amber-50 text-amber-600",
    icon: <Clock className="size-3.5" />,
    label: "Pending",
  },
  REJECTED: {
    color: "bg-red-50 text-red-500",
    icon: <XCircle className="size-3.5" />,
    label: "Rejected",
  },
};

export function PaymentsContent() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, total_pages: 0 });

  const load = useCallback(
    async (p: number) => {
      setLoading(true);
      try {
        const res = (await getMyPaymentHistory(p, 10)) as any;
        if (res.success) {
          setPayments(res.data);
          setMeta(res.meta);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    load(page);
  }, [page, load]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Payment History
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          View your payment records and transaction history
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card
              key={i}
              className="border border-gray-100 dark:border-gray-800 rounded-[20px]"
            >
              <CardContent className="p-6 animate-pulse">
                <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded-full mb-3" />
                <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : payments.length === 0 ? (
        <Card className="border border-gray-100 dark:border-gray-800 rounded-[24px]">
          <CardContent className="p-16 text-center">
            <CreditCard className="size-12 text-gray-300 dark:text-gray-600 mx-auto" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
              No payments yet
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Your payment history will appear here after you submit a payment.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {payments.map((p) => {
            const status = statusConfig[p.status] || statusConfig.PENDING;
            return (
              <Card
                key={p.id}
                className="border border-gray-100 dark:border-gray-800 rounded-[20px] hover:shadow-md transition-all"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${status.color}`}
                        >
                          {status.icon}
                          {status.label}
                        </span>
                        {p.method && (
                          <span className="text-[11px] font-medium text-gray-400 uppercase">
                            {p.method}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {p.enrollment?.batch?.service?.title || "Payment"}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {p.enrollment?.batch?.name || ""}
                        {p.payment_for ? ` - ${p.payment_for}` : ""}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-[13px] text-gray-400">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="size-3.5" />
                          {new Date(p.created_at).toLocaleDateString()}
                        </span>
                        {p.transaction_id && (
                          <span className="text-gray-400">
                            TXN: {p.transaction_id}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {p.currency} {Number(p.amount).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {meta.total_pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="text-sm text-gray-500">
            Page {page} of {meta.total_pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => setPage((p) => Math.min(meta.total_pages, p + 1))}
            disabled={page === meta.total_pages}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
