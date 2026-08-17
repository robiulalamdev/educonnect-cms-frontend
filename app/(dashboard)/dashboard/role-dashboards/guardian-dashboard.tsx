"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/charts/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, CreditCard, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface ChildInfo {
  id: string;
  name: string;
  enrollments: number;
  attendance_pct: number;
  recent_tasks: number;
}

interface GuardianStats {
  total_children: number;
  total_enrollments: number;
  total_payments: number;
  children: ChildInfo[];
}

import { getGuardianStats } from "@/lib/actions/dashboard";

export function GuardianDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await getGuardianStats();
        if (res.success) setStats(res.data);
      } catch {
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/dashboard/enrollments">
          <StatCard icon={Users} color="blue" label="Children" value={stats?.total_children ?? 0} />
        </Link>
        <Link href="/dashboard/enrollments">
          <StatCard icon={BookOpen} color="green" label="Enrollments" value={stats?.total_enrollments ?? 0} />
        </Link>
        <Link href="/dashboard/payments">
          <StatCard icon={CreditCard} color="yellow" label="Payments" value={`৳${stats?.total_payments ?? 0}`} />
        </Link>
      </div>

      {/* Children Overview */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border border-gray-200/80 dark:border-gray-800/80 rounded-[24px] bg-white dark:bg-[#16161D]">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">My Children</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.children && stats.children.length > 0 ? (
              <div className="space-y-3">
                {stats.children.map((child: ChildInfo) => (
                  <div key={child.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 font-bold text-sm">
                      {child.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{child.name}</p>
                      <p className="text-xs text-gray-500">{child.enrollments} enrollments | {child.attendance_pct}% attendance</p>
                    </div>
                    <span className="text-xs text-gray-400">{child.recent_tasks} tasks</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="size-10 text-gray-300 dark:text-gray-600 mx-auto" />
                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">No linked students</p>
                <p className="mt-1 text-xs text-gray-400">Link your child to see their progress</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border border-gray-200/80 dark:border-gray-800/80 rounded-[24px] bg-white dark:bg-[#16161D]">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No events to display</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
