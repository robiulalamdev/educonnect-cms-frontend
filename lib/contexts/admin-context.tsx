"use client";

import { createContext, useContext, type ReactNode } from "react";

export interface AdminUser {
  id: string;
  full_name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "MODERATOR";
  status: "ACTIVE" | "INACTIVE";
  last_login?: string;
  created_at: string;
  avatar?: { id: string; key: string } | null;
}

const AdminContext = createContext<AdminUser | null>(null);

export function AdminProvider({
  admin,
  children,
}: {
  admin: AdminUser;
  children: ReactNode;
}) {
  return (
    <AdminContext.Provider value={admin}>{children}</AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
