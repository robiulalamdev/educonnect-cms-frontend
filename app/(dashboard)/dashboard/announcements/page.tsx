import type { Metadata } from "next";
import { AnnouncementsContent } from "./announcements-content";

export const metadata: Metadata = { title: "Announcements", description: "View batch announcements" };

export default function AnnouncementsPage() {
  return <AnnouncementsContent />;
}
