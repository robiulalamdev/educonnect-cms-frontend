import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your account to get started",
};

export default function RegisterPage() {
  return (
    <>
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="mb-6 text-center">
            <Link href={ROUTES.HOME} className="inline-flex items-center gap-2 font-bold text-lg">
              <GraduationCap className="size-6 text-primary" />
              <span>CMS</span>
            </Link>
            <h1 className="mt-4 text-2xl font-bold">Create your account</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Join thousands of educators and learners
            </p>
          </div>

          <RegisterForm />

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href={ROUTES.LOGIN} className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
