"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, CheckCircle, Clock, CreditCard, BookOpen, MessageCircle, Calendar, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function StudentDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard/enrollments">
          <StatCard icon={GraduationCap} color="blue" title="Active Enrollments" value="0" change="+0" up />
        </Link>
        <Link href="/dashboard/enrollments">
          <StatCard icon={CheckCircle} color="green" title="Completed" value="0" change="+0" up />
        </Link>
        <Link href="/dashboard/messages">
          <StatCard icon={MessageCircle} color="purple" title="Messages" value="0" change="+0" up />
        </Link>
        <Link href="/dashboard/enrollments">
          <StatCard icon={CreditCard} color="yellow" title="Pending Payments" value="$0" change="+0" up />
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border border-gray-100 dark:border-gray-800 rounded-[20px]">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">My Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <GraduationCap className="size-10 text-gray-300 dark:text-gray-600 mx-auto" />
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">No active enrollments</p>
              <Link href="/feed" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#0066FF] hover:text-[#0052CC]">
                Browse services <ArrowUpRight className="size-3" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-100 dark:border-gray-800 rounded-[20px]">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">Upcoming Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Calendar className="size-10 text-gray-300 dark:text-gray-600 mx-auto" />
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">No upcoming classes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-gray-100 dark:border-gray-800 rounded-[20px]">
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

function StatCard({ icon: Icon, color, title, value, change, up }: {
  icon: React.ComponentType<{ className?: string }>; color: string; title: string; value: string; change: string; up: boolean;
}) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400",
    green: "bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400",
    yellow: "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400",
    purple: "bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400",
  };
  return (
    <Card className="border border-gray-100 dark:border-gray-800 rounded-[20px] hover:shadow-md transition-all cursor-pointer group">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[13px] font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            <div className="mt-1 flex items-center gap-1 text-[12px]">
              <ArrowUpRight className="size-3 text-green-500" />
              <span className="text-green-500">{change}</span>
              <span className="text-gray-400">this month</span>
            </div>
          </div>
          <div className={`flex size-10 items-center justify-center rounded-xl ${colors[color]} group-hover:scale-110 transition-transform`}>
            <Icon className="size-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
