"use client";

import { useState, useRef } from "react";
import { createPostAction } from "@/lib/actions/posts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Image, Video, Hash, Loader2 } from "lucide-react";

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export function CreatePostModal({ open, onClose, onCreated }: CreatePostModalProps) {
  const [type, setType] = useState<"OFFERING" | "SEEKING">("OFFERING");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const newFiles = Array.from(e.target.files ?? []).slice(0, 5);
    setFiles(newFiles);
    setPreviews(newFiles.map((f) => URL.createObjectURL(f)));
  }

  function removeFile(i: number) {
    URL.revokeObjectURL(previews[i]);
    setFiles((p) => p.filter((_, idx) => idx !== i));
    setPreviews((p) => p.filter((_, idx) => idx !== i));
  }

  async function handleSubmit() {
    if (!title.trim() || !content.trim()) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.set("type", type);
      formData.set("title", title);
      formData.set("content", content);
      formData.set("subject_ids", "[]");
      formData.set("level_ids", "[]");
      for (const file of files) formData.append("media", file);

      const res = await createPostAction(null, formData);
      if (res?.success) {
        setTitle(""); setContent(""); setFiles([]); setPreviews([]); setType("OFFERING");
        onClose();
        onCreated?.();
      }
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center bg-black/60 backdrop-blur-sm pt-20 px-4" onClick={onClose}>
      <div className="w-full max-w-[540px] bg-white dark:bg-[#16161D] rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-[16px] font-bold text-gray-900 dark:text-white">Create Post</h2>
          <button onClick={onClose} className="size-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors"><X className="size-4 text-gray-400" /></button>
        </div>

        <div className="p-5 space-y-4">
          {/* Type Toggle */}
          <div className="flex gap-2">
            {(["OFFERING", "SEEKING"] as const).map((t) => (
              <button key={t} onClick={() => setType(t)}
                className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all ${type === t ? "bg-[#0066FF] text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"}`}>
                {t === "OFFERING" ? "I'm Offering" : "I'm Seeking"}
              </button>
            ))}
          </div>

          <Input placeholder="Post title..." value={title} onChange={(e) => setTitle(e.target.value)}
            className="h-11 rounded-xl bg-gray-50 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 text-[15px] font-semibold" />

          <textarea placeholder="What do you want to share?" value={content} onChange={(e) => setContent(e.target.value)}
            rows={4} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 px-4 py-3 text-[15px] text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] resize-none" />

          {/* Previews */}
          {previews.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {previews.map((p, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img src={p} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => removeFile(i)} className="absolute top-1.5 right-1.5 size-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"><X className="size-3" /></button>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-1">
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
              <Button variant="ghost" size="sm" className="rounded-full text-gray-500 hover:text-[#0066FF] hover:bg-[#0066FF]/5" onClick={() => fileRef.current?.click()}>
                <Image className="size-4 mr-1.5" /> Photo
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full text-gray-500 hover:text-[#0066FF] hover:bg-[#0066FF]/5">
                <Video className="size-4 mr-1.5" /> Video
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full text-gray-500 hover:text-[#0066FF] hover:bg-[#0066FF]/5">
                <Hash className="size-4 mr-1.5" /> Tag
              </Button>
            </div>
            <Button onClick={handleSubmit} disabled={!title.trim() || !content.trim() || submitting}
              className="rounded-full bg-[#0066FF] hover:bg-[#0052CC] text-white px-5 h-9 text-[13px] font-semibold shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:shadow-none">
              {submitting ? <Loader2 className="size-4 animate-spin mr-1.5" /> : null}
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
