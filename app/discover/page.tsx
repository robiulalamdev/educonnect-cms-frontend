import { DiscoverContent } from "./discover-content";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata = {
  title: "Discover | EduConnect",
  description: "Find the best coaching services or connect with seeking students in Bangladesh.",
};

export default function DiscoverPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F4F5F7] dark:bg-[#0D0D12]">
        <DiscoverContent />
      </main>
      <Footer />
    </>
  );
}
