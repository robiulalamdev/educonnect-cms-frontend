import type { Metadata } from "next";
import { AttendanceContent } from "./attendance-content";

export const metadata: Metadata = { title: "Attendance", description: "Manage class attendance" };

export default function AttendancePage() {
  return <AttendanceContent />;
}
