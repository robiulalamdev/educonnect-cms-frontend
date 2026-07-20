"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, Clock, GraduationCap, Mail, Phone, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getAdminTeachers, approveTeacherAction, rejectTeacherAction } from "@/lib/actions/admin";

interface Teacher {
  id: string;
  full_name: string;
  email: string;
  status: string;
  is_email_verified: boolean;
  is_approved: boolean;
  created_at: string;
  phone?: string;
  city?: string;
  country?: string;
  avatar?: { url: string } | null;
  teacher_profile?: {
    tagline?: string;
    experience_years?: number;
    qualifications?: string;
  };
}

export function AdminTeachersContent() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, total_pages: 0 });
  const [tab, setTab] = useState<"pending" | "approved" | "all">("pending");

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: "20" });
      if (tab === "pending") params.set("status", "PENDING_APPROVAL");
      else if (tab === "approved") params.set("is_approved", "true");

      const res = await getAdminTeachers(params.toString());
      if (res.success) {
        setTeachers(res.data);
        setMeta(res.meta || { total: 0, total_pages: 0 });
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => { load(page); }, [page, load]);

  const handleApprove = async (teacherId: string) => {
    setApproving(teacherId);
    try {
      const res = await approveTeacherAction(teacherId);
      if (res.success) {
        toast.success("Teacher approved successfully");
        load(page);
      } else {
        toast.error(res.error || res.message || "Failed to approve teacher");
      }
    } catch {
      toast.error("Failed to approve teacher");
    } finally {
      setApproving(null);
    }
  };

  const handleReject = async (teacherId: string) => {
    setApproving(teacherId);
    try {
      const res = await rejectTeacherAction(teacherId);
      if (res.success) {
        toast.success("Teacher rejected");
        load(page);
      } else {
        toast.error(res.error || res.message || "Failed to reject teacher");
      }
    } catch {
      toast.error("Failed to reject teacher");
    } finally {
      setApproving(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Teacher Approvals</h1>
        <p className="mt-1 text-sm text-gray-500">Review and approve teacher applications</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(["pending", "approved", "all"] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setPage(1); }}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
              tab === t
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)} {t === "pending" && meta.total > 0 ? `(${meta.total})` : ""}
          </button>
        ))}
      </div>

      {/* Teachers List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="border border-gray-100 dark:border-gray-800 rounded-[20px]">
              <CardContent className="p-6 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="size-14 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div className="h-3 w-64 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div className="h-3 w-48 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : teachers.length === 0 ? (
        <Card className="border border-gray-100 dark:border-gray-800 rounded-[24px]">
          <CardContent className="p-16 text-center">
            <GraduationCap className="size-12 text-gray-300 dark:text-gray-600 mx-auto" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No teachers found</h3>
            <p className="mt-2 text-sm text-gray-500">
              {tab === "pending" ? "All teachers have been reviewed." : "No teachers match your filter."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {teachers.map((teacher) => (
            <Card key={teacher.id} className="border border-gray-100 dark:border-gray-800 rounded-[20px] hover:shadow-sm transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="size-14 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                    {teacher.avatar?.url ? (
                      <img src={teacher.avatar.url} alt={teacher.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-lg font-medium">
                        {teacher.full_name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">{teacher.full_name}</h3>
                      {teacher.is_email_verified && (
                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-green-50 text-green-600">
                          Email Verified
                        </span>
                      )}
                      {teacher.is_approved && (
                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-blue-50 text-blue-600">
                          Approved
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                      <Mail className="size-3" /> {teacher.email}
                    </p>
                    {teacher.phone && (
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                        <Phone className="size-3" /> {teacher.phone}
                      </p>
                    )}
                    {(teacher.city || teacher.country) && (
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="size-3" /> {[teacher.city, teacher.country].filter(Boolean).join(", ")}
                      </p>
                    )}
                    {teacher.teacher_profile?.tagline && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic">&quot;{teacher.teacher_profile.tagline}&quot;</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      {teacher.teacher_profile?.experience_years && (
                        <span>{teacher.teacher_profile.experience_years} years experience</span>
                      )}
                      {teacher.teacher_profile?.qualifications && (
                        <span>{teacher.teacher_profile.qualifications}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {!teacher.is_approved && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        className="rounded-full bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleApprove(teacher.id)}
                        disabled={approving === teacher.id}
                      >
                        {approving === teacher.id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <><CheckCircle className="size-4 mr-1" /> Approve</>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleReject(teacher.id)}
                        disabled={approving === teacher.id}
                      >
                        <XCircle className="size-4 mr-1" /> Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta.total_pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button variant="outline" size="sm" className="rounded-full" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            <ChevronLeft className="size-4" />
          </Button>
          <span className="text-sm text-gray-500">Page {page} of {meta.total_pages}</span>
          <Button variant="outline" size="sm" className="rounded-full" onClick={() => setPage((p) => Math.min(meta.total_pages, p + 1))} disabled={page === meta.total_pages}>
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
