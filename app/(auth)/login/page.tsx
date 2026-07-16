import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your Coaching Management System account",
};

export default function LoginPage() {
  return (
    <>
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
                <GraduationCap className="size-5" />
              </div>
              <span>CMS</span>
            </Link>
            <h1 className="mt-6 text-2xl font-bold tracking-tight">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <LoginForm />

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href={ROUTES.REGISTER}
              className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Sign up for free
            </Link>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
