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
import { DashboardFeed } from "./dashboard-feed";

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
            <Link href={`${ROUTES.USER.DASHBOARD}/posts/new`}>
              <button className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-blue-600 hover:bg-gray-50 transition-colors">
                <Plus className="size-4" />
                New Post
              </button>
            </Link>
            <Link href="/feed">
              <button className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                Browse Feed
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="My Posts"
          value="0"
          icon={BookOpen}
          description="Posts you've created"
          href={`${ROUTES.USER.DASHBOARD}/posts`}
        />
        <StatCard
          title="Total Students"
          value="0"
          icon={Users}
          description="Enrolled across all batches"
          href={ROUTES.USER.BATCHES}
        />
        <StatCard
          title="Payments"
          value="$0"
          icon={CreditCard}
          description="Pending payments"
          href={ROUTES.USER.ENROLLMENTS}
        />
        <StatCard
          title="Notifications"
          value="0"
          icon={Bell}
          description="Unread notifications"
          href={ROUTES.USER.NOTIFICATIONS}
        />
      </div>

      {/* Feed Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </h2>
          <Link href="/feed" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
            View all &rarr;
          </Link>
        </div>
        <DashboardFeed userId={user.id} />
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  href,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className="group border-0 shadow-sm hover:shadow-md dark:bg-gray-900 dark:border dark:border-gray-800 transition-all duration-300 rounded-2xl cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{description}</p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-950 transition-colors">
              <Icon className="size-5" />
            </div>
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
