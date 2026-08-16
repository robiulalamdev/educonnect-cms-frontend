"use client";

import { useEffect, useState, useCallback } from "react";
import { getMyMedia } from "@/lib/actions/media";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  FileImage,
  FileVideo,
  File,
  Eye,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List,
  Calendar,
  HardDrive,
} from "lucide-react";
import { getCloudinaryUrl } from "@/lib/utils";

interface MediaItem {
  id: string;
  key: string;
  filename: string;
  mime_type: string;
  type: string;
  size?: number;
  post_id?: string;
  post_title?: string;
  post_type?: string;
  owner_type?: string;
}

interface MediaResponse {
  success: boolean;
  data: MediaItem[];
  meta: { total: number; page: number; limit: number; total_pages: number };
}

function getMediaIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) return FileImage;
  if (mimeType.startsWith("video/")) return FileVideo;
  return File;
}

function getMediaUrl(key: string) {
  return getCloudinaryUrl(key, { w: 800 });
}

function getMediaThumbUrl(key: string) {
  return getCloudinaryUrl(key, { w: 200, h: 200 });
}

function formatFileSize(bytes?: number) {
  if (!bytes) return "Unknown";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaLibrary() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, total_pages: 0, limit: 20 });
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [showModal, setShowModal] = useState(false);

  const loadMedia = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = (await getMyMedia(p, 20)) as MediaResponse;
      if (res.success) {
        let filtered = res.data;
        if (search) {
          filtered = filtered.filter(
            (m) =>
              m.filename.toLowerCase().includes(search.toLowerCase()) ||
              m.post_title?.toLowerCase().includes(search.toLowerCase()),
          );
        }
        setMedia(filtered);
        setMeta(res.meta);
      }
    } catch (err) {
      console.error("Failed to load media:", err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    loadMedia(page);
  }, [page, loadMedia]);

  function handlePreview(item: MediaItem) {
    setSelectedMedia(item);
    setShowModal(true);
  }

  function handleDownload(item: MediaItem) {
    const url = getMediaUrl(item.key);
    const a = document.createElement("a");
    a.href = url;
    a.download = item.filename;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            placeholder="Search files..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-10 h-10 rounded-xl bg-white/50 dark:bg-white/5 border-gray-200/60 dark:border-white/10"
          />
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-gray-200/60 dark:border-white/10 p-1">
          <Button
            variant="ghost"
            size="icon"
            className={`size-8 rounded-lg ${viewMode === "grid" ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400" : ""}`}
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`size-8 rounded-lg ${viewMode === "list" ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400" : ""}`}
            onClick={() => setViewMode("list")}
          >
            <List className="size-4" />
          </Button>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">{meta.total} files</span>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square rounded-2xl bg-gray-200 dark:bg-gray-800" />
                  <div className="mt-2 h-3 w-3/4 bg-gray-200 dark:bg-gray-800 rounded" />
                  <div className="mt-1 h-2 w-1/2 bg-gray-200 dark:bg-gray-800 rounded" />
                </div>
              ))}
            </div>
          ) : media.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {media.map((item) => {
                const Icon = getMediaIcon(item.mime_type);
                const isImage = item.mime_type.startsWith("image/");
                return (
                  <div key={item.id} className="group relative cursor-pointer" onClick={() => handlePreview(item)}>
                    <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200/60 dark:border-white/10 hover:shadow-lg transition-all duration-300">
                      {isImage ? (
                        <img src={getMediaThumbUrl(item.key)} alt={item.filename} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <div className="flex items-center justify-center h-full"><Icon className="size-8 text-gray-400" /></div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex gap-2">
                          <Button size="icon" className="size-8 rounded-full bg-white/90 text-gray-900 hover:bg-white" onClick={(e) => { e.stopPropagation(); handlePreview(item); }}>
                            <Eye className="size-4" />
                          </Button>
                          <Button size="icon" className="size-8 rounded-full bg-white/90 text-gray-900 hover:bg-white" onClick={(e) => { e.stopPropagation(); handleDownload(item); }}>
                            <Download className="size-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 truncate">{item.filename}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{formatFileSize(item.size)}</p>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <Card className="border-0 shadow-sm rounded-2xl dark:bg-gray-900 dark:border dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">File</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Size</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Post</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="size-10 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" /><div className="h-3 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" /></div></td>
                      <td className="px-6 py-4"><div className="h-3 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" /></td>
                      <td className="px-6 py-4"><div className="h-3 w-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" /></td>
                      <td className="px-6 py-4"><div className="h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" /></td>
                      <td className="px-6 py-4"><div className="h-3 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse ml-auto" /></td>
                    </tr>
                  ))
                ) : media.length === 0 ? (
                  <tr><td colSpan={5}><EmptyState /></td></tr>
                ) : (
                  media.map((item) => {
                    const Icon = getMediaIcon(item.mime_type);
                    const isImage = item.mime_type.startsWith("image/");
                    return (
                      <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer" onClick={() => handlePreview(item)}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="size-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                              {isImage ? <img src={getMediaThumbUrl(item.key)} alt={item.filename} className="w-full h-full object-cover" loading="lazy" /> : <div className="flex items-center justify-center h-full"><Icon className="size-5 text-gray-400" /></div>}
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[200px]">{item.filename}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4"><span className="text-sm text-gray-500 dark:text-gray-400">{item.type}</span></td>
                        <td className="px-6 py-4"><span className="text-sm text-gray-500 dark:text-gray-400">{formatFileSize(item.size)}</span></td>
                        <td className="px-6 py-4"><span className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[150px] block">{item.post_title || "—"}</span></td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="size-8 text-gray-400 hover:text-blue-600" onClick={(e) => { e.stopPropagation(); handlePreview(item); }}><Eye className="size-4" /></Button>
                            <Button variant="ghost" size="icon" className="size-8 text-gray-400 hover:text-green-600" onClick={(e) => { e.stopPropagation(); handleDownload(item); }}><Download className="size-4" /></Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Pagination */}
      {meta.total_pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button variant="outline" size="sm" className="rounded-xl" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            <ChevronLeft className="size-4" />
          </Button>
          <span className="text-sm text-gray-500 dark:text-gray-400">Page {page} of {meta.total_pages}</span>
          <Button variant="outline" size="sm" className="rounded-xl" onClick={() => setPage((p) => Math.min(meta.total_pages, p + 1))} disabled={page === meta.total_pages}>
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}

      {/* Preview Modal */}
      {showModal && selectedMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowModal(false)}>
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl bg-white dark:bg-gray-900 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 z-10 size-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors">
              <X className="size-5" />
            </button>
            {selectedMedia.mime_type.startsWith("image/") ? (
              <div className="bg-gray-100 dark:bg-gray-800">
                <img src={getMediaUrl(selectedMedia.key)} alt={selectedMedia.filename} className="w-full max-h-[60vh] object-contain" />
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800">
                {(() => { const Icon = getMediaIcon(selectedMedia.mime_type); return <Icon className="size-16 text-gray-400" />; })()}
              </div>
            )}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{selectedMedia.filename}</h3>
              <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400"><File className="size-4" /><span>{selectedMedia.mime_type}</span></div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400"><HardDrive className="size-4" /><span>{formatFileSize(selectedMedia.size)}</span></div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400"><FileImage className="size-4" /><span>{selectedMedia.type}</span></div>
                {selectedMedia.post_title && <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400"><Calendar className="size-4" /><span className="truncate">{selectedMedia.post_title}</span></div>}
              </div>
              <div className="mt-4 flex gap-3">
                <Button className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleDownload(selectedMedia)}>
                  <Download className="mr-2 size-4" />Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function EmptyState() {
  return (
    <Card className="border-0 shadow-sm rounded-2xl">
      <CardContent className="p-12 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-400">
          <FileImage className="size-6" />
        </div>
        <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">No media files</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Upload files by creating posts with media attachments.</p>
      </CardContent>
    </Card>
  );
}
