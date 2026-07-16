"use client";

import { useActionState } from "react";
import { adminLoginAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(adminLoginAction, {});

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <div className="rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200/60 dark:border-red-800/60 p-4 text-sm text-red-600 dark:text-red-400 backdrop-blur-sm">
          {state.error}
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
          placeholder="admin@example.com"
          required
          autoComplete="email"
          disabled={isPending}
          className="h-12 rounded-2xl bg-white/50 dark:bg-white/5 border-gray-200/60 dark:border-white/10 backdrop-blur-sm focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="password"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Password
        </Label>
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
