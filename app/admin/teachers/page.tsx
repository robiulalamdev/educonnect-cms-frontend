import type { Metadata } from "next";
import { AdminTeachersContent } from "./admin-teachers-content";

export const metadata: Metadata = { title: "Teacher Approvals", description: "Review and approve teacher applications" };

export default function AdminTeachersPage() {
  return <AdminTeachersContent />;
}
