import type { Metadata } from "next";
import { AdminAdminsContent } from "./admin-admins-content";

export const metadata: Metadata = { title: "Admin Accounts", description: "Manage administrator accounts" };

export default function AdminAccountsPage() {
  return <AdminAdminsContent />;
}
