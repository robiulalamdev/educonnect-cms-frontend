import type { Metadata } from "next";
import { AdminDashboardContent } from "./admin-dashboard-content";

export const metadata: Metadata = { title: "Admin Dashboard", description: "System administration dashboard" };

export default function AdminDashboardPage() {
  return <AdminDashboardContent />;
}
