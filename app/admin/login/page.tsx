import type { Metadata } from "next";
import Link from "next/link";
import { Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { AdminLoginForm } from "./admin-login-form";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Admin panel login",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="mb-6 text-center">
              <Link href={ROUTES.HOME} className="inline-flex items-center gap-2 font-bold text-lg">
                <Shield className="size-6 text-primary" />
                <span>Admin Panel</span>
              </Link>
              <h1 className="mt-4 text-2xl font-bold">Admin Login</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Sign in to the admin dashboard
              </p>
            </div>

            <AdminLoginForm />

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <Link href={ROUTES.LOGIN} className="font-medium text-primary hover:underline">
                &larr; Back to user login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
