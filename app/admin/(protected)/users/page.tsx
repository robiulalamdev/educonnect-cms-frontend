import type { Metadata } from "next";
import { AdminUsersContent } from "./admin-users-content";

export const metadata: Metadata = { title: "User Management", description: "Manage all users" };

export default function AdminUsersPage() {
  return <AdminUsersContent />;
}
