import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { BrandLogo } from "@/components/brand-logo";
import { VerifyEmailForm } from "./verify-email-form";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your email address to activate your account",
};

export default function VerifyEmailPage() {
  return (
    <>
      <div className="absolute right-4 top-4 z-20">
        <ThemeToggle />
      </div>

      <div className="glass-card p-8">
        <div className="mb-8 text-center">
          <Link
            href={ROUTES.HOME}
            className="inline-flex items-center gap-2.5 font-bold text-xl"
          >
            <div className="flex size-10 items-center justify-center">
              <BrandLogo size={40} />
            </div>
            <span className="text-gray-900 dark:text-white">EduConnect</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Check your email
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            We sent a verification code to your email address. Enter it below to verify your account.
          </p>
        </div>

        <Suspense fallback={<div className="space-y-4 animate-pulse"><div className="h-12 rounded-2xl bg-gray-100 dark:bg-gray-800" /><div className="h-12 rounded-2xl bg-gray-100 dark:bg-gray-800" /></div>}>
          <VerifyEmailForm />
        </Suspense>
      </div>
    </>
  );
}
