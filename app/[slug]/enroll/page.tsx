import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { EnrollContent } from "./enroll-content";

export const metadata = {
  title: "Enroll in Batch | EduConnect BD",
  description: "Secure your spot and process payment manually for the batch.",
};

export default function EnrollPage({ params, searchParams }: { params: { slug: string }, searchParams: { batch: string } }) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F4F5F7] dark:bg-[#0D0D12] py-12">
        <EnrollContent slug={params.slug} batchId={searchParams.batch} />
      </main>
      <Footer />
    </>
  );
}
