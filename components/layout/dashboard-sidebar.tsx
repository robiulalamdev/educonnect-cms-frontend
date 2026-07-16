"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ROUTES } from "@/lib/constants";
import {
  LayoutDashboard,
  User,
  BookOpen,
  GraduationCap,
  CreditCard,
  MessageSquare,
  Bell,
  Settings,
  X,
  FileText,
} from "lucide-react";

interface DashboardSidebarProps {
  user: {
    id: string;
    full_name: string;
    email: string;
    role: string;
  };
}

const navItems = [
  { title: "Dashboard", icon: LayoutDashboard, href: ROUTES.USER.DASHBOARD },
  { title: "Profile", icon: User, href: ROUTES.USER.PROFILE },
  { title: "Posts", icon: FileText, href: ROUTES.USER.DASHBOARD + "/posts" },
  { title: "Services", icon: BookOpen, href: ROUTES.USER.SERVICES },
  { title: "Batches", icon: GraduationCap, href: ROUTES.USER.BATCHES },
  { title: "Enrollments", icon: CreditCard, href: ROUTES.USER.ENROLLMENTS },
  { title: "Messages", icon: MessageSquare, href: ROUTES.USER.MESSAGES },
  { title: "Notifications", icon: Bell, href: ROUTES.USER.NOTIFICATIONS },
  { title: "Settings", icon: Settings, href: ROUTES.USER.SETTINGS },
];

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const initials = user.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="border-b border-gray-100 dark:border-gray-800 px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href={ROUTES.USER.DASHBOARD}
            className="flex items-center gap-2.5 font-bold text-lg"
            onClick={() => isMobile && setOpenMobile(false)}
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <GraduationCap className="size-4.5" />
            </div>
            <span className="text-gray-900 dark:text-white">CMS</span>
          </Link>
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => setOpenMobile(false)}
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navItems.map((item) => {
                const isActive =
                  item.href === ROUTES.USER.DASHBOARD
                    ? pathname === item.href
                    : pathname.startsWith(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={isActive}
                      onClick={() => isMobile && setOpenMobile(false)}
                      className={`h-10 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-medium"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    >
                      <item.icon className={`size-4.5 ${isActive ? "text-blue-600 dark:text-blue-400" : ""}`} />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-100 dark:border-gray-800 p-4">
        <div className="flex items-center gap-3">
          <Avatar className="size-9 ring-2 ring-gray-100 dark:ring-gray-800">
            <AvatarFallback className="text-xs font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
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
      </SidebarFooter>
    </Sidebar>
  );
}
