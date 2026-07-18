import type { Metadata } from "next";
import { CalendarContent } from "./calendar-content";

export const metadata: Metadata = { title: "Calendar", description: "View batch schedule calendar" };

export default function CalendarPage() {
  return <CalendarContent />;
}
