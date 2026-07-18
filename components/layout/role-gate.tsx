"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { canAccessRoute } from "@/lib/role-routes";
import { ROUTES } from "@/lib/constants";

export function RoleGate({ role, children }: { role: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!canAccessRoute(role, pathname)) {
      router.replace(ROUTES.USER.DASHBOARD);
    }
  }, [role, pathname, router]);

  if (!canAccessRoute(role, pathname)) {
    return null;
  }

  return <>{children}</>;
}
