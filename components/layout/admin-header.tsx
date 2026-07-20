"use client";

import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { logoutAction } from "@/lib/actions/auth";
import { useAdmin } from "@/lib/contexts/admin-context";
import { LogOut, Settings, Bell, Home, ChevronRight, Sun, Moon, Search } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function AdminHeader() {
  const admin = useAdmin();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const initials = admin.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const roleLabel =
    admin.role === "SUPER_ADMIN"
      ? "Super Admin"
      : admin.role === "ADMIN"
        ? "Admin"
        : "Moderator";

  return (
    <header className="flex h-16 items-center gap-3 border-b border-gray-100/80 dark:border-gray-800/80 bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl px-4 sm:px-6">
      <SidebarTrigger className="size-9 text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors" />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href={ROUTES.ADMIN.DASHBOARD} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          <Home className="size-4" />
        </Link>
        <ChevronRight className="size-3.5 text-gray-300 dark:text-gray-600" />
        <span className="font-medium text-blue-600 dark:text-blue-400">{roleLabel}</span>
      </div>

      <div className="flex-1" />

      {/* Search */}
      <button className="flex size-9 items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
        <Search className="size-[18px]" />
      </button>

      {/* Theme Toggle */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="flex size-9 items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        {mounted && theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
      </button>

      {/* Notifications */}
      <button className="relative flex size-9 items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
        <Bell className="size-[18px]" />
        <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-blue-500 ring-2 ring-white dark:ring-gray-950" />
      </button>

      {/* Avatar Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className="relative size-9 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
          <Avatar className="size-9 ring-2 ring-blue-600">
            <AvatarFallback className="text-xs font-bold bg-blue-600 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xl">
          <div className="flex items-center gap-3 p-3">
            <Avatar className="size-10">
              <AvatarFallback className="text-sm font-bold bg-blue-600 text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{admin.full_name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{admin.email}</p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="rounded-lg cursor-pointer">
            <Link href={ROUTES.ADMIN.SETTINGS} className="flex items-center gap-2 w-full">
              <Settings className="size-4" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => logoutAction("admin")}
            variant="destructive"
            className="rounded-lg cursor-pointer"
          >
            <LogOut className="mr-2 size-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
