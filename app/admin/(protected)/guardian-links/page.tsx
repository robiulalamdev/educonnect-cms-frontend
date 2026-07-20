import type { Metadata } from "next";
import { AdminGuardianLinksContent } from "./admin-guardian-links-content";

export const metadata: Metadata = { title: "Guardian Links", description: "Manage guardian-student connections" };

export default function AdminGuardianLinksPage() {
  return <AdminGuardianLinksContent />;
}
