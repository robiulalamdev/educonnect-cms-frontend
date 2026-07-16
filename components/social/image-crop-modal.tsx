"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { X, Loader2, RotateCw } from "lucide-react";

interface ImageCropModalProps {
  open: boolean;
  imageSrc: string;
  onClose: () => void;
  onCrop: (blob: Blob) => void;
}

export function ImageCropModal({ open, imageSrc, onClose, onCrop }: ImageCropModalProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [saving, setSaving] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleCrop = useCallback(async () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    setSaving(true);
    const size = 300;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, size, size);
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.clip();

    const scale = Math.max(size / img.naturalWidth, size / img.naturalHeight) * zoom;
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    const x = (size - w) / 2;
    const y = (size - h) / 2;

    ctx.translate(size / 2, size / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-size / 2, -size / 2);
    ctx.drawImage(img, x, y, w, h);

    canvas.toBlob((blob) => {
      if (blob) onCrop(blob);
      setSaving(false);
    }, "image/jpeg", 0.9);
  }, [zoom, rotation, onCrop]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-[400px] bg-white dark:bg-[#16161D] rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-[15px] font-bold text-gray-900 dark:text-white">Crop Photo</h2>
          <button onClick={onClose} className="size-7 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center"><X className="size-4 text-gray-400" /></button>
        </div>

        <div className="p-5 space-y-4">
          <div className="relative size-[250px] mx-auto rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img ref={imgRef} src={imageSrc} alt="" className="w-full h-full object-cover" style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }} />
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[12px] text-gray-500"><span>Zoom</span><span>{Math.round(zoom * 100)}%</span></div>
              <input type="range" min="1" max="3" step="0.1" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer accent-[#0066FF]" />
            </div>
            <div className="flex items-center justify-center gap-2">
              <Button variant="outline" size="sm" className="rounded-full" onClick={() => setRotation((r) => r + 90)}>
                <RotateCw className="size-3.5 mr-1" /> Rotate
              </Button>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 rounded-xl" onClick={onClose}>Cancel</Button>
            <Button onClick={handleCrop} disabled={saving}
              className="flex-1 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white">
              {saving ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
              Save
            </Button>
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
