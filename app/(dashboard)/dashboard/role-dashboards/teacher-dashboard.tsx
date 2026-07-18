"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/charts/stat-card";
import { EnrollmentChart } from "@/components/charts/enrollment-chart";
import { RevenueChart } from "@/components/charts/revenue-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, DollarSign, GraduationCap, FileText, MessageCircle, Calendar } from "lucide-react";
import Link from "next/link";

interface TeacherStats {
  total_services: number;
  total_students: number;
  total_revenue: number;
  active_batches: number;
  enrollment_trend: Array<{ month: string; enrollments: number }>;
  revenue_trend: Array<{ month: string; revenue: number }>;
}

export function TeacherDashboard() {
  const [stats, setStats] = useState<TeacherStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/v1/statistics/teacher", { credentials: "include" });
        const data = await res.json();
        if (data.success) setStats(data.data);
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard/services">
          <StatCard icon={BookOpen} color="blue" label="Total Services" value={stats?.total_services ?? 0} />
        </Link>
        <Link href="/dashboard/enrollments">
          <StatCard icon={Users} color="green" label="Total Students" value={stats?.total_students ?? 0} />
        </Link>
        <Link href="/dashboard/enrollments">
          <StatCard icon={DollarSign} color="yellow" label="Revenue" value={`$${stats?.total_revenue ?? 0}`} />
        </Link>
        <Link href="/dashboard/batches">
          <StatCard icon={GraduationCap} color="purple" label="Active Batches" value={stats?.active_batches ?? 0} />
        </Link>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <EnrollmentChart data={stats?.enrollment_trend ?? []} />
        <RevenueChart data={stats?.revenue_trend ?? []} />
      </div>

      {/* Quick Actions + Recent */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border border-gray-200/80 dark:border-gray-800/80 rounded-[24px] bg-white dark:bg-[#16161D]">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: "Create Service", icon: BookOpen, href: "/dashboard/services", color: "bg-blue-50 text-blue-600" },
              { label: "Create Post", icon: FileText, href: "/dashboard/posts/new", color: "bg-purple-50 text-purple-600" },
              { label: "View Messages", icon: MessageCircle, href: "/dashboard/messages", color: "bg-green-50 text-green-600" },
            ].map((action) => (
              <Link key={action.label} href={action.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className={`flex size-9 items-center justify-center rounded-lg ${action.color}`}>
                  <action.icon className="size-4" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{action.label}</span>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border border-gray-200/80 dark:border-gray-800/80 rounded-[24px] bg-white dark:bg-[#16161D]">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">Upcoming Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Calendar className="size-10 text-gray-300 dark:text-gray-600 mx-auto" />
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">No upcoming classes scheduled</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
