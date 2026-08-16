import type { Metadata } from "next";
import { AdminModerationContent } from "./admin-moderation-content";

export const metadata: Metadata = { title: "Moderation", description: "Content moderation dashboard" };

export default function AdminModerationPage() {
  return <AdminModerationContent />;
}
