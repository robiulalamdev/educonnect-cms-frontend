"use client";

import { useState, useRef, useEffect } from "react";
import { createPostAction } from "@/lib/actions/posts";
import { getMyServices } from "@/lib/actions/services";
import { useUser } from "@/lib/contexts/user-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Image, Hash, Loader2, Bold, Italic, List, Link2, GraduationCap, ChevronDown } from "lucide-react";

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export function CreatePostModal({ open, onClose, onCreated }: CreatePostModalProps) {
  const user = useUser();
  const canOffer = user?.role === "TEACHER";
  const [type, setType] = useState<"OFFERING" | "SEEKING">(canOffer ? "OFFERING" : "SEEKING");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [services, setServices] = useState<Array<{ id: string; title: string }>>([]);
  const [serviceId, setServiceId] = useState("");
  const [showServices, setShowServices] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setType(canOffer ? "OFFERING" : "SEEKING");
  }, [canOffer]);

  useEffect(() => {
    if (canOffer) {
      getMyServices(1, 50).then((res: any) => {
        if (res.success && Array.isArray(res.data)) {
          setServices(res.data.map((s: any) => ({ id: s.id, title: s.title })));
        }
      });
    }
  }, [canOffer]);

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

  function insertFormatting(prefix: string, suffix: string) {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = content.substring(start, end);
    const newContent = content.substring(0, start) + prefix + selected + suffix + content.substring(end);
    setContent(newContent);
    setTimeout(() => { ta.focus(); ta.setSelectionRange(start + prefix.length, start + prefix.length + selected.length); }, 0);
  }

  async function handleSubmit() {
    if (!title.trim() || !content.trim()) return;
    if (type === "OFFERING" && canOffer && services.length > 0 && !serviceId) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.set("type", type);
      formData.set("title", title);
      formData.set("content", `<p>${content.replace(/\n/g, "</p><p>")}</p>`);
      if (serviceId) formData.set("service_id", serviceId);
      formData.set("subject_ids", "[]");
      formData.set("level_ids", "[]");
      for (const file of files) formData.append("media", file);

      const res = await createPostAction(null, formData);
      if (res?.success) {
        setTitle(""); setContent(""); setFiles([]); setPreviews([]); setType(canOffer ? "OFFERING" : "SEEKING"); setServiceId(""); setShowServices(false);
        onClose();
        onCreated?.();
      }
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center bg-black/60 backdrop-blur-sm pt-16 px-4" onClick={onClose}>
      <div className="w-full max-w-[540px] bg-white dark:bg-[#16161D] rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-[16px] font-bold text-gray-900 dark:text-white">Create Post</h2>
          <button onClick={onClose} className="size-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors"><X className="size-4 text-gray-400" /></button>
        </div>

        <div className="p-5 space-y-4">
          {/* Type Toggle — only teachers/centers can offer */}
          {canOffer ? (
            <div className="flex gap-2">
              {(["OFFERING", "SEEKING"] as const).map((t) => (
                <button key={t} onClick={() => setType(t)}
                  className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all ${type === t ? "bg-[#0066FF] text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"}`}>
                  {t === "OFFERING" ? "I'm Offering" : "I'm Seeking"}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 px-4 py-2.5">
              <span className="px-3 py-1 rounded-full bg-[#F59E0B] text-white text-[13px] font-semibold">I'm Seeking</span>
              <p className="text-xs text-amber-700 dark:text-amber-300">Students & guardians can only post "seeking" to find a teacher.</p>
            </div>
          )}

          {/* Service picker — teachers attach their own service to OFFERING posts */}
          {type === "OFFERING" && canOffer && (
            <div className="relative">
              <button type="button" onClick={() => setShowServices((v) => !v)}
                className="w-full flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 px-4 py-3 text-[14px] text-left">
                <GraduationCap className="size-4 text-[#0066FF] shrink-0" />
                {serviceId ? (
                  <span className="font-medium text-gray-900 dark:text-white truncate">{services.find((s) => s.id === serviceId)?.title}</span>
                ) : (
                  <span className="text-gray-400">Attach your service (optional)</span>
                )}
                <ChevronDown className="size-4 text-gray-400 ml-auto shrink-0" />
              </button>
              {showServices && (
                <div className="absolute top-full left-0 right-0 mt-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl overflow-hidden max-h-56 overflow-y-auto z-20">
                  {services.length === 0 ? (
                    <p className="px-4 py-3 text-xs text-gray-400">No services yet — create one first.</p>
                  ) : (
                    services.map((s) => (
                      <button key={s.id} type="button"
                        onClick={() => { setServiceId(s.id); setShowServices(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 dark:hover:bg-blue-950/30 flex items-center gap-2 ${serviceId === s.id ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600" : "text-gray-700 dark:text-gray-300"}`}>
                        <GraduationCap className="size-4 shrink-0 text-gray-400" />
                        <span className="truncate">{s.title}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          <Input placeholder="Post title..." value={title} onChange={(e) => setTitle(e.target.value)}
            className="h-11 rounded-xl bg-gray-50 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 text-[15px] font-semibold focus:border-[#0066FF] focus:ring-[#0066FF]/20" />

          {/* Rich Text Editor Area */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 overflow-hidden focus-within:border-[#0066FF] focus-within:ring-2 focus-within:ring-[#0066FF]/20 transition-all">
            {/* Toolbar */}
            <div className="flex items-center gap-0.5 px-3 py-2 border-b border-gray-200/60 dark:border-gray-700/60">
              <button type="button" onClick={() => insertFormatting("**", "**")} className="size-7 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-gray-500 transition-colors" title="Bold">
                <Bold className="size-3.5" />
              </button>
              <button type="button" onClick={() => insertFormatting("*", "*")} className="size-7 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-gray-500 transition-colors" title="Italic">
                <Italic className="size-3.5" />
              </button>
              <button type="button" onClick={() => insertFormatting("\n- ", "")} className="size-7 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-gray-500 transition-colors" title="List">
                <List className="size-3.5" />
              </button>
              <button type="button" onClick={() => insertFormatting("[", "](url)")} className="size-7 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-gray-500 transition-colors" title="Link">
                <Link2 className="size-3.5" />
              </button>
              <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1" />
              <button type="button" onClick={() => fileRef.current?.click()} className="size-7 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-gray-500 transition-colors" title="Add Image">
                <Image className="size-3.5" />
              </button>
            </div>
            {/* Textarea */}
            <textarea ref={textareaRef} placeholder="What do you want to share?" value={content} onChange={(e) => setContent(e.target.value)}
              rows={5} className="w-full bg-transparent px-4 py-3 text-[15px] text-gray-700 dark:text-gray-300 focus:outline-none resize-none placeholder:text-gray-400" />
          </div>

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
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
            <Button variant="ghost" size="sm" className="rounded-full text-gray-500 hover:text-[#0066FF] hover:bg-[#0066FF]/5" onClick={() => fileRef.current?.click()}>
              <Image className="size-4 mr-1.5" /> Photo
            </Button>
            <Button onClick={handleSubmit} disabled={!title.trim() || !content.trim() || submitting}
              className="rounded-full bg-[#0066FF] hover:bg-[#0052CC] text-white px-5 h-9 text-[13px] font-semibold shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:shadow-none transition-all">
              {submitting ? <Loader2 className="size-4 animate-spin mr-1.5" /> : null}
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}