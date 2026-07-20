"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft, ChevronRight, Search, Link2, Plus, Trash2, X,
  Loader2, User, Users, Mail, Phone, Bell, FileText, BarChart3, Check,
} from "lucide-react";
import { toast } from "sonner";
import {
  getGuardianLinks, createGuardianLink, removeGuardianLink,
  getAdminUsers,
} from "@/lib/actions/admin";

interface GuardianLink {
  id: string;
  status: string;
  relation_label: string | null;
  initiated_by: string;
  created_at: string;
  responded_at: string | null;
  guardian: {
    id: string;
    user: { id: string; full_name: string; email: string; phone?: string | null; avatar?: { key: string } | null };
  };
  student: {
    id: string;
    user: { id: string; full_name: string; email: string; phone?: string | null; avatar?: { key: string } | null };
  };
}

interface UserOption {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  role: string;
  avatar?: { url: string } | null;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: "Active", color: "bg-green-50 text-green-600 border border-green-200" },
  PENDING: { label: "Pending", color: "bg-amber-50 text-amber-600 border border-amber-200" },
  REMOVED: { label: "Removed", color: "bg-red-50 text-red-600 border border-red-200" },
};

export function AdminGuardianLinksContent() {
  const [links, setLinks] = useState<GuardianLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, total_pages: 0 });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);

  // Modal form
  const [guardians, setGuardians] = useState<UserOption[]>([]);
  const [students, setStudents] = useState<UserOption[]>([]);
  const [searchGuardian, setSearchGuardian] = useState("");
  const [searchStudent, setSearchStudent] = useState("");
  const [selectedGuardian, setSelectedGuardian] = useState<UserOption | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<UserOption | null>(null);
  const [relationLabel, setRelationLabel] = useState("Father");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: "20" });
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      const res = await getGuardianLinks(params.toString());
      if (res.success) {
        setLinks(res.data);
        setMeta(res.meta || { total: 0, total_pages: 0 });
      } else {
        toast.error(res.error || "Failed to load links");
      }
    } catch {} finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => { load(page); }, [page, load]);

  const searchUsers = async (query: string, role: string, setter: (users: UserOption[]) => void) => {
    if (query.length < 2) { setter([]); return; }
    try {
      const params = new URLSearchParams({ page: "1", limit: "10", search: query, role });
      const res = await getAdminUsers(params.toString());
      if (res.success) setter(res.data || []);
    } catch {}
  };

  useEffect(() => {
    const t = setTimeout(() => searchUsers(searchGuardian, "GUARDIAN", setGuardians), 300);
    return () => clearTimeout(t);
  }, [searchGuardian]);

  useEffect(() => {
    const t = setTimeout(() => searchUsers(searchStudent, "STUDENT", setStudents), 300);
    return () => clearTimeout(t);
  }, [searchStudent]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGuardian || !selectedStudent) {
      toast.error("Please select both a guardian and a student");
      return;
    }
    setSubmitting(true);
    try {
      const res = await createGuardianLink(selectedGuardian.id, selectedStudent.id, relationLabel);
      if (res.success) {
        toast.success("Guardian linked to student successfully");
        resetForm();
        load(page);
      } else {
        toast.error(res.error || "Failed to create link");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Remove this link?")) return;
    setRemoving(id);
    try {
      const res = await removeGuardianLink(id);
      if (res.success) {
        toast.success("Link removed");
        load(page);
      } else {
        toast.error(res.error || "Failed to remove link");
      }
    } finally {
      setRemoving(null);
    }
  };

  const resetForm = () => {
    setShowModal(false);
    setSelectedGuardian(null);
    setSelectedStudent(null);
    setSearchGuardian("");
    setSearchStudent("");
    setRelationLabel("Father");
    setGuardians([]);
    setStudents([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Guardian Links</h1>
          <p className="mt-1 text-sm text-gray-500">Directly connect guardians with students</p>
        </div>
        <Button className="rounded-xl gap-2" onClick={() => setShowModal(true)}>
          <Plus className="size-4" /> Link Guardian
        </Button>
      </div>

      {/* Filters */}
      <Card className="border border-gray-100 dark:border-gray-800 rounded-[20px]">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && setPage(1)}
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Links List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="border border-gray-100 dark:border-gray-800 rounded-[16px]">
              <CardContent className="p-4 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div className="h-2 w-48 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : links.length === 0 ? (
        <Card className="border border-gray-100 dark:border-gray-800 rounded-[24px]">
          <CardContent className="p-16 text-center">
            <Link2 className="size-12 text-gray-300 dark:text-gray-600 mx-auto" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No links found</h3>
            <p className="mt-2 text-sm text-gray-500">Create guardian-student connections using the button above.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {links.map((link) => {
            const status = statusConfig[link.status] || statusConfig.ACTIVE;
            return (
              <Card key={link.id} className="border border-gray-100 dark:border-gray-800 rounded-[16px] hover:shadow-sm transition-shadow">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="size-10 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 flex items-center justify-center shrink-0">
                      <span className="text-xs font-medium text-blue-600">{link.guardian.user.full_name.charAt(0)}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{link.guardian.user.full_name}</p>
                      <p className="text-xs text-gray-500 truncate">{link.guardian.user.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1 shrink-0 px-3">
                    <Link2 className="size-4 text-gray-400" />
                    <span className="text-[10px] font-medium text-gray-400">{link.relation_label}</span>
                  </div>
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="size-10 rounded-full bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 flex items-center justify-center shrink-0">
                      <span className="text-xs font-medium text-green-600">{link.student.user.full_name.charAt(0)}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{link.student.user.full_name}</p>
                      <p className="text-xs text-gray-500 truncate">{link.student.user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${status.color}`}>
                      {status.label}
                    </span>
                    <button
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/50 text-gray-400 hover:text-red-600 transition-colors"
                      onClick={() => handleRemove(link.id)}
                      disabled={removing === link.id}
                    >
                      {removing === link.id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {meta.total_pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button variant="outline" size="sm" className="rounded-full" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            <ChevronLeft className="size-4" />
          </Button>
          <span className="text-sm text-gray-500">Page {page} of {meta.total_pages}</span>
          <Button variant="outline" size="sm" className="rounded-full" onClick={() => setPage((p) => Math.min(meta.total_pages, p + 1))} disabled={page === meta.total_pages}>
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          LINK MODAL — Exact reference design
         ═══════════════════════════════════════════════════════ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={resetForm} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-[800px] max-h-[90vh] overflow-y-auto">

            {/* Header */}
            <div className="px-8 pt-6 pb-4">
              <div className="flex items-start gap-4">
                <div className="flex size-12 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/50 shrink-0">
                  <Link2 className="size-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Link Guardian to Student</h2>
                  <p className="text-sm text-gray-500 mt-0.5">Create a direct relationship between guardian and student</p>
                </div>
              </div>
            </div>

            <div className="px-8 pb-6">
              {/* Two Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-0 items-start mb-6">

                {/* ── Guardian Column ── */}
                <div className="pr-4">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Guardian</p>
                  <p className="text-xs text-gray-500 mb-3">Search and select a guardian</p>

                  {!selectedGuardian ? (
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by name, email or phone..."
                        value={searchGuardian}
                        onChange={(e) => setSearchGuardian(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {guardians.length > 0 && (
                        <div className="absolute z-20 top-full mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-56 overflow-auto">
                          {guardians.map((u) => (
                            <button key={u.id} type="button"
                              onClick={() => { setSelectedGuardian(u); setSearchGuardian(""); setGuardians([]); }}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-left transition-colors">
                              <div className="size-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 flex items-center justify-center shrink-0">
                                <span className="text-sm font-bold text-blue-600">{u.full_name.charAt(0)}</span>
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{u.full_name}</p>
                                <p className="text-xs text-gray-500 truncate">{u.email}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Selected Guardian</p>
                  )}

                  {selectedGuardian && (
                    <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border-2 border-blue-200 dark:border-blue-800 relative mt-2">
                      <button type="button"
                        onClick={() => { setSelectedGuardian(null); setGuardians([]); }}
                        className="absolute top-3 right-3 size-6 rounded-full bg-green-500 flex items-center justify-center">
                        <Check className="size-3.5 text-white" />
                      </button>
                      <div className="flex items-center gap-3">
                        <div className="size-14 rounded-full bg-gradient-to-br from-blue-200 to-indigo-200 dark:from-blue-700 dark:to-indigo-700 flex items-center justify-center shrink-0">
                          <span className="text-lg font-bold text-blue-700 dark:text-blue-200">{selectedGuardian.full_name.charAt(0)}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{selectedGuardian.full_name}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                            <Mail className="size-3" /> {selectedGuardian.email}
                          </p>
                          {selectedGuardian.phone && (
                            <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                              <Phone className="size-3" /> {selectedGuardian.phone}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="mt-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400">
                          <span className="size-1.5 rounded-full bg-green-500" />
                          Active Guardian
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Center Link Icon ── */}
                <div className="flex flex-col items-center justify-center pt-12 px-2">
                  <div className="flex size-12 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/50 border-2 border-dashed border-blue-300 dark:border-blue-700">
                    <Link2 className="size-5 text-blue-500" />
                  </div>
                </div>

                {/* ── Student Column ── */}
                <div className="pl-4">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Student</p>
                  <p className="text-xs text-gray-500 mb-3">Search and select a student</p>

                  {!selectedStudent ? (
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by name, email or phone..."
                        value={searchStudent}
                        onChange={(e) => setSearchStudent(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {students.length > 0 && (
                        <div className="absolute z-20 top-full mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-56 overflow-auto">
                          {students.map((u) => (
                            <button key={u.id} type="button"
                              onClick={() => { setSelectedStudent(u); setSearchStudent(""); setStudents([]); }}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-left transition-colors">
                              <div className="size-10 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 flex items-center justify-center shrink-0">
                                <span className="text-sm font-bold text-green-600">{u.full_name.charAt(0)}</span>
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{u.full_name}</p>
                                <p className="text-xs text-gray-500 truncate">{u.email}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Selected Student</p>
                  )}

                  {selectedStudent && (
                    <div className="p-4 rounded-2xl bg-green-50/60 dark:bg-green-950/20 border-2 border-green-200 dark:border-green-800 relative mt-2">
                      <button type="button"
                        onClick={() => { setSelectedStudent(null); setStudents([]); }}
                        className="absolute top-3 right-3 size-6 rounded-full bg-green-500 flex items-center justify-center">
                        <Check className="size-3.5 text-white" />
                      </button>
                      <div className="flex items-center gap-3">
                        <div className="size-14 rounded-full bg-gradient-to-br from-green-200 to-emerald-200 dark:from-green-700 dark:to-emerald-700 flex items-center justify-center shrink-0">
                          <span className="text-lg font-bold text-green-700 dark:text-green-200">{selectedStudent.full_name.charAt(0)}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{selectedStudent.full_name}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                            <Mail className="size-3" /> {selectedStudent.email}
                          </p>
                          {selectedStudent.phone && (
                            <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                              <Phone className="size-3" /> {selectedStudent.phone}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="mt-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400">
                          <span className="size-1.5 rounded-full bg-green-500" />
                          Active Student
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Relationship + Permissions Row ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Relationship */}
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white mb-3">Relationship</p>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <select
                      value={relationLabel}
                      onChange={(e) => setRelationLabel(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                    >
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Brother">Brother</option>
                      <option value="Sister">Sister</option>
                      <option value="Uncle">Uncle</option>
                      <option value="Aunt">Aunt</option>
                      <option value="Grandfather">Grandfather</option>
                      <option value="Grandmother">Grandmother</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Permissions */}
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white mb-3">Permissions for Guardian</p>
                  <div className="space-y-2.5">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="flex size-5 items-center justify-center rounded-md bg-blue-500 text-white shrink-0">
                        <Check className="size-3" />
                      </div>
                      <Bell className="size-4 text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">Receive attendance updates</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="flex size-5 items-center justify-center rounded-md bg-blue-500 text-white shrink-0">
                        <Check className="size-3" />
                      </div>
                      <FileText className="size-4 text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">Receive fee notifications</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="flex size-5 items-center justify-center rounded-md bg-blue-500 text-white shrink-0">
                        <Check className="size-3" />
                      </div>
                      <BarChart3 className="size-4 text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">View academic progress</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* ── Relationship Preview ── */}
              {selectedGuardian && selectedStudent && (
                <div className="rounded-2xl border-2 border-dashed border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-950/20 p-5 mb-6">
                  <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-4">Relationship Preview</p>
                  <div className="flex items-center justify-center gap-6">
                    {/* Guardian */}
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-full bg-gradient-to-br from-blue-200 to-indigo-200 dark:from-blue-700 dark:to-indigo-700 flex items-center justify-center">
                        <span className="text-base font-bold text-blue-700 dark:text-blue-200">{selectedGuardian.full_name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{selectedGuardian.full_name}</p>
                        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400">
                          <span className="size-1 rounded-full bg-blue-500" />
                          Guardian
                        </span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex flex-col items-center">
                      <p className="text-xs font-bold text-blue-600 mb-1">{relationLabel} of</p>
                      <svg className="size-6 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                      </svg>
                    </div>

                    {/* Student */}
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-full bg-gradient-to-br from-green-200 to-emerald-200 dark:from-green-700 dark:to-emerald-700 flex items-center justify-center">
                        <span className="text-base font-bold text-green-700 dark:text-green-200">{selectedStudent.full_name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{selectedStudent.full_name}</p>
                        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400">
                          <span className="size-1 rounded-full bg-green-500" />
                          Student
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Footer ── */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <Button type="button" variant="outline" className="rounded-xl px-6" onClick={resetForm}>
                  Cancel
                </Button>
                <div className="flex-1" />
                <Button
                  type="button"
                  className="rounded-xl px-6 gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleCreate}
                  disabled={submitting || !selectedGuardian || !selectedStudent}
                >
                  {submitting ? <Loader2 className="size-4 animate-spin" /> : <Link2 className="size-4" />}
                  Link Guardian to Student
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
