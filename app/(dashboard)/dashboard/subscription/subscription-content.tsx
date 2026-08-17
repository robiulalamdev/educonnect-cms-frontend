"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Crown, Star, Loader2, Zap, Shield, BarChart3 } from "lucide-react";
import { getSubscriptionPackages, getMySubscription, subscribeToPackage } from "@/lib/actions/modules";
import { toast } from "sonner";

export function SubscriptionContent() {
  const [packages, setPackages] = useState<any[]>([]);
  const [currentSub, setCurrentSub] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<"MONTHLY" | "QUARTERLY" | "YEARLY">("MONTHLY");

  useEffect(() => {
    Promise.all([
      getSubscriptionPackages().catch(() => ({ success: false, data: [] })),
      getMySubscription().catch(() => ({ success: false, data: null })),
    ]).then(([pkgs, sub]) => {
      if (pkgs.success) setPackages(pkgs.data);
      if (sub.success && sub.data) setCurrentSub(sub.data);
    }).finally(() => setLoading(false));
  }, []);

  const handleSubscribe = async (packageId: string) => {
    setSubscribing(packageId);
    try {
      const res = await subscribeToPackage(packageId);
      if (res.success) {
        toast.success("Subscription activated!");
        const sub = await getMySubscription();
        if (sub.success) setCurrentSub(sub.data);
      } else {
        toast.error(res.message || "Failed to subscribe");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to subscribe");
    } finally {
      setSubscribing(null);
    }
  };

  const getPrice = (pkg: any) => {
    switch (billingCycle) {
      case "MONTHLY": return pkg.price_monthly;
      case "QUARTERLY": return pkg.price_quarterly;
      case "YEARLY": return pkg.price_yearly;
      default: return pkg.price_monthly;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-[#0066FF]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[22px] font-bold text-gray-900 dark:text-white">Subscription</h1>
        <p className="text-[13px] text-gray-500 mt-0.5">Manage your subscription plan and unlock premium features.</p>
      </div>

      {/* Current Subscription */}
      {currentSub && (
        <Card className="border border-green-200/80 dark:border-green-800/80 bg-green-50/50 dark:bg-green-950/20 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/50">
                  <Crown className="size-5 text-green-600" />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-gray-900 dark:text-white">
                    {currentSub.package?.name || "Pro"} Plan
                  </p>
                  <p className="text-[12px] text-gray-500">
                    {currentSub.billing_cycle} billing
                    {currentSub.expires_at && ` · Expires ${new Date(currentSub.expires_at).toLocaleDateString()}`}
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400 px-2.5 py-0.5 text-[11px] font-semibold border-0">
                Active
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Billing Toggle */}
      <div className="flex justify-center">
        <div className="flex gap-0.5 p-0.5 bg-white dark:bg-[#16161D] rounded-full border border-gray-200/80 dark:border-gray-800/80">
          {(["MONTHLY", "QUARTERLY", "YEARLY"] as const).map((cycle) => (
            <button
              key={cycle}
              onClick={() => setBillingCycle(cycle)}
              className={`px-5 py-2 rounded-full text-[13px] font-semibold transition-all ${
                billingCycle === cycle
                  ? "bg-[#0066FF] text-white shadow-md shadow-blue-500/20"
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {cycle.charAt(0) + cycle.slice(1).toLowerCase()}
              {cycle === "YEARLY" && <span className="ml-1 text-[10px] text-green-400">Save 20%</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Package Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => {
          const price = getPrice(pkg);
          const isCurrent = currentSub?.package_id === pkg.id;
          const features = pkg.features?.filter((f: any) => f.is_included) || [];

          return (
            <Card
              key={pkg.id}
              className={`relative rounded-2xl transition-all ${
                pkg.is_featured
                  ? "border-2 border-[#0066FF] shadow-lg shadow-blue-500/10"
                  : "border border-gray-200/80 dark:border-gray-800/80"
              } ${isCurrent ? "ring-2 ring-green-500/30" : ""}`}
            >
              {pkg.badge_label && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#0066FF] px-3 py-1 text-[11px] font-bold text-white shadow-md">
                    <Star className="size-3" />
                    {pkg.badge_label}
                  </span>
                </div>
              )}
              <CardContent className={`p-6 ${pkg.badge_label ? "pt-8" : ""}`}>
                <div className="text-center mb-6">
                  <h3 className="text-[18px] font-bold text-gray-900 dark:text-white">{pkg.name}</h3>
                  <p className="text-[12px] text-gray-500 mt-1 line-clamp-2">{pkg.description}</p>
                  <div className="mt-4">
                    {price ? (
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-[32px] font-bold text-gray-900 dark:text-white">৳{Number(price).toLocaleString()}</span>
                        <span className="text-[13px] text-gray-400">/{billingCycle === "MONTHLY" ? "mo" : billingCycle === "QUARTERLY" ? "3mo" : "yr"}</span>
                      </div>
                    ) : (
                      <span className="text-[32px] font-bold text-gray-900 dark:text-white">Free</span>
                    )}
                  </div>
                </div>

                {/* Limits */}
                <div className="space-y-2 mb-6 text-[13px]">
                  <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                    <span>Active Services</span>
                    <span className="font-bold text-gray-900 dark:text-white">{pkg.max_services}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                    <span>Batches per Service</span>
                    <span className="font-bold text-gray-900 dark:text-white">{pkg.max_batches_per_service}</span>
                  </div>
                  {pkg.max_students_per_batch && (
                    <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                      <span>Students per Batch</span>
                      <span className="font-bold text-gray-900 dark:text-white">{pkg.max_students_per_batch}</span>
                    </div>
                  )}
                </div>

                {/* Features */}
                {features.length > 0 && (
                  <div className="space-y-2.5 mb-6">
                    {features.map((f: any) => (
                      <div key={f.id} className="flex items-center gap-2.5 text-[13px] text-gray-600 dark:text-gray-400">
                        <Check className="size-4 text-[#0066FF] shrink-0" />
                        <span>{f.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* CTA */}
                {isCurrent ? (
                  <Button disabled className="w-full h-11 rounded-xl bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400 font-semibold border-0">
                    Current Plan
                  </Button>
                ) : price ? (
                  <Button
                    onClick={() => handleSubscribe(pkg.id)}
                    disabled={subscribing === pkg.id}
                    className={`w-full h-11 rounded-xl font-semibold shadow-lg ${
                      pkg.is_featured
                        ? "bg-[#0066FF] hover:bg-[#0052CC] text-white shadow-blue-500/20"
                        : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
                    }`}
                  >
                    {subscribing === pkg.id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      "Subscribe Now"
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleSubscribe(pkg.id)}
                    disabled={subscribing === pkg.id}
                    variant="outline"
                    className="w-full h-11 rounded-xl font-semibold"
                  >
                    {subscribing === pkg.id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      "Get Started Free"
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {packages.length === 0 && (
        <div className="text-center py-16">
          <Crown className="size-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-[15px] font-bold text-gray-900 dark:text-white">No plans available</p>
          <p className="text-[13px] text-gray-500 mt-1">Check back later for subscription options.</p>
        </div>
      )}
    </div>
  );
}
