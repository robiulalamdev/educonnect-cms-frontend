"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "@/lib/contexts/user-context";
import { getTaskList, getMyTasks } from "@/lib/actions/modules";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2, CheckCircle, Clock, FileText, AlertCircle } from "lucide-react";

interface Task {
  id: string; title: string; description?: string; status: string;
  due_date?: string; created_at: string;
  batch?: { name: string };
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  PENDING: { label: "Pending", color: "bg-amber-50 text-amber-600", icon: Clock },
  IN_PROGRESS: { label: "In Progress", color: "bg-blue-50 text-blue-600", icon: AlertCircle },
  COMPLETED: { label: "Completed", color: "bg-green-50 text-green-600", icon: CheckCircle },
  SUBMITTED: { label: "Submitted", color: "bg-purple-50 text-purple-600", icon: CheckCircle },
};

export function TasksContent() {
  const user = useUser();
  const isStudent = user?.role === "STUDENT";
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, total_pages: 0 });

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = (isStudent ? getMyTasks(p, 20) : getTaskList(p, 20)) as any;
      const data = await res;
      if (data.success) { setTasks(data.data); setMeta(data.meta); }
    } catch { }
    finally { setLoading(false); }
  }, [isStudent]);

  useEffect(() => { load(page); }, [page, load]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Tasks</h1>
        <p className="mt-1 text-sm text-gray-500">
          {isStudent ? "View your assignments" : "Manage class assignments"}
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="border border-gray-100 dark:border-gray-800 rounded-[20px]">
              <CardContent className="p-5 animate-pulse">
                <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded-full mb-2" />
                <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <Card className="border border-gray-100 dark:border-gray-800 rounded-[24px]">
          <CardContent className="p-16 text-center">
            <FileText className="size-12 text-gray-300 dark:text-gray-600 mx-auto" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No tasks yet</h3>
            <p className="mt-2 text-sm text-gray-500">
              {isStudent ? "No assignments have been posted." : "Create tasks for your batches."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => {
            const config = statusConfig[task.status] || statusConfig.PENDING;
            const Icon = config.icon;
            return (
              <Card key={task.id} className="border border-gray-100 dark:border-gray-800 rounded-[20px] hover:shadow-sm transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`flex size-10 items-center justify-center rounded-xl ${config.color} shrink-0`}>
                      <Icon className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-[15px] font-semibold text-gray-900 dark:text-white">{task.title}</h3>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${config.color}`}>{config.label}</span>
                      </div>
                      {task.description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{task.description}</p>}
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                        {task.batch?.name && <span>📁 {task.batch.name}</span>}
                        {task.due_date && <span>📅 Due: {new Date(task.due_date).toLocaleDateString()}</span>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
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
