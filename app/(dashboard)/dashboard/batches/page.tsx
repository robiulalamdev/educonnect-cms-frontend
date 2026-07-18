import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { BatchesContent } from "./batches-content";

export const metadata: Metadata = { title: "My Batches", description: "Manage your class batches" };

export default async function BatchesPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "TEACHER") redirect("/dashboard");
  return <BatchesContent />;
}
