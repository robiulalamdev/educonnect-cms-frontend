"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, BookOpen, CheckCircle, CreditCard } from "lucide-react";
import Link from "next/link";

export function GuardianDashboard() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Link href="/dashboard/enrollments">
        <StatCard icon={Users} iconColor="blue" title="Linked Students" value="0" change="Children linked" />
      </Link>
      <Link href="/dashboard/enrollments">
        <StatCard icon={BookOpen} iconColor="green" title="Active Enrollments" value="0" change="Across all students" />
      </Link>
      <Link href="/dashboard/messages">
        <StatCard icon={CheckCircle} iconColor="purple" title="Messages" value="0" change="From teachers" />
      </Link>
      <Link href="/dashboard/enrollments">
        <StatCard icon={CreditCard} iconColor="yellow" title="Payments" value="$0" change="Pending payments" />
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
