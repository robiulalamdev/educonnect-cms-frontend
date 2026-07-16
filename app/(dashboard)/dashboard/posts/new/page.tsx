import type { Metadata } from "next";
import { PostForm } from "../post-form";

export const metadata: Metadata = {
  title: "Create Post",
  description: "Create a new post",
};

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Create Post
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Share something with the community
        </p>
      </div>
      <PostForm />
    </div>
  );
}
