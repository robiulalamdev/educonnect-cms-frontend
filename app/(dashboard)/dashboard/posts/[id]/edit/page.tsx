import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostById } from "@/lib/actions/posts";
import { PostForm } from "../../post-form";

export const metadata: Metadata = {
  title: "Edit Post",
  description: "Edit your post",
};

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let post: any;
  try {
    const res = (await getPostById(id)) as { success: boolean; data: any };
    if (!res.success || !res.data) notFound();
    post = res.data;
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Edit Post
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Update your post
        </p>
      </div>
      <PostForm
        postId={id}
        initialData={{
          type: post.type,
          title: post.title,
          content: post.content,
          status: post.status,
          media: post.media ?? [],
        }}
      />
    </div>
  );
}
