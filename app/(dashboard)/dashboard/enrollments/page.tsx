import type { Metadata } from "next";
import { EnrollmentsContent } from "./enrollments-content";

export const metadata: Metadata = { title: "Enrollments", description: "Manage your enrollments" };

export default function EnrollmentsPage() {
  return <EnrollmentsContent />;
}
