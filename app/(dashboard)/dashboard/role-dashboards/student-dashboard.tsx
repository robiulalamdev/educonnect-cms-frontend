"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/charts/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, CheckCircle, Percent, Calendar, Clock, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface StudentStats {
  enrolled_batches: number;
  completed_tasks: number;
  attendance_pct: number;
  upcoming_classes: Array<{ id: string; batch_name: string; date: string; time: string }>;
}

import { getStudentStats } from "@/lib/actions/dashboard";
import { getMyStudentEnrollments } from "@/lib/actions/enrollment";

export function StudentDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await getStudentStats();
        if (res.success) setStats(res.data);
      } catch {
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    getMyStudentEnrollments(1, 10).then((res: any) => {
      if (res.success && res.data) setEnrollments(res.data);
    }).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/dashboard/enrollments">
          <StatCard icon={GraduationCap} color="blue" label="Enrolled Batches" value={stats?.enrolled_batches ?? 0} />
        </Link>
        <Link href="/dashboard/tasks">
          <StatCard icon={CheckCircle} color="green" label="Completed Tasks" value={stats?.completed_tasks ?? 0} />
        </Link>
        <Link href="/dashboard/attendance">
          <StatCard icon={Percent} color="yellow" label="Attendance %" value={`${stats?.attendance_pct ?? 0}%`} />
        </Link>
      </div>

      {/* Upcoming Classes */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border border-gray-200/80 dark:border-gray-800/80 rounded-[24px] bg-white dark:bg-[#16161D]">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">Upcoming Classes</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.upcoming_classes && stats.upcoming_classes.length > 0 ? (
              <div className="space-y-3">
                {stats.upcoming_classes.map((cls: { id: string; batch_name: string; date: string; time: string }) => (
                  <div key={cls.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600">
                      <Calendar className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{cls.batch_name}</p>
                      <p className="text-xs text-gray-500">{cls.date} at {cls.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="size-10 text-gray-300 dark:text-gray-600 mx-auto" />
                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">No upcoming classes</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border border-gray-200/80 dark:border-gray-800/80 rounded-[24px] bg-white dark:bg-[#16161D]">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">My Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            {enrollments.length > 0 ? (
              <div className="space-y-3">
                {enrollments.map((enrollment: any) => (
                  <div key={enrollment.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600">
                      <GraduationCap className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{enrollment.batch?.name || enrollment.service?.name || "Enrollment"}</p>
                      <p className="text-xs text-gray-500">{enrollment.status || "Active"}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <GraduationCap className="size-10 text-gray-300 dark:text-gray-600 mx-auto" />
                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">No active enrollments</p>
                <Link href="/feed" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#0066FF] hover:text-[#0052CC]">
                  Browse services <ArrowUpRight className="size-3" />
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border border-gray-200/80 dark:border-gray-800/80 rounded-[24px] bg-white dark:bg-[#16161D]">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Clock className="size-10 text-gray-300 dark:text-gray-600 mx-auto" />
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">No recent activity</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
