import type { Metadata } from "next";
import { ServicesContent } from "./services-content";

export const metadata: Metadata = {
  title: "My Services",
  description: "Manage your coaching services",
};

export default function ServicesPage() {
  return <ServicesContent />;
}
