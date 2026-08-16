import type { Metadata } from "next";
import { AdminPaymentsContent } from "./admin-payments-content";

export const metadata: Metadata = { title: "Payments", description: "Manage payment records" };

export default function AdminPaymentsPage() {
  return <AdminPaymentsContent />;
}
