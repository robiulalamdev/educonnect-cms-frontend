import type { Metadata } from "next";
import { NotesContent } from "./notes-content";

export const metadata: Metadata = { title: "Daily Notes", description: "View class daily notes" };

export default function NotesPage() {
  return <NotesContent />;
}
