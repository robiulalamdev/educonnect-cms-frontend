import type { Metadata } from "next";
import { TasksContent } from "./tasks-content";

export const metadata: Metadata = { title: "Tasks", description: "Manage class assignments" };

export default function TasksPage() {
  return <TasksContent />;
}
