import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your account",
};

export default function LoginPage() {
  return (
    <>
      <div className="absolute right-4 top-4 z-20"><ThemeToggle /></div>
      <Card className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-[24px] shadow-xl shadow-gray-200/30 dark:shadow-gray-900/50">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <Link href={ROUTES.HOME} className="inline-flex items-center gap-2.5 font-bold text-xl">
              <div className="flex size-10 items-center justify-center">
                <BrandLogo size={40} />
              </div>
              <span className="text-gray-900 dark:text-white">EduConnect</span>
            </Link>
            <h1 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Sign in to your account to continue</p>
          </div>
          <LoginForm />
          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <Link href={ROUTES.REGISTER} className="font-semibold text-[#0066FF] hover:text-[#0052CC]">Sign up free</Link>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
