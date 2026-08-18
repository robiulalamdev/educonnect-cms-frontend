"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
import { useAdmin } from "@/lib/contexts/admin-context";
import {
  LayoutDashboard, Users, GraduationCap, ShieldCheck, BookOpen,
  FileText, Star, DollarSign, ScrollText, Settings, Shield, Link2,
  MoreVertical, CreditCard, ClipboardList, ShieldAlert, X,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

interface NavItem {
  title: string;
  icon: any;
  href: string;
  roles?: string[];
  badge?: number;
}

function useSidebarBadges() {
  const [badges, setBadges] = useState<Record<string, number>>({});

  useEffect(() => {
    async function fetchBadges() {
      try {
        const [usersRes, pendingRes] = await Promise.all([
          fetch("/api/v1/admin/dashboard/users?limit=1", { credentials: "include" }),
          fetch("/api/v1/admin/dashboard/teachers?status=PENDING&limit=1", { credentials: "include" }),
        ]);
        const [usersData, pendingData] = await Promise.all([
          usersRes.json(),
          pendingRes.json(),
        ]);
        setBadges({
          users: usersData?.meta?.total ?? 0,
          teacherApprovals: pendingData?.meta?.total ?? pendingData?.pagination?.total ?? 0,
        });
      } catch {
        // Silent fail
      }
    }
    fetchBadges();
  }, []);

  return badges;
}

function useNavGroups(badges: Record<string, number>) {
  const groups: { label: string; items: NavItem[] }[] = [
    {
      label: "Overview",
      items: [
        { title: "Dashboard", icon: LayoutDashboard, href: ROUTES.ADMIN.DASHBOARD },
      ],
    },
    {
      label: "Management",
      items: [
        { title: "Admin Accounts", icon: ShieldCheck, href: ROUTES.ADMIN.ADMINS, roles: ["SUPER_ADMIN", "ADMIN"] },
        { title: "Users", icon: Users, href: ROUTES.ADMIN.USERS, badge: badges.users },
        { title: "Teacher Approvals", icon: GraduationCap, href: ROUTES.ADMIN.TEACHERS, roles: ["SUPER_ADMIN", "ADMIN"], badge: badges.teacherApprovals },
      ],
    },
    {
      label: "Platform",
      items: [
        { title: "Courses", icon: BookOpen, href: ROUTES.ADMIN.EDUCATION, roles: ["SUPER_ADMIN", "ADMIN"] },
        { title: "Class Room", icon: ClipboardList, href: "/admin/class-room", roles: ["SUPER_ADMIN", "ADMIN"] },
        { title: "Posts", icon: FileText, href: ROUTES.ADMIN.POSTS },
        { title: "Reviews", icon: Star, href: ROUTES.ADMIN.REVIEWS },
        { title: "Moderation", icon: ShieldAlert, href: ROUTES.ADMIN.MODERATION, roles: ["SUPER_ADMIN", "ADMIN", "MODERATOR"] },
        { title: "Subscriptions", icon: DollarSign, href: ROUTES.ADMIN.SUBSCRIPTIONS, roles: ["SUPER_ADMIN", "ADMIN"] },
        { title: "Payments", icon: CreditCard, href: "/admin/payments", roles: ["SUPER_ADMIN", "ADMIN"] },
      ],
    },
    {
      label: "System",
      items: [
        { title: "Settings", icon: Settings, href: ROUTES.ADMIN.SETTINGS, roles: ["SUPER_ADMIN"] },
        { title: "Audit Logs", icon: ScrollText, href: ROUTES.ADMIN.AUDIT_LOGS, roles: ["SUPER_ADMIN", "ADMIN"] },
        { title: "Guardian Links", icon: Link2, href: ROUTES.ADMIN.GUARDIAN_LINKS, roles: ["SUPER_ADMIN", "ADMIN", "MODERATOR"] },
      ],
    },
  ];
  return groups;
}

export function AdminSidebar() {
  const admin = useAdmin();
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const badges = useSidebarBadges();
  const navGroups = useNavGroups(badges);

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
    <Sidebar className="border-r-0 bg-white dark:bg-gray-950">
      <SidebarHeader className="px-5 py-5">
        <div className="flex items-center justify-between">
          <Link
            href={ROUTES.ADMIN.DASHBOARD}
            className="flex items-center gap-2.5"
            onClick={() => isMobile && setOpenMobile(false)}
          >
            <div className="flex size-9 items-center justify-center">
              <BrandLogo size={36} />
            </div>
            <span className="text-[17px] font-bold text-gray-900 dark:text-white tracking-tight">Admin Panel</span>
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
            (item) => !item.roles || item.roles.includes(admin.role),
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
                      item.href === ROUTES.ADMIN.DASHBOARD
                        ? pathname === item.href
                        : pathname.startsWith(item.href.split("?")[0]);
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
                          {item.badge !== undefined && item.badge > 0 && (
                            <span className="ml-auto inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-gray-200 dark:bg-gray-700 text-[11px] font-bold text-gray-600 dark:text-gray-300">
                              {item.badge}
                            </span>
                          )}
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
          <div className="size-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-blue-600/20 shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-gray-900 dark:text-white truncate">{admin.full_name}</p>
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
