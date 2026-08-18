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
import { ROUTES } from "@/lib/constants";
import { useUser } from "@/lib/contexts/user-context";
import { BrandLogo } from "@/components/brand-logo";
import {
  LayoutDashboard, User, BookOpen, GraduationCap, CreditCard,
  MessageSquare, Bell, Settings, X, FileText, FolderOpen,
  ClipboardCheck, ListChecks, StickyNote, Megaphone, Star,
  Calendar, MoreVertical, Shield,
} from "lucide-react";

interface NavItem {
  title: string;
  icon: any;
  href: string;
  roles?: string[];
}

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Main",
    items: [
      { title: "Dashboard", icon: LayoutDashboard, href: ROUTES.USER.DASHBOARD },
      { title: "Profile", icon: User, href: ROUTES.USER.PROFILE },
      { title: "Posts", icon: FileText, href: ROUTES.USER.DASHBOARD + "/posts" },
      { title: "Media", icon: FolderOpen, href: ROUTES.USER.DASHBOARD + "/media" },
    ],
  },
  {
    label: "Learning",
    items: [
      { title: "Services", icon: BookOpen, href: ROUTES.USER.SERVICES, roles: ["TEACHER"] },
      { title: "Batches", icon: GraduationCap, href: ROUTES.USER.BATCHES, roles: ["TEACHER"] },
      { title: "Enrollments", icon: ClipboardCheck, href: ROUTES.USER.ENROLLMENTS },
      { title: "Calendar", icon: Calendar, href: ROUTES.USER.DASHBOARD + "/calendar" },
      { title: "Reviews", icon: Star, href: ROUTES.USER.DASHBOARD + "/reviews" },
    ],
  },
  {
    label: "Communication",
    items: [
      { title: "Messages", icon: MessageSquare, href: ROUTES.USER.MESSAGES },
      { title: "Notifications", icon: Bell, href: ROUTES.USER.NOTIFICATIONS },
    ],
  },
  {
    label: "Finance",
    items: [
      { title: "Payments", icon: CreditCard, href: ROUTES.USER.PAYMENTS },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Settings", icon: Settings, href: ROUTES.USER.SETTINGS },
    ],
  },
];

export function DashboardSidebar() {
  const user = useUser()!;
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const initials = user.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const roleLabel =
    user.role === "TEACHER" ? "Teacher" :
    user.role === "STUDENT" ? "Student" : "Guardian";

  return (
    <Sidebar className="border-r-0 bg-white dark:bg-gray-950">
      <SidebarHeader className="px-5 py-5">
        <div className="flex items-center justify-between">
          <Link
            href={ROUTES.USER.DASHBOARD}
            className="flex items-center gap-2.5"
            onClick={() => isMobile && setOpenMobile(false)}
          >
            <div className="flex size-9 items-center justify-center">
              <BrandLogo size={36} />
            </div>
            <span className="text-[17px] font-bold text-gray-900 dark:text-white tracking-tight">Coaching CMS</span>
          </Link>
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-gray-400 hover:text-gray-600"
              onClick={() => setOpenMobile(false)}
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 pb-4">
        {navGroups.map((group) => {
          const visibleItems = group.items.filter(
            (item) => !item.roles || item.roles.includes(user.role),
          );
          if (visibleItems.length === 0) return null;

          return (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.08em] mb-1.5 px-3">
                {group.label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-0.5">
                  {visibleItems.map((item) => {
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
                          className={`h-10 rounded-xl transition-all duration-150 px-3 ${
                            isActive
                              ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold"
                              : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white font-medium"
                          }`}
                        >
                          <item.icon className={`size-[18px] ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500"}`} />
                          <span className="text-[13px]">{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-100 dark:border-gray-800 p-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-blue-600/20 shrink-0 overflow-hidden">
            {user.avatar?.key ? (
              <img src={user.avatar.key} alt="" className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-gray-900 dark:text-white truncate">{user.full_name}</p>
            <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">{roleLabel}</p>
          </div>
          <button className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors">
            <MoreVertical className="size-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
