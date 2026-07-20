import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminHeader } from "@/components/layout/admin-header";
import { AdminProvider } from "@/lib/contexts/admin-context";
import { redirect } from "next/navigation";
import { ROUTES, API } from "@/lib/constants";
import { apiGet } from "@/lib/api";

async function getAdminProfile() {
  try {
    const data = await apiGet<{
      success: boolean;
      data: any;
    }>(API.ADMIN.AUTH.ME, { isAdmin: true });
    if (data.success) return data.data;
    return null;
  } catch {
    return null;
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdminProfile();

  if (!admin) {
    redirect(ROUTES.ADMIN.LOGIN);
  }

  return (
    <AdminProvider admin={admin}>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset className="bg-[#f0f5ff]/60 dark:bg-gray-950">
          <AdminHeader />
          <main className="flex-1 p-5 sm:p-6 lg:p-8">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </AdminProvider>
  );
}
