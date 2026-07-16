"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { logoutAction } from "@/lib/actions/auth";
import { Bell, Shield, Palette, LogOut, Loader2, Moon, Sun, Globe, Lock, Eye, EyeOff, Check } from "lucide-react";
import { useTheme } from "next-themes";

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
          <Card className="border border-gray-100 dark:border-gray-800 rounded-[20px]">
            <CardContent className="p-6">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Change Password</h3>
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label className="text-[13px] font-medium text-gray-600 dark:text-gray-400">Current Password</Label>
                  <div className="relative">
                    <Input type={showPassword ? "text" : "password"} placeholder="••••••••" className="rounded-xl h-11 pr-10" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[13px] font-medium text-gray-600 dark:text-gray-400">New Password</Label>
                  <Input type="password" placeholder="••••••••" className="rounded-xl h-11" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[13px] font-medium text-gray-600 dark:text-gray-400">Confirm Password</Label>
                  <Input type="password" placeholder="••••••••" className="rounded-xl h-11" />
                </div>
                <Button className="rounded-full bg-[#0066FF] hover:bg-[#0052CC] text-white px-6">
                  <Lock className="mr-2 size-4" /> Update Password
                </Button>
              </div>
            </CardContent>
          </Card>

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
        <div className="space-y-4">
          <Card className="border border-gray-100 dark:border-gray-800 rounded-[20px]">
            <CardContent className="p-6">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { label: "Email notifications", desc: "Receive notifications via email", default: true },
                  { label: "Push notifications", desc: "Receive push notifications on your device", default: true },
                  { label: "New followers", desc: "When someone follows you", default: true },
                  { label: "Post likes", desc: "When someone likes your post", default: true },
                  { label: "Comments", desc: "When someone comments on your post", default: true },
                  { label: "Messages", desc: "When you receive a new message", default: true },
                ].map((pref) => (
                  <div key={pref.label} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{pref.label}</p>
                      <p className="text-xs text-gray-500">{pref.desc}</p>
                    </div>
                    <ToggleSwitch defaultChecked={pref.default} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function ToggleSwitch({ defaultChecked = false }: { defaultChecked?: boolean }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <button onClick={() => setOn(!on)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${on ? "bg-[#0066FF]" : "bg-gray-200 dark:bg-gray-700"}`}>
      <span className={`inline-block size-4 transform rounded-full bg-white transition-transform shadow-sm ${on ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );
}
