"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getBatchDetails } from "@/lib/actions/classroom";
import { useUser } from "@/lib/contexts/user-context";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  ListChecks,
  StickyNote,
  Megaphone,
  MessageSquare,
  ArrowLeft,
  Calendar,
  Loader2,
  GraduationCap,
  BookOpen,
  Clock,
  ChevronRight,
} from "lucide-react";

export default function BatchClassroomLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const pathname = usePathname();
  const user = useUser();
  const batchId = params.id;
  const [batch, setBatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBatchDetails(batchId).then((res) => {
      if (res.success) setBatch(res.data);
      setLoading(false);
    });
  }, [batchId]);

  const base = `/dashboard/batches/${batchId}`;

  const navSections = [
    {
      label: "Classroom",
      items: [
        { title: "Overview", href: base, icon: LayoutDashboard },
        { title: "Attendance", href: `${base}/attendance`, icon: ClipboardCheck },
        { title: "Tasks", href: `${base}/tasks`, icon: ListChecks },
        { title: "Daily Notes", href: `${base}/notes`, icon: StickyNote },
      ],
    },
    {
      label: "Communication",
      items: [
        { title: "Announcements", href: `${base}/announcements`, icon: Megaphone },
        { title: "Group Chat", href: `${base}/chat`, icon: MessageSquare },
      ],
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="size-8 animate-spin text-[#0066FF]" />
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-[calc(100vh-80px)] -mx-4 -my-4 sm:-mx-6 sm:-my-6 lg:-mx-8 lg:-my-8">
      {/* ── Left Sidebar ── */}
      <aside className="w-[260px] shrink-0 border-r border-gray-100 dark:border-gray-800 bg-white dark:bg-[#111118] flex flex-col overflow-hidden">
        {/* Back Button + Batch Info */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <Link
            href={user?.role === "TEACHER" ? "/dashboard/batches" : "/dashboard/enrollments"}
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-[#0066FF] transition-colors mb-4"
          >
            <ArrowLeft className="size-3.5" /> Back to {user?.role === "TEACHER" ? "Batches" : "Enrollments"}
          </Link>

          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-gradient-to-br from-[#0066FF] to-blue-700 flex items-center justify-center shrink-0">
              <GraduationCap className="size-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                {batch?.name || "Batch"}
              </h2>
              <p className="text-[11px] text-gray-500 truncate">
                {batch?.service?.title}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-blue-50/60 dark:bg-blue-900/10 p-2.5 text-center">
            <p className="text-lg font-bold text-[#0066FF]">{batch?.enrolled_count ?? 0}</p>
            <p className="text-[10px] text-gray-500 font-medium">Students</p>
          </div>
          <div className="rounded-lg bg-emerald-50/60 dark:bg-emerald-900/10 p-2.5 text-center">
            <p className="text-lg font-bold text-emerald-600">{batch?.schedule?.length ?? 0}</p>
            <p className="text-[10px] text-gray-500 font-medium">Days/Wk</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-5">
          {navSections.map((section) => (
            <div key={section.label}>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.title}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                        isActive
                          ? "bg-[#0066FF]/10 text-[#0066FF] font-semibold"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    >
                      <item.icon className={`size-4 ${isActive ? "text-[#0066FF]" : ""}`} />
                      <span className="flex-1">{item.title}</span>
                      {isActive && <ChevronRight className="size-3.5 text-[#0066FF]/60" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Status Badge */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <div className={`flex items-center gap-2 rounded-xl px-3 py-2.5 ${
            batch?.status === "ONGOING"
              ? "bg-green-50 dark:bg-green-900/10"
              : batch?.status === "UPCOMING"
                ? "bg-amber-50 dark:bg-amber-900/10"
                : "bg-gray-50 dark:bg-gray-800"
          }`}>
            <div className={`size-2 rounded-full ${
              batch?.status === "ONGOING" ? "bg-green-500 animate-pulse" 
                : batch?.status === "UPCOMING" ? "bg-amber-500" 
                : "bg-gray-400"
            }`} />
            <span className={`text-xs font-semibold capitalize ${
              batch?.status === "ONGOING" ? "text-green-700 dark:text-green-400" 
                : batch?.status === "UPCOMING" ? "text-amber-700 dark:text-amber-400" 
                : "text-gray-500"
            }`}>
              {batch?.status?.toLowerCase() ?? "unknown"}
            </span>
            {batch?.schedule?.[0] && (
              <span className="ml-auto text-[10px] text-gray-400 flex items-center gap-1">
                <Clock className="size-3" /> {batch.schedule[0].start_time}
              </span>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 min-w-0 overflow-y-auto bg-[#F8F9FB] dark:bg-[#0D0D12]">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
