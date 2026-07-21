"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { forgotPasswordAction } from "@/lib/actions/auth";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await forgotPasswordAction(email);

      if (res.success) {
        setSent(true);
      } else {
        setError(res.error || "Something went wrong");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <Card className="border border-gray-100 dark:border-gray-800 rounded-[24px]">
        <CardContent className="p-8 text-center">
          <CheckCircle className="size-12 text-green-500 mx-auto" />
          <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
            Check your email
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            If an account exists with <strong>{email}</strong>, we&apos;ve sent a
            password reset link.
          </p>
          <Link href={ROUTES.LOGIN}>
            <Button variant="outline" className="mt-6 rounded-full">
              <ArrowLeft className="size-4 mr-2" />
              Back to Login
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-100 dark:border-gray-800 rounded-[24px]">
      <CardContent className="p-8">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Forgot your password?
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-950/50 p-3 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 rounded-xl"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full rounded-xl"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href={ROUTES.LOGIN}
            className="text-sm text-blue-600 hover:text-blue-500 inline-flex items-center gap-1"
          >
            <ArrowLeft className="size-3.5" />
            Back to Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
