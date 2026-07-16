"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, DollarSign, TrendingUp, FileText, MessageCircle, Calendar, Star, ArrowUpRight, ArrowDownRight } from "lucide-react";
import Link from "next/link";

export function TeacherDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard/services">
          <StatCard icon={BookOpen} color="blue" title="Active Services" value="0" change="+0%" up />
        </Link>
        <Link href="/dashboard/enrollments">
          <StatCard icon={Users} color="green" title="Total Students" value="0" change="+0%" up />
        </Link>
        <Link href="/dashboard/enrollments">
          <StatCard icon={DollarSign} color="yellow" title="Revenue" value="$0" change="+0%" up />
        </Link>
        <Link href="/dashboard/posts">
          <StatCard icon={FileText} color="purple" title="Posts" value="0" change="+0" up />
        </Link>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border border-gray-100 dark:border-gray-800 rounded-[20px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <MiniChart data={[12, 19, 8, 15, 22, 18, 25]} color="#0066FF" />
            <div className="mt-3 flex items-center gap-2 text-sm">
              <span className="font-semibold text-gray-900 dark:text-white">$0</span>
              <span className="text-gray-500 dark:text-gray-400">this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-100 dark:border-gray-800 rounded-[20px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Student Enrollment</CardTitle>
          </CardHeader>
          <CardContent>
            <MiniChart data={[5, 8, 12, 15, 10, 18, 22]} color="#22C55E" />
            <div className="mt-3 flex items-center gap-2 text-sm">
              <span className="font-semibold text-gray-900 dark:text-white">0</span>
              <span className="text-gray-500 dark:text-gray-400">students enrolled</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions + Recent */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border border-gray-100 dark:border-gray-800 rounded-[20px]">
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

        <Card className="lg:col-span-2 border border-gray-100 dark:border-gray-800 rounded-[20px]">
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
              {up ? <ArrowUpRight className="size-3 text-green-500" /> : <ArrowDownRight className="size-3 text-red-500" />}
              <span className={up ? "text-green-500" : "text-red-500"}>{change}</span>
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

function MiniChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const h = 60;
  const w = 300;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-16" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${points} ${w},${h}`} fill={`url(#grad-${color})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
