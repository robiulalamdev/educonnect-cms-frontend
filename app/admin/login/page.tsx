import type { Metadata } from "next";
import Link from "next/link";
import { Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { AdminLoginForm } from "./admin-login-form";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Admin panel login for Coaching Management System",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50/80 via-white to-blue-50/40 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4">
      <div className="w-full max-w-md">
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>

        <Card className="border-0 shadow-xl shadow-blue-900/5 dark:shadow-blue-500/5">
          <CardContent className="p-8">
            <div className="mb-8 text-center">
              <Link
                href={ROUTES.HOME}
                className="inline-flex items-center gap-2 font-bold text-xl"
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <Shield className="size-5" />
                </div>
                <span>Admin Panel</span>
              </Link>
              <h1 className="mt-6 text-2xl font-bold tracking-tight">
                Admin Login
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Sign in to the admin dashboard
              </p>
            </div>

            <AdminLoginForm />

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <Link
                href={ROUTES.LOGIN}
                className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                &larr; Back to user login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
