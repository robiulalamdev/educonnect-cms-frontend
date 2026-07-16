import type { Metadata } from "next";
import { MediaLibrary } from "./media-library";

export const metadata: Metadata = {
  title: "Media Library",
  description: "Manage your uploaded files",
};

export default function MediaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Media Library
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage all your uploaded files
        </p>
      </div>
      <MediaLibrary />
    </div>
  );
}
