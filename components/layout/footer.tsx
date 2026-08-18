import Link from "next/link";
import { ROUTES, SITE } from "@/lib/constants";
import { BrandLogo } from "@/components/brand-logo";
import { ExternalLink, Globe, Send, MessageCircle, Share2, ArrowUpRight, Heart } from "lucide-react";

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
    <footer className="relative border-t border-gray-100 dark:border-white/5 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 h-72 w-[700px] rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div className="space-y-5">
            <Link
              href={ROUTES.HOME}
              className="inline-flex items-center gap-2.5 font-bold text-lg"
            >
              <div className="flex size-9 items-center justify-center">
                <BrandLogo size={36} />
              </div>
              <span className="text-gray-900 dark:text-white">EduConnect</span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">
              The premier coaching management platform for Bangladesh.
              Connect teachers, students, and guardians seamlessly.
            </p>
          </div>

          {/* Platform */}
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

          {/* For */}
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
              <li>
                <span className="cursor-not-allowed">Privacy Policy</span>
              </li>
              <li>
                <span className="cursor-not-allowed">Terms of Service</span>
              </li>
            </ul>
          </div>

          {/* Developer */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Developer
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {DEVELOPER.name}
              <br />
              <span className="text-xs">{DEVELOPER.role}</span>
            </p>
            <ul className="space-y-2.5 text-sm">
              {developerLinks.map(({ href, label, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <span className="flex size-6 items-center justify-center rounded-lg bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-950 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      <Icon className="size-3.5" />
                    </span>
                    {label}
                    <ArrowUpRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-200 dark:border-white/5 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} {SITE.NAME}. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500">
            Crafted with <Heart className="size-3.5 fill-current text-blue-600" /> by{" "}
            <a
              href={DEVELOPER.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {DEVELOPER.name}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}