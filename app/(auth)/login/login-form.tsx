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
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200/60 dark:border-red-800/60 p-3.5 text-sm text-red-600 dark:text-red-400">
          <p>{state.error}</p>
          {state.error.toLowerCase().includes("verify") && (
            <Link href="/verify-email" className="mt-1 inline-block font-semibold underline underline-offset-2">Resend verification &rarr;</Link>
          )}
        </div>
      )}
      <div className="space-y-2">
        <Label className="text-[13px] font-medium text-gray-700 dark:text-gray-300">Email</Label>
        <Input name="email" type="email" placeholder="you@example.com" required autoComplete="email" disabled={isPending} className="h-11 rounded-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-[#0066FF] focus:ring-[#0066FF]/20" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-[13px] font-medium text-gray-700 dark:text-gray-300">Password</Label>
          <Link href="/forgot-password" className="text-xs font-medium text-[#0066FF] hover:text-[#0052CC]">Forgot?</Link>
        </div>
        <Input name="password" type="password" placeholder="••••••••" required autoComplete="current-password" disabled={isPending} className="h-11 rounded-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-[#0066FF] focus:ring-[#0066FF]/20" />
      </div>
      <Button type="submit" className="w-full h-11 rounded-full bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all" disabled={isPending}>
        {isPending ? <><Loader2 className="mr-2 size-4 animate-spin" /> Signing in...</> : "Sign in"}
      </Button>
    </form>
  );
}
