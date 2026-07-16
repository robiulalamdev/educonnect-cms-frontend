"use client";

import { useActionState, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createPostAction, updatePostAction } from "@/lib/actions/posts";
import { RichEditor } from "@/components/rich-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants";
import { Loader2, Upload, X, Image as ImageIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";

type FormState = { error?: string; success?: boolean; postId?: string; message?: string };

interface PostFormProps {
  postId?: string;
  initialData?: {
    type: string;
    title: string;
    content: string;
    status: string;
    media: Array<{ id: string; key: string; filename: string; mime_type: string }>;
  };
}

export function PostForm({ postId, initialData }: PostFormProps) {
  const router = useRouter();
  const isEditing = !!postId;
  const [type, setType] = useState(initialData?.type ?? "OFFERING");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    isEditing
      ? (_prev, formData) => updatePostAction(postId!, _prev, formData)
      : createPostAction,
    {},
  );

  // Handle successful creation/edit
  if (state?.success && !isEditing) {
    router.push(`${ROUTES.USER.DASHBOARD}/posts`);
  }
  if (state?.success && isEditing) {
    router.push(`${ROUTES.USER.DASHBOARD}/posts`);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newFiles = Array.from(e.target.files ?? []);
    const totalFiles = [...files, ...newFiles].slice(0, 5);
    setFiles(totalFiles);
    const newPreviews = totalFiles.map((f) => URL.createObjectURL(f));
    setPreviews(newPreviews);
  }

  function removeFile(index: number) {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    URL.revokeObjectURL(previews[index]);
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("content", content);
    formData.set("type", type);

    for (const file of files) {
      formData.append("media", file);
    }

    if (isEditing) {
      updatePostAction(postId!, null, formData);
    } else {
      createPostAction(null, formData);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {state?.error && (
        <div className="rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200/60 dark:border-red-800/60 p-4 text-sm text-red-600 dark:text-red-400">
          {state.error}
        </div>
      )}

      {/* Post Type */}
      <Card className="border-0 shadow-sm rounded-2xl dark:bg-gray-900 dark:border dark:border-gray-800">
        <CardContent className="p-6">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Post Type
          </Label>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {(["OFFERING", "SEEKING"] as const).map((t) => (
              <label
                key={t}
                className={`flex cursor-pointer items-center justify-center rounded-2xl border-2 p-4 text-sm font-medium transition-all duration-300 ${
                  type === t
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 shadow-lg shadow-blue-600/10"
                    : "border-gray-200/60 dark:border-white/10 bg-white/50 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:border-blue-300"
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  value={t}
                  className="sr-only"
                  checked={type === t}
                  onChange={() => setType(t)}
                />
                {t === "OFFERING" ? "I'm Offering" : "I'm Seeking"}
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Title */}
      <Card className="border-0 shadow-sm rounded-2xl dark:bg-gray-900 dark:border dark:border-gray-800">
        <CardContent className="p-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Title
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter post title"
              required
              defaultValue={initialData?.title}
              className="h-12 rounded-2xl bg-white/50 dark:bg-white/5 border-gray-200/60 dark:border-white/10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <Card className="border-0 shadow-sm rounded-2xl dark:bg-gray-900 dark:border dark:border-gray-800">
        <CardContent className="p-6">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Content
          </Label>
          <div className="mt-3">
            <RichEditor
              content={content}
              onChange={setContent}
              placeholder="Write your post content here..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Media Upload */}
      <Card className="border-0 shadow-sm rounded-2xl dark:bg-gray-900 dark:border dark:border-gray-800">
        <CardContent className="p-6">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Media <span className="text-gray-400 font-normal">(optional, max 5 files)</span>
          </Label>

          {initialData?.media && initialData.media.length > 0 && (
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {initialData.media.map((m) => (
                <div
                  key={m.id}
                  className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800"
                >
                  {m.mime_type.startsWith("image/") ? (
                    <img
                      src={`https://res.cloudinary.com/dmlu7hni7/image/upload/${m.key}`}
                      alt={m.filename}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ImageIcon className="size-8 text-gray-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {previews.length > 0 && (
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {previews.map((preview, i) => (
                <div
                  key={i}
                  className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800"
                >
                  {files[i]?.type.startsWith("image/") ? (
                    <img src={preview} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ImageIcon className="size-8 text-gray-400" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="absolute top-2 right-2 size-6 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {files.length < 5 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200/60 dark:border-white/10 p-8 text-sm text-gray-500 dark:text-gray-400 hover:border-blue-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
            >
              <Upload className="size-5" />
              Click to upload images or documents
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            name="media"
            accept="image/*,video/*,.pdf,.doc,.docx"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Link href={`${ROUTES.USER.DASHBOARD}/posts`}>
          <Button type="button" variant="ghost" className="rounded-xl text-gray-500">
            <ArrowLeft className="mr-2 size-4" />
            Back
          </Button>
        </Link>
        <Button
          type="submit"
          className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-8 shadow-md shadow-blue-600/20"
          disabled={isPending || !content}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              {isEditing ? "Updating..." : "Creating..."}
            </>
          ) : isEditing ? (
            "Update Post"
          ) : (
            "Create Post"
          )}
        </Button>
      </div>
    </form>
  );
}
