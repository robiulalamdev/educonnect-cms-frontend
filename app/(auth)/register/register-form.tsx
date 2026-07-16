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
        <div className="rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 p-3 text-sm text-red-600 dark:text-red-400">
          {state.error}
        </div>
      )}

      {state.success && state.message && (
        <div className="rounded-lg bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 p-3 text-sm text-green-600 dark:text-green-400">
          {state.message}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="full_name" className="text-sm font-medium">
          Full Name
        </Label>
        <Input
          id="full_name"
          name="full_name"
          placeholder="John Doe"
          required
          autoComplete="name"
          disabled={isPending}
          className="h-11 rounded-lg"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
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
          className="h-11 rounded-lg"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">
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
          className="h-11 rounded-lg"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm font-medium">
          Phone <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="+880 1XXXXXXXXX"
          autoComplete="tel"
          disabled={isPending}
          className="h-11 rounded-lg"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">I am a</Label>
        <div className="grid grid-cols-3 gap-2">
          {(["TEACHER", "STUDENT", "GUARDIAN"] as const).map((role) => (
            <label
              key={role}
              className="flex cursor-pointer items-center justify-center rounded-lg border-2 p-3 text-sm font-medium transition-all hover:border-blue-200 hover:bg-blue-50/50 dark:hover:border-blue-800 dark:hover:bg-blue-950/50 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50 dark:has-[:checked]:border-blue-500 dark:has-[:checked]:bg-blue-950/50 has-[:checked]:text-blue-600 dark:has-[:checked]:text-blue-400"
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
        className="w-full h-11 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"
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
