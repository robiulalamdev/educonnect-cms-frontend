import type { Metadata } from "next";
import { AdminSubscriptionsContent } from "./admin-subscriptions-content";

export const metadata: Metadata = { title: "Subscriptions", description: "Manage subscription packages" };

export default function AdminSubscriptionsPage() {
  return <AdminSubscriptionsContent />;
}
