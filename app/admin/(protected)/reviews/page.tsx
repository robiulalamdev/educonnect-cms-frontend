import type { Metadata } from "next";
import { AdminReviewsContent } from "./admin-reviews-content";

export const metadata: Metadata = { title: "Reviews Management", description: "Review and moderate service reviews" };

export default function AdminReviewsPage() {
  return <AdminReviewsContent />;
}
