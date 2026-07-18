"use client";

import { createContext, useContext } from "react";

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: "TEACHER" | "STUDENT" | "GUARDIAN";
  avatar?: { key: string } | null;
  phone?: string | null;
  bio?: string | null;
  city?: string | null;
  area?: string | null;
  country?: string | null;
  gender?: string | null;
  created_at?: string;
  [key: string]: any;
}

const UserContext = createContext<User | null>(null);

export function UserProvider({ user, children }: { user: User; children: React.ReactNode }) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
