import { Metadata } from "next";
import { SearchContent } from "./search-content";

export const metadata: Metadata = {
  title: "Search | EduConnect",
  description: "Find coaching services, teachers, and students in Bangladesh.",
};

export default function SearchPage() {
  return <SearchContent />;
}
