"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: { value: string; up: boolean };
  color: "blue" | "green" | "yellow" | "purple" | "red" | "cyan";
}

const colorMap: Record<string, string> = {
  blue: "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400",
  green: "bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400",
  yellow: "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400",
  purple: "bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400",
  red: "bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400",
  cyan: "bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400",
};

export function StatCard({ icon: Icon, label, value, trend, color }: StatCardProps) {
  return (
    <Card className="border border-gray-200/80 dark:border-gray-800/80 rounded-[24px] bg-white dark:bg-[#16161D] hover:shadow-md transition-all cursor-pointer group">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[13px] font-medium text-gray-500 dark:text-gray-400">{label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            {trend && (
              <div className="mt-1 flex items-center gap-1 text-[12px]">
                {trend.up ? (
                  <ArrowUpRight className="size-3 text-green-500" />
                ) : (
                  <ArrowDownRight className="size-3 text-red-500" />
                )}
                <span className={trend.up ? "text-green-500" : "text-red-500"}>{trend.value}</span>
                <span className="text-gray-400">this month</span>
              </div>
            )}
          </div>
          <div className={`flex size-10 items-center justify-center rounded-xl ${colorMap[color]} group-hover:scale-110 transition-transform`}>
            <Icon className="size-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
