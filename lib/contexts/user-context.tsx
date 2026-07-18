"use client";

import { createContext, useContext } from "react";

export interface User {
  id: string;
  username?: string;
  full_name: string;
  email: string;
  role: "TEACHER" | "STUDENT" | "GUARDIAN";
  avatar?: { key: string } | null;
  phone?: string | null;
  bio?: string | null;
  country?: string | null;
  state?: string | null;
  city?: string | null;
  area?: string | null;
  address_line?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  gender?: string | null;
  date_of_birth?: string | null;
  is_email_verified?: boolean;
  is_approved?: boolean;
  status?: string;
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
