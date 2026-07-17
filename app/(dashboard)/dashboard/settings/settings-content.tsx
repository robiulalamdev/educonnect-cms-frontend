"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { logoutAction, changePasswordAction } from "@/lib/actions/auth";
import { getNotificationPreferences, updateNotificationPreferences } from "@/lib/actions/notifications";
import { Bell, Shield, Palette, LogOut, Loader2, Moon, Sun, Globe, Lock, Eye, EyeOff, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

export function SettingsContent() {
  const [loggingOut, setLoggingOut] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<"general" | "security" | "notifications">("general");

  async function handleLogout() {
    setLoggingOut(true);
    await logoutAction("user");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your account settings</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-full w-fit">
        {[
          { key: "general" as const, label: "General", icon: Palette },
          { key: "security" as const, label: "Security", icon: Shield },
          { key: "notifications" as const, label: "Notifications", icon: Bell },
        ].map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === tab.key ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}>
            <tab.icon className="size-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* General Tab */}
      {activeTab === "general" && (
        <div className="space-y-4">
          <Card className="border border-gray-100 dark:border-gray-800 rounded-[20px]">
            <CardContent className="p-6">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Appearance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
                      {theme === "dark" ? <Moon className="size-5" /> : <Sun className="size-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Theme</p>
                      <p className="text-xs text-gray-500">{theme === "dark" ? "Dark mode" : "Light mode"}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant={theme === "light" ? "default" : "outline"} size="sm" className="rounded-full" onClick={() => setTheme("light")}>
                      <Sun className="mr-1.5 size-3.5" /> Light
                    </Button>
                    <Button variant={theme === "dark" ? "default" : "outline"} size="sm" className="rounded-full" onClick={() => setTheme("dark")}>
                      <Moon className="mr-1.5 size-3.5" /> Dark
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-100 dark:border-gray-800 rounded-[20px]">
            <CardContent className="p-6">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Language & Region</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                    <Globe className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Language</p>
                    <p className="text-xs text-gray-500">English (US)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <div className="space-y-4">
          <PasswordChangeCard />

          <Card className="border border-red-200/50 dark:border-red-900/50 rounded-[20px]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">Sign Out</h3>
                  <p className="text-sm text-gray-500 mt-1">Sign out of your account on this device</p>
                </div>
                <Button variant="destructive" className="rounded-full px-6" onClick={handleLogout} disabled={loggingOut}>
                  {loggingOut ? <Loader2 className="mr-2 size-4 animate-spin" /> : <LogOut className="mr-2 size-4" />}
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <NotificationPreferencesCard />
      )}
    </div>
  );
}

function PasswordChangeCard() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (newPw !== confirmPw) {
      setError("Passwords do not match");
      return;
    }
    if (newPw.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.set("current_password", currentPw);
      fd.set("new_password", newPw);
      const result = await changePasswordAction({}, fd);
      if (result.success) {
        setSuccess(true);
        toast.success("Password changed! Please log in again.");
      } else if (result.error) {
        setError(result.error);
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (success) {
    return (
      <Card className="border border-gray-100 dark:border-gray-800 rounded-[20px]">
        <CardContent className="p-6 text-center">
          <Check className="size-10 text-green-500 mx-auto" />
          <p className="mt-3 text-sm font-medium text-gray-900 dark:text-white">Password changed successfully</p>
          <p className="mt-1 text-xs text-gray-500">Please log in with your new password.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-100 dark:border-gray-800 rounded-[20px]">
      <CardContent className="p-6">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Change Password</h3>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-950/50 p-3 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label className="text-[13px] font-medium text-gray-600 dark:text-gray-400">Current Password</Label>
            <div className="relative">
              <Input type={showCurrent ? "text" : "password"} placeholder="••••••••" className="rounded-xl h-11 pr-10" required value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-[13px] font-medium text-gray-600 dark:text-gray-400">New Password</Label>
            <Input type="password" placeholder="••••••••" className="rounded-xl h-11" required minLength={8} value={newPw} onChange={(e) => setNewPw(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label className="text-[13px] font-medium text-gray-600 dark:text-gray-400">Confirm Password</Label>
            <Input type="password" placeholder="••••••••" className="rounded-xl h-11" required minLength={8} value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} />
          </div>
          <Button type="submit" className="rounded-full bg-[#0066FF] hover:bg-[#0052CC] text-white px-6" disabled={saving}>
            {saving ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Lock className="mr-2 size-4" />}
            Update Password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function NotificationPreferencesCard() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    getNotificationPreferences().then((res: any) => {
      if (res.success && res.data) {
        setPrefs({
          in_app_enabled: res.data.in_app_enabled ?? true,
          email_enabled: res.data.email_enabled ?? true,
          push_enabled: res.data.push_enabled ?? true,
          enrollment_notifications: res.data.enrollment_notifications ?? true,
          payment_notifications: res.data.payment_notifications ?? true,
          announcement_notifications: res.data.announcement_notifications ?? true,
          task_notifications: res.data.task_notifications ?? true,
          attendance_notifications: res.data.attendance_notifications ?? true,
          message_notifications: res.data.message_notifications ?? true,
          social_notifications: res.data.social_notifications ?? true,
        });
      } else {
        // Default all on
        setPrefs({
          in_app_enabled: true, email_enabled: true, push_enabled: true,
          enrollment_notifications: true, payment_notifications: true, announcement_notifications: true,
          task_notifications: true, attendance_notifications: true, message_notifications: true,
          social_notifications: true,
        });
      }
      setLoading(false);
    });
  }, []);

  async function togglePref(key: string) {
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);
    setSaving(true);

    // Build hidden form data for server action
    const fd = new FormData();
    Object.entries(updated).forEach(([k, v]) => fd.set(k, String(v)));

    try {
      await updateNotificationPreferences({}, fd);
    } catch {
      // Revert on error
      setPrefs((p) => ({ ...p, [key]: !prefs[key] }));
    } finally {
      setSaving(false);
    }
  }

  if (!mounted || loading) {
    return (
      <Card className="border border-gray-100 dark:border-gray-800 rounded-[20px]">
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2 animate-pulse">
                <div className="space-y-1">
                  <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-2 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
                <div className="h-6 w-11 bg-gray-200 dark:bg-gray-700 rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const categories = [
    { key: "in_app_enabled", label: "In-app notifications", desc: "Show notifications in the app" },
    { key: "email_enabled", label: "Email notifications", desc: "Receive notifications via email" },
    { key: "push_enabled", label: "Push notifications", desc: "Receive push notifications on your device" },
  ];

  const specificCategories = [
    { key: "enrollment_notifications", label: "Enrollments", desc: "Join requests, approvals, rejections" },
    { key: "payment_notifications", label: "Payments", desc: "Payment submissions, approvals, rejections" },
    { key: "announcement_notifications", label: "Announcements", desc: "New announcements from your batches" },
    { key: "task_notifications", label: "Tasks", desc: "New tasks and assignment updates" },
    { key: "attendance_notifications", label: "Attendance", desc: "Attendance marks and updates" },
    { key: "message_notifications", label: "Messages", desc: "New direct messages" },
    { key: "social_notifications", label: "Social", desc: "New followers, likes, comments" },
  ];

  return (
    <div className="space-y-4">
      <Card className="border border-gray-100 dark:border-gray-800 rounded-[20px]">
        <CardContent className="p-6">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Channels</h3>
          <div className="space-y-4">
            {categories.map((cat) => (
              <div key={cat.key} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{cat.label}</p>
                  <p className="text-xs text-gray-500">{cat.desc}</p>
                </div>
                <button onClick={() => togglePref(cat.key)} disabled={saving}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${prefs[cat.key] ? "bg-[#0066FF]" : "bg-gray-200 dark:bg-gray-700"}`}>
                  <span className={`inline-block size-4 transform rounded-full bg-white transition-transform shadow-sm ${prefs[cat.key] ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-100 dark:border-gray-800 rounded-[20px]">
        <CardContent className="p-6">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Categories</h3>
          <div className="space-y-4">
            {specificCategories.map((cat) => (
              <div key={cat.key} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{cat.label}</p>
                  <p className="text-xs text-gray-500">{cat.desc}</p>
                </div>
                <button onClick={() => togglePref(cat.key)} disabled={saving}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${prefs[cat.key] ? "bg-[#0066FF]" : "bg-gray-200 dark:bg-gray-700"}`}>
                  <span className={`inline-block size-4 transform rounded-full bg-white transition-transform shadow-sm ${prefs[cat.key] ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {saving && (
        <p className="text-xs text-gray-400 flex items-center gap-1.5">
          <Loader2 className="size-3 animate-spin" /> Saving...
        </p>
      )}
    </div>
  );
}
