import Link from "next/link";
import { ROUTES, SITE } from "@/lib/constants";
import { GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-4">
            <Link
              href={ROUTES.HOME}
              className="inline-flex items-center gap-2.5 font-bold text-lg"
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <GraduationCap className="size-4.5" />
              </div>
              <span className="text-gray-900 dark:text-white">CMS</span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">
              A comprehensive platform for coaching and education management.
              Connect teachers, students, and guardians seamlessly.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Platform
            </h3>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <Link href="#features" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href={ROUTES.LOGIN} className="hover:text-gray-900 dark:hover:text-white transition-colors">
                  Log in
                </Link>
              </li>
              <li>
                <Link href={ROUTES.REGISTER} className="hover:text-gray-900 dark:hover:text-white transition-colors">
                  Sign up
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              For
            </h3>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <Link href={ROUTES.REGISTER} className="hover:text-gray-900 dark:hover:text-white transition-colors">
                  Teachers
                </Link>
              </li>
              <li>
                <Link href={ROUTES.REGISTER} className="hover:text-gray-900 dark:hover:text-white transition-colors">
                  Students
                </Link>
              </li>
              <li>
                <Link href={ROUTES.REGISTER} className="hover:text-gray-900 dark:hover:text-white transition-colors">
                  Guardians
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Legal
            </h3>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <span className="cursor-not-allowed">Privacy Policy</span>
              </li>
              <li>
                <span className="cursor-not-allowed">Terms of Service</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} {SITE.NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            Built with
            <span className="text-red-500">&hearts;</span>
            for education
          </div>
        </div>
      </div>
    </footer>
  );
}
