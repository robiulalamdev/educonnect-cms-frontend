"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, EyeOff, User, Lock, Shield, GraduationCap, Users, BookOpen } from "lucide-react";
import { useAdmin } from "@/lib/contexts/admin-context";
import { toast } from "sonner";

export function AdminSettingsContent() {
  const admin = useAdmin();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/v1/admin/auth/me/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Password changed. Please log in again.");
        window.location.href = "/admin/login";
      } else {
        toast.error(data.message || "Failed to change password");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  const passwordFields = [
    { label: "Current Password", value: currentPassword, onChange: setCurrentPassword, placeholder: "Enter current password", show: showCurrent, toggle: () => setShowCurrent(!showCurrent) },
    { label: "New Password", value: newPassword, onChange: setNewPassword, placeholder: "Enter new password", show: showNew, toggle: () => setShowNew(!showNew), minLength: 8 },
    { label: "Confirm New Password", value: confirmPassword, onChange: setConfirmPassword, placeholder: "Confirm new password", show: showConfirm, toggle: () => setShowConfirm(!showConfirm), minLength: 8 },
  ];

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-[22px] font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-[13px] text-gray-500 mt-1">Manage your admin account settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6 items-start">

        {/* ══════════ LEFT COLUMN ══════════ */}
        <div className="space-y-6">

          {/* Profile Information */}
          <Card className="border border-gray-200/80 dark:border-gray-800 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex size-10 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/50">
                  <User className="size-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-gray-900 dark:text-white">Profile Information</h3>
                  <p className="text-[12px] text-gray-500 mt-0.5">Your personal information and role</p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between py-3.5 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-[13px] text-gray-500">Name</span>
                  <span className="text-[13px] font-bold text-gray-900 dark:text-white">{admin.full_name}</span>
                </div>
                <div className="flex items-center justify-between py-3.5 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-[13px] text-gray-500">Email</span>
                  <span className="text-[13px] font-bold text-gray-900 dark:text-white">{admin.email}</span>
                </div>
                <div className="flex items-center justify-between py-3.5">
                  <span className="text-[13px] text-gray-500">Role</span>
                  <span className="inline-flex items-center rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30 px-3 py-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 tracking-wide">
                    {admin.role}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card className="border border-gray-200/80 dark:border-gray-800 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex size-10 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/50">
                  <Lock className="size-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-gray-900 dark:text-white">Change Password</h3>
                  <p className="text-[12px] text-gray-500 mt-0.5">Update your password to keep your account secure</p>
                </div>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-4">
                {passwordFields.map((field) => (
                  <div key={field.label}>
                    <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {field.label}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-[15px] text-gray-400" />
                      <input
                        type={field.show ? "text" : "password"}
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder={field.placeholder}
                        required
                        minLength={field.minLength}
                        className="w-full pl-9 pr-10 py-2.5 text-[13px] rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
                      />
                      <button type="button" onClick={field.toggle}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        {field.show ? <EyeOff className="size-[15px]" /> : <Eye className="size-[15px]" />}
                      </button>
                    </div>
                  </div>
                ))}

                <div className="pt-2">
                  <Button type="submit" className="rounded-xl px-5 gap-2 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold" disabled={loading}>
                    {loading ? <Loader2 className="size-4 animate-spin" /> : <Shield className="size-4" />}
                    Update Password
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* ══════════ RIGHT COLUMN ══════════ */}
        <div className="bg-gray-50/80 dark:bg-gray-900/50 rounded-2xl border border-gray-200/60 dark:border-gray-800/50 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex size-10 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/50">
              <Shield className="size-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-gray-900 dark:text-white">System Information</h3>
              <p className="text-[12px] text-gray-500 mt-0.5">Admin panel access</p>
            </div>
          </div>

          <p className="text-[13px] font-bold text-gray-900 dark:text-white mb-3.5">User Roles in System</p>

          <div className="space-y-2.5">
            {/* Student */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
              <div className="flex size-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50 shrink-0">
                <GraduationCap className="size-5 text-blue-600" />
              </div>
              <div className="min-w-0 pt-0.5">
                <p className="text-[13px] font-bold text-gray-900 dark:text-white">Student</p>
                <p className="text-[11.5px] text-gray-500 mt-0.5 leading-relaxed">Access their courses, assignments and learning materials.</p>
              </div>
            </div>

            {/* Guardian */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-green-50/80 dark:bg-green-950/20 border border-green-100 dark:border-green-900/30">
              <div className="flex size-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50 shrink-0">
                <Users className="size-5 text-green-600" />
              </div>
              <div className="min-w-0 pt-0.5">
                <p className="text-[13px] font-bold text-gray-900 dark:text-white">Guardian</p>
                <p className="text-[11.5px] text-gray-500 mt-0.5 leading-relaxed">Monitor their children&apos;s progress, attendance and performance.</p>
              </div>
            </div>

            {/* Teacher */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-purple-50/80 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30">
              <div className="flex size-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/50 shrink-0">
                <BookOpen className="size-5 text-purple-600" />
              </div>
              <div className="min-w-0 pt-0.5">
                <p className="text-[13px] font-bold text-gray-900 dark:text-white">Teacher</p>
                <p className="text-[11.5px] text-gray-500 mt-0.5 leading-relaxed">Manage classes, assignments and student progress.</p>
              </div>
            </div>

            {/* Admin */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-orange-50/80 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30">
              <div className="flex size-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/50 shrink-0">
                <Shield className="size-5 text-orange-600" />
              </div>
              <div className="min-w-0 pt-0.5">
                <p className="text-[13px] font-bold text-gray-900 dark:text-white">Admin</p>
                <p className="text-[11.5px] text-gray-500 mt-0.5 leading-relaxed">Manage platform, users, content and system settings.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
