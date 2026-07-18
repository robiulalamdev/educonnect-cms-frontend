import type { Metadata } from "next";
import { AdminEducationContent } from "./admin-education-content";

export const metadata: Metadata = { title: "Education Management", description: "Manage education levels, groups, categories and subjects" };

export default function AdminEducationPage() {
  return <AdminEducationContent />;
}
