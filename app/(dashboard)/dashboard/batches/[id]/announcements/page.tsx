"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getAnnouncements, createAnnouncement } from "@/lib/actions/classroom";
import { useUser } from "@/lib/contexts/user-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Megaphone, CalendarDays, X, Pin } from "lucide-react";
import { toast } from "sonner";

export default function BatchAnnouncementsTab() {
  const { id } = useParams<{ id: string }>();
  const user = useUser();
  const isTeacher = user?.role === "TEACHER";

  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", body: "" });

  const fetchAnnouncements = async () => {
    const res = await getAnnouncements(id);
    if (res.success) setAnnouncements(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchAnnouncements(); }, [id]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) return;
    setSaving(true);
    const res = await createAnnouncement(id, form);
    if (res.success) {
      toast.success("Announcement published!");
      setForm({ title: "", body: "" });
      setShowForm(false);
      fetchAnnouncements();
    } else {
      toast.error(res.message || "Failed to create announcement");
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
          <Megaphone className="size-4 text-[#0066FF]" /> Announcements
        </h3>
        {isTeacher && !showForm && (
          <Button size="sm" onClick={() => setShowForm(true)} className="bg-[#0066FF] hover:bg-blue-600 text-white rounded-lg h-8 text-xs font-semibold">
            <Plus className="size-3.5 mr-1" /> New Announcement
          </Button>
        )}
      </div>

      {/* Create Form */}
      {showForm && (
        <form onSubmit={handleCreate} className="rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-900/10 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Pin className="size-3.5 text-amber-500" /> Broadcast a Message
            </h4>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <X className="size-4" />
            </button>
          </div>
          <div>
            <Label className="text-xs">Title *</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="e.g. Schedule Change Notice"
              className="mt-1 h-9"
              required
            />
          </div>
          <div>
            <Label className="text-xs">Message *</Label>
            <Textarea
              value={form.body}
              onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))}
              placeholder="Write your announcement here. All enrolled students will see this..."
              className="mt-1 min-h-[120px]"
              required
            />
          </div>
          <Button type="submit" disabled={saving} className="bg-[#0066FF] hover:bg-blue-600 text-white h-9 rounded-lg text-xs font-semibold">
            {saving && <Loader2 className="mr-1.5 size-3.5 animate-spin" />}
            Publish Announcement
          </Button>
        </form>
      )}

      {/* Announcement List */}
      {announcements.length === 0 ? (
        <div className="text-center py-16">
          <div className="size-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
            <Megaphone className="size-7 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">No announcements yet.</p>
          {isTeacher && (
            <p className="text-xs text-gray-400 mt-1">Post an announcement to notify all enrolled students.</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((ann: any, i: number) => (
            <div
              key={ann.id}
              className={`rounded-xl border p-5 transition-colors ${
                i === 0
                  ? "border-amber-200 dark:border-amber-800/50 bg-amber-50/30 dark:bg-amber-900/5"
                  : "border-gray-100 dark:border-gray-800"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <Megaphone className="size-4 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">{ann.title}</h4>
                    <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                      <CalendarDays className="size-3" />
                      {new Date(ann.created_at).toLocaleDateString("en-BD", {
                        day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                {i === 0 && (
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full shrink-0">
                    LATEST
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed pl-10">
                {ann.body}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
