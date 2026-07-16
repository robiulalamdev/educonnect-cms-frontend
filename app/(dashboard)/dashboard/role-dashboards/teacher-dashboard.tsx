"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, DollarSign, Star, TrendingUp, Calendar, FileText } from "lucide-react";
import Link from "next/link";

export function TeacherDashboard() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Link href="/dashboard/services">
        <StatCard icon={BookOpen} iconColor="blue" title="My Services" value="0" change="+0 this month" />
      </Link>
      <Link href="/dashboard/posts">
        <StatCard icon={FileText} iconColor="purple" title="Posts" value="0" change="+0 this week" />
      </Link>
      <Link href="/dashboard/enrollments">
        <StatCard icon={Users} iconColor="green" title="Students" value="0" change="Active enrollments" />
      </Link>
      <Link href="/dashboard/enrollments">
        <StatCard icon={DollarSign} iconColor="yellow" title="Revenue" value="$0" change="This month" />
      </Link>
    </div>
  );
}

function StatCard({ icon: Icon, iconColor, title, value, change }: {
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  title: string;
  value: string;
  change: string;
}) {
  const colorMap: Record<string, string> = {
    blue: "bg-[#EFF6FF] dark:bg-blue-950/50 text-[#2563EB] dark:text-blue-400",
    green: "bg-[#F0FDF4] dark:bg-green-950/50 text-[#22C55E] dark:text-green-400",
    yellow: "bg-[#FFFBEB] dark:bg-yellow-950/50 text-[#F59E0B] dark:text-yellow-400",
    purple: "bg-[#FAF5FF] dark:bg-purple-950/50 text-[#9333EA] dark:text-purple-400",
  };
  return (
    <Card className="border border-[#E5E7EB] dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 rounded-[20px] cursor-pointer group">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[13px] font-medium text-[#6B7280] dark:text-gray-400">{title}</p>
            <p className="mt-1 text-2xl font-bold text-[#111827] dark:text-white">{value}</p>
            <p className="mt-1 text-[12px] text-[#9CA3AF]">{change}</p>
          </div>
          <div className={`flex size-10 items-center justify-center rounded-xl ${colorMap[iconColor]} group-hover:scale-110 transition-transform`}>
            <Icon className="size-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
