"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getTaskList, createTask } from "@/lib/actions/classroom";
import { useUser } from "@/lib/contexts/user-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, ListChecks, CalendarDays, X } from "lucide-react";
import { toast } from "sonner";

export default function BatchTasksTab() {
  const { id } = useParams<{ id: string }>();
  const user = useUser();
  const isTeacher = user?.role === "TEACHER";

  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", due_date: "" });

  const fetchTasks = async () => {
    const res = await getTaskList(id);
    if (res.success) setTasks(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchTasks(); }, [id]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    const res = await createTask(id, {
      title: form.title,
      description: form.description || undefined,
      due_date: form.due_date || undefined,
    });
    if (res.success) {
      toast.success("Task created!");
      setForm({ title: "", description: "", due_date: "" });
      setShowForm(false);
      fetchTasks();
    } else {
      toast.error(res.message || "Failed to create task");
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <ListChecks className="size-4 text-[#0066FF]" />
          Tasks & Homework
        </h3>
        {isTeacher && !showForm && (
          <Button
            size="sm"
            onClick={() => setShowForm(true)}
            className="bg-[#0066FF] hover:bg-blue-600 text-white rounded-lg h-8 text-xs font-semibold"
          >
            <Plus className="size-3.5 mr-1" /> Add Task
          </Button>
        )}
      </div>

      {/* Create Form */}
      {showForm && (
        <form onSubmit={handleCreate} className="rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-900/10 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">New Task</h4>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <X className="size-4" />
            </button>
          </div>
          <div>
            <Label className="text-xs">Title *</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="e.g. Chapter 5 Exercises"
              className="mt-1 h-9"
              required
            />
          </div>
          <div>
            <Label className="text-xs">Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Optional details..."
              className="mt-1 min-h-[80px]"
            />
          </div>
          <div>
            <Label className="text-xs">Due Date</Label>
            <Input
              type="date"
              value={form.due_date}
              onChange={(e) => setForm((p) => ({ ...p, due_date: e.target.value }))}
              className="mt-1 h-9 w-auto"
            />
          </div>
          <Button type="submit" disabled={saving} className="bg-[#0066FF] hover:bg-blue-600 text-white h-9 rounded-lg text-xs font-semibold">
            {saving && <Loader2 className="mr-1.5 size-3.5 animate-spin" />}
            Create Task
          </Button>
        </form>
      )}

      {/* Task List */}
      {tasks.length === 0 ? (
        <div className="text-center py-16">
          <div className="size-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
            <ListChecks className="size-7 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">No tasks assigned yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task: any) => (
            <div key={task.id} className="rounded-xl border border-gray-100 dark:border-gray-800 p-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{task.title}</h4>
                  {task.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                  )}
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                  task.status === "ACTIVE" ? "bg-blue-50 text-blue-600"
                    : task.status === "COMPLETED" ? "bg-green-50 text-green-600"
                    : "bg-gray-100 text-gray-500"
                }`}>
                  {task.status}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-3 text-[11px] text-gray-400">
                <span className="flex items-center gap-1">
                  <CalendarDays className="size-3" />
                  Created {new Date(task.created_at).toLocaleDateString()}
                </span>
                {task.due_date && (
                  <span className="flex items-center gap-1 text-amber-500 font-medium">
                    <CalendarDays className="size-3" />
                    Due {new Date(task.due_date).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
