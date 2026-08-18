import type { Metadata } from "next";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { BrandLogo } from "@/components/brand-logo";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your EduConnect account",
};

export default function RegisterPage() {
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
            Create your account
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Join thousands of educators and learners
          </p>
        </div>

        <RegisterForm />

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            href={ROUTES.LOGIN}
            className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </>
  );
}
