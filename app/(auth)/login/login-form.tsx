"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, {});

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <div className="rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200/60 dark:border-red-800/60 p-4 text-sm text-red-600 dark:text-red-400 backdrop-blur-sm">
          <p>{state.error}</p>
          {state.error.toLowerCase().includes("verify") && (
            <Link
              href="/verify-email"
              className="mt-2 inline-block font-semibold underline underline-offset-2 hover:text-red-700 dark:hover:text-red-300"
            >
              Resend verification code &rarr;
            </Link>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label
          htmlFor="email"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          autoComplete="email"
          disabled={isPending}
          className="h-12 rounded-2xl bg-white/50 dark:bg-white/5 border-gray-200/60 dark:border-white/10 backdrop-blur-sm focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="password"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Password
          </Label>
          <a
            href="#"
            className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            Forgot password?
          </a>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          autoComplete="current-password"
          disabled={isPending}
          className="h-12 rounded-2xl bg-white/50 dark:bg-white/5 border-gray-200/60 dark:border-white/10 backdrop-blur-sm focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
        />
      </div>

      <Button
        type="submit"
        className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all duration-300 active:scale-[0.98]"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  );
}
