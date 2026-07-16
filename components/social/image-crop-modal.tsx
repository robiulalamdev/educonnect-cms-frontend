"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Loader2, RotateCw, ZoomIn, ZoomOut } from "lucide-react";

interface ImageCropModalProps {
  open: boolean;
  imageSrc: string;
  onClose: () => void;
  onCrop: (blob: Blob) => void;
}

export function ImageCropModal({ open, imageSrc, onClose, onCrop }: ImageCropModalProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [saving, setSaving] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleCrop = useCallback(async () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    setSaving(true);
    const size = 400;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) { setSaving(false); return; }

    ctx.clearRect(0, 0, size, size);

    // Draw circular clip
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.clip();

    // Calculate crop area
    const scale = Math.max(size / img.naturalWidth, size / img.naturalHeight) * zoom;
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    const x = (size - w) / 2 + posX;
    const y = (size - h) / 2 + posY;

    ctx.save();
    ctx.translate(size / 2, size / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-size / 2, -size / 2);
    ctx.drawImage(img, x, y, w, h);
    ctx.restore();

    canvas.toBlob((blob) => {
      if (blob) onCrop(blob);
      setSaving(false);
    }, "image/jpeg", 0.92);
  }, [zoom, rotation, posX, posY, onCrop]);

  // Auto-save when modal opens with an image
  useEffect(() => {
    if (open && imageSrc) {
      setZoom(1);
      setRotation(0);
      setPosX(0);
      setPosY(0);
    }
  }, [open, imageSrc]);

  // Handle drag to pan
  function handleMouseDown(e: React.MouseEvent) {
    setDragging(true);
    setDragStart({ x: e.clientX - posX, y: e.clientY - posY });
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!dragging) return;
    setPosX(e.clientX - dragStart.x);
    setPosY(e.clientY - dragStart.y);
  }

  function handleMouseUp() {
    setDragging(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-[400px] bg-white dark:bg-[#16161D] rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-[15px] font-bold text-gray-900 dark:text-white">Crop Photo</h2>
          <button onClick={onClose} className="size-7 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center"><X className="size-4 text-gray-400" /></button>
        </div>

        <div className="p-5 space-y-4">
          {/* Crop Area - circular mask */}
          <div ref={containerRef}
            className="relative size-[260px] mx-auto rounded-full overflow-hidden bg-gray-900 cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}>
            <img ref={imgRef} src={imageSrc} alt="" draggable={false}
              className="w-full h-full object-cover pointer-events-none"
              style={{ transform: `scale(${zoom}) rotate(${rotation}deg) translate(${posX / zoom}px, ${posY / zoom}px)` }} />
            {/* Crop guide overlay */}
            <div className="absolute inset-0 rounded-full ring-2 ring-white/30 pointer-events-none" />
          </div>

          {/* Zoom Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[12px] text-gray-500">
              <span>Zoom</span>
              <span>{Math.round(zoom * 100)}%</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))} className="size-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"><ZoomOut className="size-3.5" /></button>
              <input type="range" min="0.5" max="3" step="0.05" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer accent-[#0066FF]" />
              <button onClick={() => setZoom((z) => Math.min(3, z + 0.1))} className="size-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"><ZoomIn className="size-3.5" /></button>
            </div>
          </div>

          {/* Rotate */}
          <div className="flex items-center justify-center">
            <button onClick={() => setRotation((r) => r + 90)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-[12px] font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <RotateCw className="size-3.5" /> Rotate 90°
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 rounded-xl h-10" onClick={onClose}>Cancel</Button>
            <Button onClick={handleCrop} disabled={saving}
              className="flex-1 rounded-xl h-10 bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold shadow-lg shadow-blue-500/20">
              {saving ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
              Save Photo
            </Button>
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
