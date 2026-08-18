import Link from "next/link";
import { ROUTES, SITE } from "@/lib/constants";
import { BrandLogo } from "@/components/brand-logo";
import { ExternalLink, Globe, Send, MessageCircle, Share2 } from "lucide-react";

const DEVELOPER = {
  name: "Robiul Alam",
  role: "Full Stack Developer",
  portfolio: "https://robiulalamdev.vercel.app",
  linkedin: "https://www.linkedin.com/in/robiulalamdev",
  facebook: "https://www.facebook.com/robiulalamdev",
  telegram: "https://t.me/robiulalamdev",
  whatsapp: "https://wa.me/8801751299132",
};

const developerLinks = [
  { href: DEVELOPER.portfolio, label: "Portfolio", icon: Globe },
  { href: DEVELOPER.linkedin, label: "LinkedIn", icon: ExternalLink },
  { href: DEVELOPER.facebook, label: "Facebook", icon: Share2 },
  { href: DEVELOPER.telegram, label: "Telegram", icon: Send },
  { href: DEVELOPER.whatsapp, label: "WhatsApp", icon: MessageCircle },
];

export function Footer() {
  return (
    <footer className="border-t border-gray-100 dark:border-white/5">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          <div className="space-y-4">
            <Link
              href={ROUTES.HOME}
              className="inline-flex items-center gap-2.5 font-bold text-lg"
            >
              <div className="flex size-8 items-center justify-center">
                <BrandLogo size={32} />
              </div>
              <span className="text-gray-900 dark:text-white">EduConnect</span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">
              The premier coaching management platform for Bangladesh.
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

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Developer
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              {DEVELOPER.name} — {DEVELOPER.role}
            </p>
            <ul className="space-y-3 text-sm">
              {developerLinks.map(({ href, label, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <Icon className="size-4" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 dark:border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} {SITE.NAME}. All rights reserved.
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Developed by{" "}
            <a
              href={DEVELOPER.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {DEVELOPER.name}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
