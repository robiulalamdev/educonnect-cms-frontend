import type { Metadata } from "next";
import { AdminSettingsContent } from "./admin-settings-content";

export const metadata: Metadata = { title: "Settings", description: "Admin account settings" };

export default function AdminSettingsPage() {
  return <AdminSettingsContent />;
}
