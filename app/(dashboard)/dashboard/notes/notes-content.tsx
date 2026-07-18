"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "@/lib/contexts/user-context";
import { getDailyNoteList, getMyNotes } from "@/lib/actions/modules";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, FileText, BookOpen } from "lucide-react";

interface DailyNote {
  id: string; title: string; content: string; created_at: string;
  batch?: { name: string };
  teacher?: { user?: { full_name: string } };
}

export function NotesContent() {
  const user = useUser();
  const isStudent = user?.role === "STUDENT";
  const [notes, setNotes] = useState<DailyNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, total_pages: 0 });

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = (isStudent ? getMyNotes(p, 20) : getDailyNoteList(p, 20)) as any;
      const data = await res;
      if (data.success) { setNotes(data.data); setMeta(data.meta); }
    } catch { }
    finally { setLoading(false); }
  }, [isStudent]);

  useEffect(() => { load(page); }, [page, load]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Daily Notes</h1>
        <p className="mt-1 text-sm text-gray-500">
          {isStudent ? "View notes from your teachers" : "Manage class daily notes"}
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border border-gray-100 dark:border-gray-800 rounded-[20px]">
              <CardContent className="p-5 animate-pulse">
                <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded-full mb-2" />
                <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : notes.length === 0 ? (
        <Card className="border border-gray-100 dark:border-gray-800 rounded-[24px]">
          <CardContent className="p-16 text-center">
            <BookOpen className="size-12 text-gray-300 dark:text-gray-600 mx-auto" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No notes yet</h3>
            <p className="mt-2 text-sm text-gray-500">
              {isStudent ? "No daily notes posted yet." : "Create daily notes for your batches."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <Card key={note.id} className="border border-gray-100 dark:border-gray-800 rounded-[20px] hover:shadow-sm transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 shrink-0">
                    <FileText className="size-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-semibold text-gray-900 dark:text-white">{note.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-3">{note.content?.replace(/<[^>]*>/g, "").slice(0, 200)}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      {note.batch?.name && <span>📁 {note.batch.name}</span>}
                      {note.teacher?.user?.full_name && <span>👨‍🏫 {note.teacher.user.full_name}</span>}
                      <span>{new Date(note.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {meta.total_pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button variant="outline" size="sm" className="rounded-full" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft className="size-4" /></Button>
          <span className="text-sm text-gray-500">Page {page} of {meta.total_pages}</span>
          <Button variant="outline" size="sm" className="rounded-full" onClick={() => setPage((p) => Math.min(meta.total_pages, p + 1))} disabled={page === meta.total_pages}><ChevronRight className="size-4" /></Button>
        </div>
      )}
    </div>
  );
}
