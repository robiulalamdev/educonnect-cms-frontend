import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import { TeacherDashboard } from "./role-dashboards/teacher-dashboard";
import { StudentDashboard } from "./role-dashboards/student-dashboard";
import { GuardianDashboard } from "./role-dashboards/guardian-dashboard";

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
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#0066FF] via-[#2563EB] to-[#3B82F6] px-6 py-8 sm:px-8 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMS41IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDgpIi8+PC9zdmc+')] opacity-40" />
        <div className="relative">
          <h1 className="text-2xl sm:text-3xl font-bold">{greeting}, {user.full_name?.split(" ")[0]}</h1>
          <p className="mt-2 text-blue-100 text-[15px]">
            {user.role === "TEACHER" && "Manage your coaching services and track student progress."}
            {user.role === "STUDENT" && "Track your learning progress and upcoming classes."}
            {user.role === "GUARDIAN" && "Monitor your child's education and stay updated."}
          </p>
        </div>
      </div>
      {user.role === "TEACHER" && <TeacherDashboard />}
      {user.role === "STUDENT" && <StudentDashboard />}
      {user.role === "GUARDIAN" && <GuardianDashboard />}
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
