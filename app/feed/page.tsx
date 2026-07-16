import type { Metadata } from "next";
import { FeedContent } from "./feed-content";

export const metadata: Metadata = {
  title: "Feed",
  description: "Browse posts from the community",
};

export default function FeedPage() {
  return <FeedContent />;
}
