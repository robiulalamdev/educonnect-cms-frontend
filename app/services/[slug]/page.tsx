import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetailContent } from "./service-detail-content";
import { apiPublicGet } from "@/lib/api";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await apiPublicGet<{ success: boolean; data: any }>(`/api/v1/services/slug/${slug}`);
    if (!res.success || !res.data) return { title: "Service Not Found" };
    return {
      title: `${res.data.title} | EduConnect`,
      description: res.data.description?.slice(0, 160) || `View ${res.data.title} coaching service on EduConnect`,
    };
  } catch {
    return { title: "Service Not Found" };
  }
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let service = null;
  try {
    const res = await apiPublicGet<{ success: boolean; data: any }>(`/api/v1/services/slug/${slug}`);
    if (res.success && res.data) {
      service = res.data;
    }
  } catch {
    notFound();
  }

  if (!service) notFound();

  return <ServiceDetailContent service={service} />;
}
