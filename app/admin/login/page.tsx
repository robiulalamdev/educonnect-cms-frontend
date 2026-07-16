import type { Metadata } from "next";
import Link from "next/link";
import { Shield } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { AdminLoginForm } from "./admin-login-form";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Admin panel login for Coaching Management System",
};

export default function AdminLoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      {/* Ambient glow background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="absolute right-4 top-4 z-20">
          <ThemeToggle />
        </div>

        <div className="glass-card p-8">
          <div className="mb-8 text-center">
            <Link
              href={ROUTES.HOME}
              className="inline-flex items-center gap-2.5 font-bold text-xl"
            >
              <div className="flex size-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/25">
                <Shield className="size-5" />
              </div>
              <span className="text-gray-900 dark:text-white">Admin Panel</span>
            </Link>
            <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Admin Login
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Sign in to the admin dashboard
            </p>
          </div>

          <AdminLoginForm />

          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            <Link
              href={ROUTES.LOGIN}
              className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              &larr; Back to user login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
