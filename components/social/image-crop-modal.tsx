"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Loader2, Minus, Plus } from "lucide-react";

interface ImageCropModalProps {
  open: boolean;
  imageSrc: string;
  onClose: () => void;
  onCrop: (blob: Blob) => void;
}

export function ImageCropModal({ open, imageSrc, onClose, onCrop }: ImageCropModalProps) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [saving, setSaving] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleSave = useCallback(async () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    setSaving(true);
    const size = 300;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) { setSaving(false); return; }

    ctx.clearRect(0, 0, size, size);

    // Circular clip
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.clip();

    const scale = Math.max(size / img.naturalWidth, size / img.naturalHeight) * zoom;
    const imgW = img.naturalWidth * scale;
    const imgH = img.naturalHeight * scale;
    const x = (size - imgW) / 2 + offset.x;
    const y = (size - imgH) / 2 + offset.y;

    ctx.drawImage(img, x, y, imgW, imgH);

    canvas.toBlob((blob) => {
      if (blob) onCrop(blob);
      setSaving(false);
    }, "image/jpeg", 0.92);
  }, [zoom, offset, onCrop]);

  useEffect(() => {
    if (open) { setZoom(1); setOffset({ x: 0, y: 0 }); }
  }, [open, imageSrc]);

  function handleMouseDown(e: React.MouseEvent) {
    setDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!dragging) return;
    setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  }

  function handleMouseUp() { setDragging(false); }

  function handleTouchStart(e: React.TouchEvent) {
    const touch = e.touches[0];
    setDragging(true);
    setDragStart({ x: touch.clientX - offset.x, y: touch.clientY - offset.y });
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (!dragging) return;
    const touch = e.touches[0];
    setOffset({ x: touch.clientX - dragStart.x, y: touch.clientY - dragStart.y });
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-[400px] mx-4 bg-white dark:bg-[#16161D] rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-[15px] font-bold text-gray-900 dark:text-white">Update Profile Photo</h2>
          <button onClick={onClose} className="size-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center">
            <X className="size-4 text-gray-400" />
          </button>
        </div>

        {/* Crop Area - circular mask like Facebook */}
        <div className="flex justify-center py-6">
          <div className="relative size-[280px] rounded-full overflow-hidden bg-gray-900 cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleMouseUp}>
            <img ref={imgRef} src={imageSrc} alt="" draggable={false}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
              style={{
                transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)`,
                transformOrigin: "center center",
              }} />
            {/* Circle border ring */}
            <div className="absolute inset-0 rounded-full border-[3px] border-white/30 pointer-events-none" />
          </div>
        </div>

        {/* Zoom Slider */}
        <div className="px-6 pb-2">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
              className="size-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <Minus className="size-3.5 text-gray-600 dark:text-gray-400" />
            </button>
            <input type="range" min="0.5" max="3" step="0.01" value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer accent-[#0066FF] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#0066FF] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md" />
            <button type="button" onClick={() => setZoom((z) => Math.min(3, z + 0.1))}
              className="size-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <Plus className="size-3.5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800">
          <Button variant="ghost" onClick={onClose} className="rounded-full px-5 h-9 text-[13px] font-semibold text-gray-600 dark:text-gray-400">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}
            className="rounded-full bg-[#0066FF] hover:bg-[#0052CC] text-white px-6 h-9 text-[13px] font-semibold shadow-md shadow-blue-500/20 disabled:opacity-50">
            {saving ? <Loader2 className="size-3.5 animate-spin mr-1.5" /> : null}
            Save
          </Button>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
