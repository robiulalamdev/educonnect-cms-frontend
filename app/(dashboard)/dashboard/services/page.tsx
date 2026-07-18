import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { ServicesContent } from "./services-content";

export const metadata: Metadata = {
  title: "My Services",
  description: "Manage your coaching services",
};

export default async function ServicesPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "TEACHER") redirect("/dashboard");
  return <ServicesContent />;
}
