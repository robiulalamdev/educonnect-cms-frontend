import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FeedContent } from "./feed-content";

export const metadata: Metadata = {
  title: "Feed",
  description: "Browse posts from the community",
};

export default function FeedPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 mx-auto max-w-2xl w-full px-4 py-8">
        <FeedContent />
      </main>
      <Footer />
    </div>
  );
}
