"use client";

import { useActionState, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  verifyEmailAction,
  resendVerificationAction,
} from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/lib/constants";
import { Loader2, CheckCircle2, Mail, ArrowLeft } from "lucide-react";

export function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email") ?? "";
  const [email, setEmail] = useState(emailFromUrl);
  const [verifyState, verifyFormAction, isVerifying] = useActionState(
    verifyEmailAction,
    {},
  );
  const [resendState, resendFormAction, isResending] = useActionState(
    resendVerificationAction,
    {},
  );
  const [verified, setVerified] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const fullOtpToken = otp.join("");

  const handleOtpChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (!value) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }
    
    // Handle paste in a single box
    if (value.length > 1) {
      const chars = value.split("").slice(0, 6);
      const newOtp = [...otp];
      chars.forEach((char, i) => {
        if (index + i < 6) newOtp[index + i] = char;
      });
      setOtp(newOtp);
      const nextFocus = Math.min(index + chars.length, 5);
      inputRefs.current[nextFocus]?.focus();
      return;
    }
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (index < 5 && value) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
    if (pastedData) {
      const newOtp = [...otp];
      pastedData.split("").forEach((char, i) => {
        if (i < 6) newOtp[i] = char;
      });
      setOtp(newOtp);
      const nextFocus = Math.min(pastedData.length, 5);
      inputRefs.current[nextFocus]?.focus();
    }
  };

  if (verified || verifyState.success) {
    return (
      <div className="text-center space-y-6">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400">
          <CheckCircle2 className="size-8" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Email verified!
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Your account has been activated. You can now sign in.
          </p>
        </div>
        <Link href={ROUTES.LOGIN}>
          <Button className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-base shadow-lg shadow-blue-600/25">
            Sign in to your account
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {verifyState.error && (
        <div className="rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200/60 dark:border-red-800/60 p-4 text-sm text-red-600 dark:text-red-400">
          {verifyState.error}
        </div>
      )}

      {resendState.message && (
        <div className="rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200/60 dark:border-blue-800/60 p-4 text-sm text-blue-600 dark:text-blue-400">
          <div className="flex items-start gap-3">
            <Mail className="size-4 mt-0.5 shrink-0" />
            <span>{resendState.message}</span>
          </div>
        </div>
      )}

      {/* Email Input (if not from URL) */}
      {!emailFromUrl && (
        <form action={resendFormAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resend-email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Enter your email to resend verification code
            </Label>
            <Input
              id="resend-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isResending}
              className="h-12 rounded-2xl bg-white/50 dark:bg-white/5 border-gray-200/60 dark:border-white/10 backdrop-blur-sm"
            />
          </div>
          <Button
            type="submit"
            className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-base shadow-lg shadow-blue-600/25"
            disabled={isResending || !email}
          >
            {isResending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send verification code"
            )}
          </Button>
        </form>
      )}

      {/* Verification Code Form */}
      <form action={verifyFormAction} className="space-y-4">
        <input type="hidden" name="email" value={email} />
        <div className="space-y-4">
          <Label htmlFor="token" className="text-sm font-medium text-gray-700 dark:text-gray-300 block text-center">
            Verification code
          </Label>
          
          <div className="flex justify-center gap-2 sm:gap-3" onPaste={handleOtpPaste}>
            {otp.map((digit, index) => (
              <Input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={digit}
                ref={(el) => { inputRefs.current[index] = el; }}
                onChange={(e) => handleOtpChange(index, e)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                disabled={isVerifying}
                className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-semibold rounded-2xl bg-white/50 dark:bg-white/5 border-gray-200/60 dark:border-white/10 backdrop-blur-sm focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
              />
            ))}
          </div>
          <input type="hidden" name="token" value={fullOtpToken} />

          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
            Check your email inbox (and spam folder) for the verification code.
          </p>
        </div>

        <Button
          type="submit"
          className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-base shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all duration-300"
          disabled={isVerifying || !email || fullOtpToken.length !== 6}
        >
          {isVerifying ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify Email"
          )}
        </Button>
      </form>

      {/* Resend Code (only show if email is from URL) */}
      {emailFromUrl && (
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Didn&apos;t receive the code?
          </p>
          <form action={resendFormAction}>
            <input type="hidden" name="email" value={email} />
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              disabled={isResending}
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 size-3 animate-spin" />
                  Sending...
                </>
              ) : (
                "Resend verification code"
              )}
            </Button>
          </form>
        </div>
      )}

      {/* Back to login */}
      <div className="text-center">
        <Link
          href={ROUTES.LOGIN}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
