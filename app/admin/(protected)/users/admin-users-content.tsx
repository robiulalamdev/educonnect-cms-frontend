"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft, ChevronRight, Search, Users, X, Filter, Plus,
  MoreVertical, Pencil, Settings2, UserPlus, Loader2, Eye, EyeOff,
  Shield, ShieldOff, Trash2, CheckCircle, AlertTriangle, Ban,
} from "lucide-react";
import { toast } from "sonner";
import {
  getAdminUsers,
  createUserByAdminAction,
  updateUserByAdminAction,
  suspendUserAction,
  banUserAction,
  reactivateUserAction,
  approveTeacherAction,
  deleteUserAction,
} from "@/lib/actions/admin";

interface User {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: string;
  status: string;
  is_email_verified: boolean;
  is_approved: boolean;
  created_at: string;
  avatar?: { key: string } | null;
}

const roleConfig: Record<string, { label: string; bg: string; text: string }> = {
  SUPER_ADMIN: { label: "SUPER ADMIN", bg: "bg-red-50 dark:bg-red-950/50", text: "text-red-600 dark:text-red-400" },
  ADMIN: { label: "ADMIN", bg: "bg-red-50 dark:bg-red-950/50", text: "text-red-600 dark:text-red-400" },
  MODERATOR: { label: "MODERATOR", bg: "bg-purple-50 dark:bg-purple-950/50", text: "text-purple-600 dark:text-purple-400" },
  TEACHER: { label: "TEACHER", bg: "bg-blue-50 dark:bg-blue-950/50", text: "text-blue-600 dark:text-blue-400" },
  STUDENT: { label: "STUDENT", bg: "bg-teal-50 dark:bg-teal-950/50", text: "text-teal-600 dark:text-teal-400" },
  GUARDIAN: { label: "GUARDIAN", bg: "bg-green-50 dark:bg-green-950/50", text: "text-green-600 dark:text-green-400" },
};

const statusConfig: Record<string, { label: string; dot: string; text: string }> = {
  ACTIVE: { label: "Active", dot: "bg-green-500", text: "text-green-600 dark:text-green-400" },
  PENDING_VERIFICATION: { label: "Inactive", dot: "bg-red-500", text: "text-red-600 dark:text-red-400" },
  SUSPENDED: { label: "Inactive", dot: "bg-red-500", text: "text-red-600 dark:text-red-400" },
  BANNED: { label: "Inactive", dot: "bg-red-500", text: "text-red-600 dark:text-red-400" },
};

const avatarColors = [
  "bg-red-500", "bg-orange-500", "bg-amber-500", "bg-yellow-500",
  "bg-lime-500", "bg-green-500", "bg-teal-500", "bg-cyan-500",
  "bg-blue-500", "bg-indigo-500", "bg-violet-500", "bg-purple-500",
  "bg-pink-500", "bg-rose-500",
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

// ─── Modal Wrapper ──────────────────────────────────────────
function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-[15px] font-bold text-gray-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="size-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X className="size-4" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ─── Confirm Dialog ─────────────────────────────────────────
function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel, confirmColor, loading }: {
  open: boolean; onClose: () => void; onConfirm: () => void; title: string; message: string;
  confirmLabel: string; confirmColor: string; loading: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="size-10 rounded-full bg-red-50 dark:bg-red-950/50 flex items-center justify-center">
            <AlertTriangle className="size-5 text-red-500" />
          </div>
          <h3 className="text-[15px] font-bold text-gray-900 dark:text-white">{title}</h3>
        </div>
        <p className="text-[13px] text-gray-500 mb-5 ml-[52px]">{message}</p>
        <div className="flex items-center justify-end gap-2 ml-[52px]">
          <button onClick={onClose} disabled={loading} className="px-4 py-2 text-[13px] font-medium rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading} className={`px-4 py-2 text-[13px] font-semibold rounded-xl text-white transition-colors disabled:opacity-50 flex items-center gap-2 ${confirmColor}`}>
            {loading && <Loader2 className="size-3.5 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────
export function AdminUsersContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [meta, setMeta] = useState({ total: 0, total_pages: 0 });
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ type: string; user: User } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form states
  const [addForm, setAddForm] = useState({ full_name: "", email: "", password: "", role: "STUDENT", phone: "" });
  const [editForm, setEditForm] = useState({ full_name: "", email: "", phone: "", role: "", status: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: String(limit) });
      if (search) params.set("search", search);
      if (roleFilter) params.set("role", roleFilter);
      if (statusFilter) params.set("status", statusFilter);
      if (dateFrom) params.set("date_from", dateFrom);
      if (dateTo) params.set("date_to", dateTo);
      const res = await getAdminUsers(params.toString());
      if (res.success) {
        setUsers(res.data);
        setMeta(res.meta || { total: 0, total_pages: 0 });
      } else {
        toast.error((res as any).error || "Failed to load users");
      }
    } catch {} finally {
      setLoading(false);
    }
  }, [search, roleFilter, statusFilter, dateFrom, dateTo, limit]);

  useEffect(() => { load(page); }, [page, load]);

  // Close action menu on outside click
  useEffect(() => {
    const handler = () => setActionMenuId(null);
    if (actionMenuId) document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [actionMenuId]);

  const handleSearchInput = (value: string) => {
    setSearchInput(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => { setSearch(value); setPage(1); }, 400);
  };

  const clearFilters = () => {
    setSearchInput(""); setSearch(""); setRoleFilter(""); setStatusFilter("");
    setDateFrom(""); setDateTo(""); setPage(1);
  };

  // ─── Add User ──────────────────────────────────────────────
  const handleAddUser = async () => {
    if (!addForm.full_name || !addForm.email || !addForm.password) {
      toast.error("Please fill all required fields");
      return;
    }
    setFormLoading(true);
    try {
      const res = await createUserByAdminAction(addForm);
      if (res.success) {
        toast.success("User created successfully");
        setShowAddModal(false);
        setAddForm({ full_name: "", email: "", password: "", role: "STUDENT", phone: "" });
        load(page);
      } else {
        toast.error((res as any).error || "Failed to create user");
      }
    } catch { toast.error("Network error"); }
    finally { setFormLoading(false); }
  };

  // ─── Edit User ─────────────────────────────────────────────
  const openEdit = (user: User) => {
    setEditUser(user);
    setEditForm({ full_name: user.full_name, email: user.email, phone: user.phone || "", role: user.role, status: user.status });
    setShowEditModal(true);
    setActionMenuId(null);
  };

  const handleEditUser = async () => {
    if (!editUser) return;
    setFormLoading(true);
    try {
      const res = await updateUserByAdminAction(editUser.id, editForm);
      if (res.success) {
        toast.success("User updated successfully");
        setShowEditModal(false);
        setEditUser(null);
        load(page);
      } else {
        toast.error((res as any).error || "Failed to update user");
      }
    } catch { toast.error("Network error"); }
    finally { setFormLoading(false); }
  };

  // ─── Actions ───────────────────────────────────────────────
  const handleConfirmAction = async () => {
    if (!confirmAction) return;
    setActionLoading(true);
    try {
      let res;
      switch (confirmAction.type) {
        case "suspend": res = await suspendUserAction(confirmAction.user.id); break;
        case "ban": res = await banUserAction(confirmAction.user.id); break;
        case "reactivate": res = await reactivateUserAction(confirmAction.user.id); break;
        case "approve": res = await approveTeacherAction(confirmAction.user.id); break;
        case "delete": res = await deleteUserAction(confirmAction.user.id); break;
        default: return;
      }
      if (res.success) {
        toast.success((res as any).message || "Action completed");
        setConfirmAction(null);
        load(page);
      } else {
        toast.error((res as any).error || "Action failed");
      }
    } catch { toast.error("Network error"); }
    finally { setActionLoading(false); }
  };

  const startIdx = (page - 1) * limit + 1;
  const endIdx = Math.min(page * limit, meta.total);

  // ─── Form Input Component ──────────────────────────────────
  const FormInput = ({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
    <div>
      <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
      <input {...props} className="w-full px-3.5 py-2.5 text-[13px] rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-700 placeholder:text-gray-400" />
    </div>
  );

  const FormSelect = ({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) => (
    <div>
      <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3.5 py-2.5 text-[13px] rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900 dark:text-white">Users</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">Manage all platform users and their roles</p>
        </div>
        <button onClick={() => { setAddForm({ full_name: "", email: "", password: "", role: "STUDENT", phone: "" }); setShowAddModal(true); }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold transition-colors shadow-sm shadow-blue-600/25">
          <Plus className="size-4" />
          Add User
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input type="text" placeholder="Search by name, email or phone..." value={searchInput} onChange={(e) => handleSearchInput(e.target.value)} className="w-full pl-10 pr-10 py-2.5 text-[13px] rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-700 placeholder:text-gray-400" />
            {searchInput && <button onClick={() => handleSearchInput("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X className="size-4" /></button>}
          </div>
          <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }} className="px-4 py-2.5 text-[13px] font-medium rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[130px]">
            <option value="">All Roles</option>
            <option value="TEACHER">Teacher</option>
            <option value="STUDENT">Student</option>
            <option value="GUARDIAN">Guardian</option>
          </select>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="px-4 py-2.5 text-[13px] font-medium rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[130px]">
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="PENDING_VERIFICATION">Pending</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="BANNED">Banned</option>
          </select>
          <button onClick={() => setShowMoreFilters(!showMoreFilters)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[13px] font-medium transition-colors ${showMoreFilters || dateFrom || dateTo ? "border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-400" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>
            <Filter className="size-4" /> More Filters
          </button>
          <button className="flex size-10 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Settings2 className="size-4" />
          </button>
        </div>
        {showMoreFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-end gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">From Date</label>
              <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1); }} className="px-3 py-2.5 text-[13px] rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">To Date</label>
              <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1); }} className="px-3 py-2.5 text-[13px] rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button onClick={clearFilters} className="text-[12px] text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-medium px-3 py-2.5">Clear all</button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5">User</th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5">Role</th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5">Email / Phone</th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5">Status</th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5">Joined At</th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50 dark:border-gray-800/50">
                    <td colSpan={6} className="px-6 py-4"><div className="flex items-center gap-3 animate-pulse"><div className="size-10 rounded-full bg-gray-200 dark:bg-gray-700" /><div className="space-y-1.5"><div className="h-3 w-28 bg-gray-200 dark:bg-gray-700 rounded-full" /><div className="h-2.5 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" /></div></div></td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-16 text-center"><Users className="size-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" /><p className="text-[13px] font-medium text-gray-500">No users found</p></td></tr>
              ) : users.map((u) => {
                const role = roleConfig[u.role] || roleConfig.STUDENT;
                const status = statusConfig[u.status] || statusConfig.ACTIVE;
                return (
                  <tr key={u.id} className="border-b border-gray-50 dark:border-gray-800/50 last:border-b-0 hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`size-10 rounded-full ${getAvatarColor(u.full_name)} flex items-center justify-center text-white text-[13px] font-bold shrink-0 overflow-hidden`}>
                          {u.avatar?.key ? <img src={u.avatar.key} alt="" className="w-full h-full object-cover" /> : u.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-gray-900 dark:text-white">{u.full_name}</p>
                          <p className="text-[11px] text-gray-400">ID: {u.id.slice(-8).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold ${role.bg} ${role.text}`}>{role.label}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[13px] text-gray-700 dark:text-gray-300">{u.email}</p>
                      <p className="text-[12px] text-gray-400 mt-0.5">{u.phone || "—"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`size-2 rounded-full ${status.dot}`} />
                        <span className={`text-[13px] font-medium ${status.text}`}>{status.label}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[13px] text-gray-700 dark:text-gray-300">{new Date(u.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{new Date(u.created_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEdit(u)} className="size-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors" title="Edit">
                            <Pencil className="size-4" />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); setActionMenuId(actionMenuId === u.id ? null : u.id); }} className="size-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <MoreVertical className="size-4" />
                          </button>
                        </div>
                        {actionMenuId === u.id && (
                          <div className="absolute right-0 top-full mt-1 w-52 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-40 py-1" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => openEdit(u)} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                              <Pencil className="size-4 text-gray-400" /> Edit User
                            </button>
                            {u.role === "TEACHER" && !u.is_approved && (
                              <button onClick={() => { setConfirmAction({ type: "approve", user: u }); setActionMenuId(null); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors">
                                <CheckCircle className="size-4" /> Approve Teacher
                              </button>
                            )}
                            {u.status === "ACTIVE" && (
                              <>
                                <button onClick={() => { setConfirmAction({ type: "suspend", user: u }); setActionMenuId(null); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors">
                                  <ShieldOff className="size-4" /> Suspend
                                </button>
                                <button onClick={() => { setConfirmAction({ type: "ban", user: u }); setActionMenuId(null); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                                  <Ban className="size-4" /> Ban
                                </button>
                              </>
                            )}
                            {(u.status === "SUSPENDED" || u.status === "BANNED") && (
                              <button onClick={() => { setConfirmAction({ type: "reactivate", user: u }); setActionMenuId(null); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors">
                                <Shield className="size-4" /> Reactivate
                              </button>
                            )}
                            <div className="border-t border-gray-100 dark:border-gray-800 my-1" />
                            <button onClick={() => { setConfirmAction({ type: "delete", user: u }); setActionMenuId(null); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                              <Trash2 className="size-4" /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {meta.total > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-[12px] text-gray-500">Showing <span className="font-semibold text-gray-700 dark:text-gray-300">{startIdx}</span> to <span className="font-semibold text-gray-700 dark:text-gray-300">{endIdx}</span> of <span className="font-semibold text-gray-700 dark:text-gray-300">{meta.total}</span> users</p>
          <div className="flex items-center gap-3">
            <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} className="px-3 py-1.5 text-[12px] font-medium rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {[10, 20, 50, 100].map((s) => <option key={s} value={s}>{s} per page</option>)}
            </select>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="size-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 transition-colors"><ChevronLeft className="size-4" /></button>
              {Array.from({ length: Math.min(5, meta.total_pages) }, (_, i) => {
                let n: number;
                if (meta.total_pages <= 5) n = i + 1;
                else if (page <= 3) n = i + 1;
                else if (page >= meta.total_pages - 2) n = meta.total_pages - 4 + i;
                else n = page - 2 + i;
                return <button key={n} onClick={() => setPage(n)} className={`size-8 rounded-lg text-[13px] font-semibold transition-colors ${page === n ? "bg-blue-600 text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}`}>{n}</button>;
              })}
              <button onClick={() => setPage((p) => Math.min(meta.total_pages, p + 1))} disabled={page === meta.total_pages} className="size-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 transition-colors"><ChevronRight className="size-4" /></button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Add User Modal ─────────────────────────────────── */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add New User">
        <div className="space-y-4">
          <FormInput label="Full Name" placeholder="Enter full name" value={addForm.full_name} onChange={(e) => setAddForm({ ...addForm, full_name: e.target.value })} />
          <FormInput label="Email" type="email" placeholder="user@example.com" value={addForm.email} onChange={(e) => setAddForm({ ...addForm, email: e.target.value })} />
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} placeholder="Min 8 characters" value={addForm.password} onChange={(e) => setAddForm({ ...addForm, password: e.target.value })} className="w-full px-3.5 py-2.5 pr-10 text-[13px] rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button>
            </div>
          </div>
          <FormSelect label="Role" value={addForm.role} onChange={(v) => setAddForm({ ...addForm, role: v })} options={[{ value: "STUDENT", label: "Student" }, { value: "TEACHER", label: "Teacher" }, { value: "GUARDIAN", label: "Guardian" }]} />
          <FormInput label="Phone (optional)" placeholder="+880 1xxx-xxxxxx" value={addForm.phone} onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })} />
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setShowAddModal(false)} className="px-4 py-2.5 text-[13px] font-medium rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
            <button onClick={handleAddUser} disabled={formLoading} className="px-5 py-2.5 text-[13px] font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50 flex items-center gap-2">
              {formLoading && <Loader2 className="size-3.5 animate-spin" />}
              <UserPlus className="size-4" /> Create User
            </button>
          </div>
        </div>
      </Modal>

      {/* ─── Edit User Modal ────────────────────────────────── */}
      <Modal open={showEditModal} onClose={() => { setShowEditModal(false); setEditUser(null); }} title={`Edit User — ${editUser?.full_name || ""}`}>
        <div className="space-y-4">
          <FormInput label="Full Name" value={editForm.full_name} onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })} />
          <FormInput label="Email" type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
          <FormInput label="Phone" placeholder="Optional" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
          <FormSelect label="Role" value={editForm.role} onChange={(v) => setEditForm({ ...editForm, role: v })} options={[{ value: "TEACHER", label: "Teacher" }, { value: "STUDENT", label: "Student" }, { value: "GUARDIAN", label: "Guardian" }]} />
          <FormSelect label="Status" value={editForm.status} onChange={(v) => setEditForm({ ...editForm, status: v })} options={[{ value: "ACTIVE", label: "Active" }, { value: "SUSPENDED", label: "Suspended" }, { value: "BANNED", label: "Banned" }]} />
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => { setShowEditModal(false); setEditUser(null); }} className="px-4 py-2.5 text-[13px] font-medium rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
            <button onClick={handleEditUser} disabled={formLoading} className="px-5 py-2.5 text-[13px] font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50 flex items-center gap-2">
              {formLoading && <Loader2 className="size-3.5 animate-spin" />}
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      {/* ─── Confirm Action Dialog ──────────────────────────── */}
      <ConfirmDialog
        open={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirmAction}
        title={
          confirmAction?.type === "suspend" ? "Suspend User" :
          confirmAction?.type === "ban" ? "Ban User" :
          confirmAction?.type === "reactivate" ? "Reactivate User" :
          confirmAction?.type === "approve" ? "Approve Teacher" :
          "Delete User"
        }
        message={
          confirmAction?.type === "suspend" ? `Are you sure you want to suspend ${confirmAction?.user.full_name}? They won't be able to access the platform.` :
          confirmAction?.type === "ban" ? `Are you sure you want to ban ${confirmAction?.user.full_name}? This is a severe action.` :
          confirmAction?.type === "reactivate" ? `Reactivate ${confirmAction?.user.full_name}? They will regain access.` :
          confirmAction?.type === "approve" ? `Approve ${confirmAction?.user.full_name} as a teacher? They will be able to create services.` :
          `Are you sure you want to permanently delete ${confirmAction?.user.full_name}? This cannot be undone.`
        }
        confirmLabel={
          confirmAction?.type === "suspend" ? "Suspend" :
          confirmAction?.type === "ban" ? "Ban" :
          confirmAction?.type === "reactivate" ? "Reactivate" :
          confirmAction?.type === "approve" ? "Approve" :
          "Delete"
        }
        confirmColor={
          confirmAction?.type === "reactivate" || confirmAction?.type === "approve" ? "bg-green-600 hover:bg-green-700" :
          confirmAction?.type === "suspend" ? "bg-amber-600 hover:bg-amber-700" :
          "bg-red-600 hover:bg-red-700"
        }
        loading={actionLoading}
      />
    </div>
  );
}
