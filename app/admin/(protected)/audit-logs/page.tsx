import type { Metadata } from "next";
import { AdminAuditLogsContent } from "./admin-audit-logs-content";

export const metadata: Metadata = { title: "Audit Logs", description: "View system audit logs" };

export default function AdminAuditLogsPage() {
  return <AdminAuditLogsContent />;
}
