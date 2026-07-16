import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, CreditCard, Bell } from "lucide-react";

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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {greeting}, {user.full_name?.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground">
          Here is what is happening with your coaching today.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="My Services"
          value="0"
          icon={BookOpen}
          description="Active coaching services"
        />
        <StatCard
          title="Total Students"
          value="0"
          icon={Users}
          description="Enrolled across all batches"
        />
        <StatCard
          title="Payments"
          value="0"
          icon={CreditCard}
          description="Pending payments"
        />
        <StatCard
          title="Notifications"
          value="0"
          icon={Bell}
          description="Unread notifications"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Quick actions will appear here based on your role.
          </p>
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
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          <Icon className="size-8 text-muted-foreground/50" />
        </div>
      </CardContent>
    </Card>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
