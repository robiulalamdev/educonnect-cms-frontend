import type { Metadata } from "next";
import { AdminClassRoomContent } from "./admin-class-room-content";

export const metadata: Metadata = { title: "Class Room", description: "Manage all classes and batches" };

export default function AdminClassRoomPage() {
  return <AdminClassRoomContent />;
}
