import type { Metadata } from "next";
import { ReviewsContent } from "./reviews-content";

export const metadata: Metadata = { title: "Reviews", description: "View and manage reviews" };

export default function ReviewsPage() {
  return <ReviewsContent />;
}
