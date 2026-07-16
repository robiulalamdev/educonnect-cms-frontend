"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, CheckCircle, Clock, CreditCard, GraduationCap, Calendar } from "lucide-react";
import Link from "next/link";

export function StudentDashboard() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Link href="/dashboard/enrollments">
        <StatCard icon={GraduationCap} iconColor="blue" title="My Enrollments" value="0" change="Active batches" />
      </Link>
      <Link href="/dashboard/enrollments">
        <StatCard icon={CheckCircle} iconColor="green" title="Completed" value="0" change="Finished courses" />
      </Link>
      <Link href="/dashboard/messages">
        <StatCard icon={MessageSquare} iconColor="purple" title="Messages" value="0" change="Unread messages" />
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

function MessageSquare(props: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/></svg>;
}
