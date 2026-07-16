"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, Camera, Type, Loader2, Image } from "lucide-react";

interface CreateStoryModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

const bgColors = ["#1e40af", "#7c3aed", "#db2777", "#dc2626", "#ea580c", "#16a34a", "#0891b2", "#4f46e5"];

export function CreateStoryModal({ open, onClose, onCreated }: CreateStoryModalProps) {
  const [mode, setMode] = useState<"image" | "text">("image");
  const [content, setContent] = useState("");
  const [bgColor, setBgColor] = useState(bgColors[0]);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) { setFile(f); setPreview(URL.createObjectURL(f)); setMode("image"); }
  }

  function reset() {
    setContent(""); setFile(null); setPreview(null); setMode("image"); setBgColor(bgColors[0]);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleSubmit() {
    if (mode === "text" && !content.trim()) return;
    if (mode === "image" && !file) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      if (mode === "text") {
        // Text story - use fetch with JSON
        const res = await fetch("/api/v1/stories/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ content, bg_color: bgColor }),
        });
        if (res.ok) { reset(); handleClose(); onCreated?.(); }
      } else if (file) {
        // Image story - use multipart
        formData.append("content", "");
        formData.append("media_type", "IMAGE");
        formData.append("media", file);
        const res = await fetch("/api/v1/stories/", {
          method: "POST",
          body: formData,
          credentials: "include",
        });
        if (res.ok) { reset(); handleClose(); onCreated?.(); }
      }
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={handleClose}>
      <div className="w-full max-w-[380px] bg-white dark:bg-[#16161D] rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-[15px] font-bold text-gray-900 dark:text-white">Create Story</h2>
          <button onClick={handleClose} className="size-7 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center"><X className="size-4 text-gray-400" /></button>
        </div>

        <div className="p-5 space-y-4">
          {/* Preview - full width, same for both modes */}
          <div className="w-full aspect-[9/16] max-h-[360px] rounded-xl overflow-hidden">
            {mode === "image" && preview ? (
              <div className="relative w-full h-full bg-gray-100 dark:bg-gray-800">
                <img src={preview} alt="" className="w-full h-full object-cover" />
                <button onClick={() => { setFile(null); setPreview(null); }} className="absolute top-2 right-2 size-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 z-10"><X className="size-3" /></button>
              </div>
            ) : mode === "text" ? (
              <div className="w-full h-full flex items-center justify-center p-6" style={{ backgroundColor: bgColor }}>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Type something..."
                  className="w-full bg-transparent text-white text-lg font-medium text-center resize-none focus:outline-none placeholder:text-white/50" rows={4} />
              </div>
            ) : (
              <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center gap-3 cursor-pointer" onClick={() => fileRef.current?.click()}>
                <Camera className="size-10 text-gray-300 dark:text-gray-600" />
                <p className="text-[13px] text-gray-400">Tap to add a photo</p>
              </div>
            )}
          </div>

          {/* Mode Toggle */}
          <div className="flex gap-2">
            <button onClick={() => { setMode("image"); if (!preview) fileRef.current?.click(); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${mode === "image" ? "bg-[#0066FF] text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"}`}>
              <Image className="size-4" /> Photo
            </button>
            <button onClick={() => setMode("text")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${mode === "text" ? "bg-[#0066FF] text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"}`}>
              <Type className="size-4" /> Text
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

          {/* Color Picker for text mode */}
          {mode === "text" && (
            <div className="flex gap-2 justify-center">
              {bgColors.map((c) => (
                <button key={c} onClick={() => setBgColor(c)}
                  className={`size-7 rounded-full transition-all ${bgColor === c ? "ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-110" : "hover:scale-110"}`}
                  style={{ backgroundColor: c }} />
              ))}
            </div>
          )}

          <Button onClick={handleSubmit} disabled={submitting || (mode === "text" && !content.trim()) || (mode === "image" && !file)}
            className="w-full rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white h-11 font-semibold shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:shadow-none">
            {submitting ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
            Share Story
          </Button>
        </div>
      </div>
    </div>
  );
}
