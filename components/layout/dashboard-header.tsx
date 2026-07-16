"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { logoutAction } from "@/lib/actions/auth";
import { LogOut, User, Settings, Bell, Menu } from "lucide-react";

interface DashboardHeaderProps {
  user: {
    full_name: string;
    email: string;
    role: string;
  };
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const initials = user.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="flex h-16 items-center gap-4 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl px-4 sm:px-6">
      {/* Mobile menu button - always visible on small screens */}
      <SidebarTrigger className="size-10 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden" />
      {/* Desktop sidebar toggle */}
      <SidebarTrigger className="size-9 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 hidden md:flex" />

      <div className="flex-1" />

      <ThemeToggle />

      <Button
        variant="ghost"
        size="icon"
        className="relative size-9 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
      >
        <Bell className="size-4.5" />
        <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
          3
        </span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger className="relative size-9 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
          <Avatar className="size-9 ring-2 ring-gray-100 dark:ring-gray-800">
            <AvatarFallback className="text-xs font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              {initials}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 rounded-xl">
          <div className="flex items-center gap-3 p-3">
            <Avatar className="size-10">
              <AvatarFallback className="text-sm font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user.full_name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user.email}
              </p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="rounded-lg cursor-pointer">
            <User className="mr-2 size-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-lg cursor-pointer">
            <Settings className="mr-2 size-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => logoutAction("user")}
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
