import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  Users,
  CreditCard,
  Bell,
  ArrowUpRight,
  TrendingUp,
  Plus,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your coaching dashboard",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect(ROUTES.LOGIN);

  const greeting = getGreeting();

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-8 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMS41IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-30" />
        <div className="relative">
          <h1 className="text-2xl font-bold sm:text-3xl">
            {greeting}, {user.full_name?.split(" ")[0]}
          </h1>
          <p className="mt-2 text-blue-100">
            Here is what is happening with your coaching today.
          </p>
          <div className="mt-5 flex gap-3">
            <Link href={ROUTES.USER.SERVICES}>
              <button className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-blue-600 hover:bg-gray-50 transition-colors">
                <Plus className="size-4" />
                New Service
              </button>
            </Link>
            <Link href={ROUTES.USER.PROFILE}>
              <button className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                View Profile
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="My Services"
          value="0"
          icon={BookOpen}
          description="Active coaching services"
          trend="+0%"
          href={ROUTES.USER.SERVICES}
        />
        <StatCard
          title="Total Students"
          value="0"
          icon={Users}
          description="Enrolled across all batches"
          trend="+0%"
          href={ROUTES.USER.BATCHES}
        />
        <StatCard
          title="Payments"
          value="$0"
          icon={CreditCard}
          description="Pending payments"
          trend="+0%"
          href={ROUTES.USER.ENROLLMENTS}
        />
        <StatCard
          title="Notifications"
          value="0"
          icon={Bell}
          description="Unread notifications"
          trend=""
          href={ROUTES.USER.NOTIFICATIONS}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <QuickActionCard
          title="Create Service"
          description="Start a new coaching service"
          icon={BookOpen}
          href={ROUTES.USER.SERVICES}
        />
        <QuickActionCard
          title="Manage Batches"
          description="View and manage your batches"
          icon={Users}
          href={ROUTES.USER.BATCHES}
        />
        <QuickActionCard
          title="View Enrollments"
          description="Check enrollment requests"
          icon={CreditCard}
          href={ROUTES.USER.ENROLLMENTS}
        />
      </div>

      {/* Recent Activity */}
      <Card className="border-0 shadow-sm dark:bg-gray-900 dark:border dark:border-gray-800 rounded-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500">
              <TrendingUp className="size-6" />
            </div>
            <p className="mt-4 text-sm font-medium text-gray-900 dark:text-white">
              No activity yet
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Your recent activity will appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  href,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  trend: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className="group border-0 shadow-sm hover:shadow-md dark:bg-gray-900 dark:border dark:border-gray-800 transition-all duration-300 rounded-2xl cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {title}
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {value}
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {description}
              </p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-950 transition-colors">
              <Icon className="size-5" />
            </div>
          </div>
          {trend && (
            <div className="mt-4 flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
              <TrendingUp className="size-3" />
              {trend} this month
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

function QuickActionCard({
  title,
  description,
  icon: Icon,
  href,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className="group border-0 shadow-sm hover:shadow-md dark:bg-gray-900 dark:border dark:border-gray-800 transition-all duration-300 rounded-2xl cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-950 transition-colors">
              <Icon className="size-6" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {description}
              </p>
            </div>
            <ArrowUpRight className="size-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
