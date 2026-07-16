"use client";

import { useActionState } from "react";
import { registerAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, {});

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <div className="rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200/60 dark:border-red-800/60 p-4 text-sm text-red-600 dark:text-red-400 backdrop-blur-sm">
          {state.error}
        </div>
      )}

      <div className="space-y-2">
        <Label
          htmlFor="full_name"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Full Name
        </Label>
        <Input
          id="full_name"
          name="full_name"
          placeholder="John Doe"
          required
          autoComplete="name"
          disabled={isPending}
          className="h-12 rounded-2xl bg-white/50 dark:bg-white/5 border-gray-200/60 dark:border-white/10 backdrop-blur-sm focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
        />
      </div>

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
          placeholder="Min. 8 characters"
          required
          minLength={8}
          autoComplete="new-password"
          disabled={isPending}
          className="h-12 rounded-2xl bg-white/50 dark:bg-white/5 border-gray-200/60 dark:border-white/10 backdrop-blur-sm focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="phone"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Phone{" "}
          <span className="text-gray-400 font-normal">(optional)</span>
        </Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="+880 1XXXXXXXXX"
          autoComplete="tel"
          disabled={isPending}
          className="h-12 rounded-2xl bg-white/50 dark:bg-white/5 border-gray-200/60 dark:border-white/10 backdrop-blur-sm focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          I am a
        </Label>
        <div className="grid grid-cols-3 gap-3">
          {(["TEACHER", "STUDENT", "GUARDIAN"] as const).map((role) => (
            <label
              key={role}
              className="flex cursor-pointer items-center justify-center rounded-2xl border-2 border-gray-200/60 dark:border-white/10 bg-white/50 dark:bg-white/5 p-3.5 text-sm font-medium transition-all duration-300 hover:border-blue-300 hover:bg-blue-50/50 dark:hover:border-blue-800 dark:hover:bg-blue-950/30 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50 dark:has-[:checked]:border-blue-500 dark:has-[:checked]:bg-blue-950/30 has-[:checked]:text-blue-600 dark:has-[:checked]:text-blue-400 has-[:checked]:shadow-lg has-[:checked]:shadow-blue-600/10"
            >
              <input
                type="radio"
                name="role"
                value={role}
                className="sr-only"
                defaultChecked={role === "STUDENT"}
              />
              {role.charAt(0) + role.slice(1).toLowerCase()}
            </label>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all duration-300 active:scale-[0.98]"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  );
}
