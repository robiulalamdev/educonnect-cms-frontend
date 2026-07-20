"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, DollarSign, Package, Star } from "lucide-react";
import { toast } from "sonner";
import { getSubscriptionPackages } from "@/lib/actions/admin";

interface Package {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: string;
  price_monthly: number;
  price_quarterly: number;
  price_yearly: number;
  price_lifetime: number;
  currency: string;
  max_services: number;
  max_batches_per_service: number;
  max_students_per_batch: number;
  is_featured: boolean;
  badge_label: string | null;
  features?: { label: string; is_included: boolean }[];
}

const statusConfig: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: "Active", color: "bg-green-50 text-green-600" },
  INACTIVE: { label: "Inactive", color: "bg-gray-50 text-gray-600" },
  ARCHIVED: { label: "Archived", color: "bg-red-50 text-red-600" },
};

export function AdminSubscriptionsContent() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, total_pages: 0 });

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: "20" });
      const res = await getSubscriptionPackages(params.toString());
      if (res.success) {
        setPackages(res.data);
        setMeta(res.meta || { total: 0, total_pages: 0 });
      } else {
        toast.error(res.error || "Failed to load packages");
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(page); }, [page, load]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Subscriptions</h1>
        <p className="mt-1 text-sm text-gray-500">Manage subscription packages and pricing</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border border-gray-100 dark:border-gray-800 rounded-[20px]">
              <CardContent className="p-6 animate-pulse">
                <div className="space-y-3">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  <div className="h-3 w-40 bg-gray-200 dark:bg-gray-700 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : packages.length === 0 ? (
        <Card className="border border-gray-100 dark:border-gray-800 rounded-[24px]">
          <CardContent className="p-16 text-center">
            <Package className="size-12 text-gray-300 dark:text-gray-600 mx-auto" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No packages found</h3>
            <p className="mt-2 text-sm text-gray-500">Create subscription packages to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {packages.map((pkg) => {
            const status = statusConfig[pkg.status] || statusConfig.ACTIVE;
            return (
              <Card key={pkg.id} className={`border rounded-[20px] hover:shadow-sm transition-shadow ${pkg.is_featured ? "border-blue-200 dark:border-blue-800" : "border-gray-100 dark:border-gray-800"}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white">{pkg.name}</h3>
                      {pkg.is_featured && <Star className="size-4 fill-blue-500 text-blue-500" />}
                    </div>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  {pkg.badge_label && (
                    <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400 mb-2">
                      {pkg.badge_label}
                    </span>
                  )}
                  <p className="text-xs text-gray-500 mb-4 line-clamp-2">{pkg.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Monthly</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{pkg.currency} {pkg.price_monthly}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Quarterly</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{pkg.currency} {pkg.price_quarterly}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Yearly</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{pkg.currency} {pkg.price_yearly}</span>
                    </div>
                    {pkg.price_lifetime > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Lifetime</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{pkg.currency} {pkg.price_lifetime}</span>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-gray-100 dark:border-gray-800 pt-3 space-y-1.5">
                    <p className="text-xs font-medium text-gray-500 mb-2">Limits</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Max Services</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">{pkg.max_services}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Batches / Service</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">{pkg.max_batches_per_service}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Students / Batch</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">{pkg.max_students_per_batch}</span>
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
