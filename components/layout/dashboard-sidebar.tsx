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
} from "@/components/ui/sidebar";
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
  { title: "Services", icon: BookOpen, href: ROUTES.USER.SERVICES },
  { title: "Batches", icon: GraduationCap, href: ROUTES.USER.BATCHES },
  { title: "Enrollments", icon: CreditCard, href: ROUTES.USER.ENROLLMENTS },
  { title: "Messages", icon: MessageSquare, href: ROUTES.USER.MESSAGES },
  { title: "Notifications", icon: Bell, href: ROUTES.USER.NOTIFICATIONS },
  { title: "Settings", icon: Settings, href: ROUTES.USER.SETTINGS },
];

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const initials = user.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-3">
        <Link href={ROUTES.USER.DASHBOARD} className="flex items-center gap-2 font-bold">
          <GraduationCap className="size-5 text-primary" />
          <span>CMS</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
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
                    >
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.full_name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
