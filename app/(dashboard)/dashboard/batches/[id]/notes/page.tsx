"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getDailyNotes, createDailyNote } from "@/lib/actions/classroom";
import { useUser } from "@/lib/contexts/user-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, StickyNote, CalendarDays, ArrowRight, X } from "lucide-react";
import { toast } from "sonner";

export default function BatchNotesTab() {
  const { id } = useParams<{ id: string }>();
  const user = useUser();
  const isTeacher = user?.role === "TEACHER";

  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ note_date: new Date().toISOString().split("T")[0], title: "", content: "", next_day_plan: "" });

  const fetchNotes = async () => {
    const res = await getDailyNotes(id);
    if (res.success) setNotes(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchNotes(); }, [id]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.content.trim()) return;
    setSaving(true);
    const res = await createDailyNote(id, {
      note_date: form.note_date,
      title: form.title || undefined,
      content: form.content,
      next_day_plan: form.next_day_plan || undefined,
    });
    if (res.success) {
      toast.success("Note published!");
      setForm({ note_date: new Date().toISOString().split("T")[0], title: "", content: "", next_day_plan: "" });
      setShowForm(false);
      fetchNotes();
    } else {
      toast.error(res.message || "Failed to create note");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-6 animate-spin text-[#0066FF]" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <StickyNote className="size-4 text-[#0066FF]" /> Daily Notes
        </h3>
        {isTeacher && !showForm && (
          <Button size="sm" onClick={() => setShowForm(true)} className="bg-[#0066FF] hover:bg-blue-600 text-white rounded-lg h-8 text-xs font-semibold">
            <Plus className="size-3.5 mr-1" /> Add Note
          </Button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-900/10 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">New Daily Note</h4>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <X className="size-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs">Date *</Label>
              <Input type="date" value={form.note_date} onChange={(e) => setForm((p) => ({ ...p, note_date: e.target.value }))} className="mt-1 h-9" required />
            </div>
            <div>
              <Label className="text-xs">Title</Label>
              <Input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Algebra II" className="mt-1 h-9" />
            </div>
          </div>
          <div>
            <Label className="text-xs">What was covered today *</Label>
            <Textarea value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} placeholder="Today we learned..." className="mt-1 min-h-[100px]" required />
          </div>
          <div>
            <Label className="text-xs">Next Class Plan</Label>
            <Textarea value={form.next_day_plan} onChange={(e) => setForm((p) => ({ ...p, next_day_plan: e.target.value }))} placeholder="Next class we will cover..." className="mt-1 min-h-[60px]" />
          </div>
          <Button type="submit" disabled={saving} className="bg-[#0066FF] hover:bg-blue-600 text-white h-9 rounded-lg text-xs font-semibold">
            {saving && <Loader2 className="mr-1.5 size-3.5 animate-spin" />}
            Publish Note
          </Button>
        </form>
      )}

      {notes.length === 0 ? (
        <div className="text-center py-16">
          <div className="size-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
            <StickyNote className="size-7 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">No daily notes posted yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((note: any) => (
            <div key={note.id} className="rounded-xl border border-gray-100 dark:border-gray-800 p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-violet-50 dark:bg-violet-900/20 text-violet-600 px-2 py-0.5 rounded-full">
                  <CalendarDays className="size-3" />
                  {new Date(note.note_date).toLocaleDateString("en-BD", { day: "numeric", month: "short", year: "numeric" })}
                </span>
                {note.title && (
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{note.title}</span>
                )}
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{note.content}</p>
              {note.next_day_plan && (
                <div className="mt-4 rounded-lg bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 p-3">
                  <p className="text-[11px] font-semibold text-emerald-600 mb-1 flex items-center gap-1">
                    <ArrowRight className="size-3" /> Next Class
                  </p>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400">{note.next_day_plan}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
