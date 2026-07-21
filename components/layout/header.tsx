import Link from "next/link";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { GraduationCap } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass-card mx-auto mt-3 flex h-14 items-center justify-between px-5 sm:px-6">
          <Link
            href={ROUTES.HOME}
            className="flex items-center gap-2.5 font-bold text-lg"
          >
            <div className="flex size-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
              <GraduationCap className="size-4.5" />
            </div>
            <span className="text-gray-900 dark:text-white">EduConnect BD</span>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            <Link
              href="#features"
              className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#roles"
              className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              For Everyone
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href={ROUTES.LOGIN}>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-xl"
              >
                Log in
              </Button>
            </Link>
            <Link href={ROUTES.REGISTER}>
              <Button
                size="sm"
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 h-9 font-semibold shadow-md shadow-blue-600/20 hover:shadow-blue-600/30 transition-all duration-300"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
