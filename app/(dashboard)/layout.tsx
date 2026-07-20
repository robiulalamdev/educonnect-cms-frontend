import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { RoleGate } from "@/components/layout/role-gate";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import { UserProvider } from "@/lib/contexts/user-context";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(ROUTES.LOGIN);
  }

  return (
    <UserProvider user={user}>
      <SidebarProvider>
        <DashboardSidebar />
        <SidebarInset className="bg-[#f0f5ff]/60 dark:bg-gray-950">
          <DashboardHeader user={user} />
          <main className="flex-1 p-5 sm:p-6 lg:p-8">
            <RoleGate role={user.role}>{children}</RoleGate>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </UserProvider>
  );
}
