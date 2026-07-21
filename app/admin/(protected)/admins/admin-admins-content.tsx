"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft, ChevronRight, Search, Shield, Plus, Pencil, Trash2,
  X, Loader2, Upload, Eye, EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { getAdminAdmins, registerAdminAction, deleteAdminAction, updateAdminAction } from "@/lib/actions/admin";

interface Admin {
  id: string;
  full_name: string;
  email: string;
  role: string;
  status: string;
  last_login: string | null;
  created_at: string;
  avatar?: { url: string } | null;
}

const roleConfig: Record<string, { label: string; color: string }> = {
  SUPER_ADMIN: { label: "SUPER ADMIN", color: "bg-red-50 text-red-600 border border-red-200" },
  ADMIN: { label: "ADMIN", color: "bg-blue-50 text-blue-600 border border-blue-200" },
  MODERATOR: { label: "MODERATOR", color: "bg-amber-50 text-amber-600 border border-amber-200" },
};

const statusConfig: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: "Active", color: "bg-green-50 text-green-600 border border-green-200" },
  INACTIVE: { label: "Inactive", color: "bg-gray-50 text-gray-600 border border-gray-200" },
};

export function AdminAdminsContent() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, total_pages: 0 });
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Add Admin form
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formRole, setFormRole] = useState("MODERATOR");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Edit Admin state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editAdmin, setEditAdmin] = useState<Admin | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: "20" });
      if (search) params.set("search", search);
      const res = await getAdminAdmins(params.toString());
      if (res.success) {
        setAdmins(res.data);
        setMeta(res.meta || { total: 0, total_pages: 0 });
      } else {
        toast.error(res.error || "Failed to load admins");
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { load(page); }, [page, load]);

  const handleSearch = () => { setPage(1); load(1); };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formPassword.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setSubmitting(true);
    try {
      const res = await registerAdminAction(formName, formEmail, formPassword, formRole);
      if (res.success) {
        toast.success("Admin created successfully");
        setShowModal(false);
        setFormName(""); setFormEmail(""); setFormPassword(""); setFormRole("MODERATOR");
        load(page);
      } else {
        toast.error(res.error || "Failed to create admin");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    setDeleting(id);
    try {
      const res = await deleteAdminAction(id);
      if (res.success) {
        toast.success("Admin deleted");
        load(page);
      } else {
        toast.error(res.error || "Failed to delete admin");
      }
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Administrators</h1>
          <p className="mt-1 text-sm text-gray-500">Manage administrator accounts and roles</p>
        </div>
        <Button className="rounded-xl gap-2" onClick={() => setShowModal(true)}>
          <Plus className="size-4" /> Add Admin
        </Button>
      </div>

      {/* Search */}
      <Card className="border border-gray-100 dark:border-gray-800 rounded-[20px]">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button variant="outline" size="sm" className="rounded-xl" onClick={handleSearch}>Search</Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border border-gray-100 dark:border-gray-800 rounded-[20px] overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="size-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  <div className="h-2 w-48 bg-gray-200 dark:bg-gray-700 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Full Name</th>
                  <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Email Address</th>
                  <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Access Role</th>
                  <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Status</th>
                  <th className="text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <Shield className="size-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">No admins found</p>
                    </td>
                  </tr>
                ) : (
                  admins.map((a) => {
                    const role = roleConfig[a.role] || roleConfig.MODERATOR;
                    const status = statusConfig[a.status] || statusConfig.ACTIVE;
                    return (
                      <tr key={a.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="size-9 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 flex items-center justify-center overflow-hidden">
                              {a.avatar?.url ? (
                                <img src={a.avatar.url} alt={a.full_name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{a.full_name.charAt(0).toUpperCase()}</span>
                              )}
                            </div>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{a.full_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3.5">
                          <span className="text-sm text-gray-600 dark:text-gray-400">{a.email}</span>
                        </td>
                        <td className="px-6 py-3.5">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ${role.color}`}>
                            {role.label}
                          </span>
                        </td>
                        <td className="px-6 py-3.5">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 transition-colors">
                              <Pencil className="size-4" />
                            </button>
                            <button
                              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/50 text-gray-400 hover:text-red-600 transition-colors"
                              onClick={() => handleDelete(a.id, a.full_name)}
                              disabled={deleting === a.id}
                            >
                              {deleting === a.id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

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

      {/* Add Admin Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Add New Admin</h2>
                <p className="text-xs text-gray-500 mt-0.5">Create a new administrative account for the dashboard.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400">
                <X className="size-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="admin@example.com"
                    required
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formPassword}
                      onChange={(e) => setFormPassword(e.target.value)}
                      placeholder="Min 8 characters"
                      required
                      minLength={8}
                      className="w-full px-3 py-2.5 pr-10 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Access Role</label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="SUPER_ADMIN">Super Admin</option>
                    <option value="ADMIN">Admin</option>
                    <option value="MODERATOR">Moderator</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <div className="flex-1" />
                <Button type="button" variant="outline" className="rounded-xl" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" className="rounded-xl min-w-[140px]" disabled={submitting}>
                  {submitting ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
                  Create Admin Account
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
