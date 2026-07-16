import type { Metadata } from "next";
import { BatchesContent } from "./batches-content";

export const metadata: Metadata = { title: "My Batches", description: "Manage your class batches" };

export default function BatchesPage() {
  return <BatchesContent />;
}
