"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/lib/actions/auth";
import { LogOut, Bell, Shield, Palette, Loader2 } from "lucide-react";
import { useState } from "react";

export function SettingsContent() {
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await logoutAction("user");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your account settings</p>
      </div>

      <div className="grid gap-4">
        <Card className="border-0 shadow-sm rounded-2xl dark:bg-gray-900 dark:border dark:border-gray-800">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                <Bell className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Manage notification preferences</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl">Manage</Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl dark:bg-gray-900 dark:border dark:border-gray-800">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400">
                <Shield className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Security</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Change password, manage sessions</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl">Manage</Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl dark:bg-gray-900 dark:border dark:border-gray-800">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
                <Palette className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Appearance</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Theme, language, display</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl">Manage</Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl border-red-200/50 dark:border-red-800/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400">
                  <LogOut className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Sign Out</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Sign out of your account</p>
                </div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="rounded-xl"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                {loggingOut ? <Loader2 className="mr-2 size-3 animate-spin" /> : null}
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
