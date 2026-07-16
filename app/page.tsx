import Link from "next/link";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES, SITE } from "@/lib/constants";
import {
  GraduationCap,
  Users,
  BookOpen,
  Calendar,
  BarChart3,
  Shield,
  CheckCircle2,
  ArrowRight,
  Star,
  Zap,
  Globe,
  MessageCircle,
  Bell,
  ChevronRight,
} from "lucide-react";

const features = [
  { icon: BookOpen, title: "Service Management", desc: "Create coaching services with flexible batch scheduling, enrollment, and payment tracking." },
  { icon: Users, title: "Student Enrollment", desc: "Streamlined enrollment with approval workflows, waitlist management, and real-time notifications." },
  { icon: Calendar, title: "Attendance & Scheduling", desc: "Mark attendance, manage schedules, and handle overrides with detailed analytics." },
  { icon: BarChart3, title: "Analytics Dashboard", desc: "Comprehensive insights into student performance, revenue, and engagement metrics." },
  { icon: Shield, title: "Secure Payments", desc: "Integrated payment system with screenshot verification, transaction tracking, and receipts." },
  { icon: MessageCircle, title: "Real-time Messaging", desc: "Direct messaging with typing indicators, read receipts, and media sharing." },
];

const stats = [
  { value: "500+", label: "Active Teachers" },
  { value: "10K+", label: "Students Enrolled" },
  { value: "2K+", label: "Batches Running" },
  { value: "99.9%", label: "Platform Uptime" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* ─── Navbar ────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href={ROUTES.HOME} className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[#0066FF] text-white shadow-lg shadow-blue-500/20">
              <GraduationCap className="size-5" />
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">EduConnect</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">Features</a>
            <a href="#stats" className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">About</a>
            <a href="#cta" className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">Contact</a>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href={ROUTES.LOGIN}>
              <Button variant="ghost" size="sm" className="rounded-full px-4 text-gray-600 dark:text-gray-400">Log in</Button>
            </Link>
            <Link href={ROUTES.REGISTER}>
              <Button size="sm" className="rounded-full bg-[#0066FF] hover:bg-[#0052CC] text-white px-5 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ──────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-blue-500/8 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -right-40 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 px-4 py-1.5 text-sm font-medium text-[#0066FF] dark:text-blue-400 mb-8">
            <Star className="size-3.5 fill-current" />
            Trusted by 500+ coaching centers
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white leading-[1.1]">
            Coaching Made
            <span className="block bg-gradient-to-r from-[#0066FF] to-[#60A5FA] bg-clip-text text-transparent mt-2">
              Effortless
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            The all-in-one platform for coaching centers. Manage services, students, payments, and communication — all in one place.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={ROUTES.REGISTER}>
              <Button size="lg" className="rounded-full bg-[#0066FF] hover:bg-[#0052CC] text-white px-8 h-13 text-base font-semibold shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:-translate-y-0.5">
                Start Free Trial
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="rounded-full px-8 h-13 text-base font-semibold border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                See Features
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div id="stats" className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ──────────────────────────────────────── */}
      <section id="features" className="py-20 sm:py-28 bg-gray-50/50 dark:bg-gray-900/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              Everything you need to run
              <span className="text-[#0066FF]"> world-class coaching</span>
            </h2>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
              From service management to real-time communication, we have got every feature covered.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <Card key={f.title} className="group border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-[20px] hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 hover:-translate-y-1 transition-all duration-500">
                <CardContent className="p-6">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-[#0066FF]/10 text-[#0066FF] group-hover:bg-[#0066FF] group-hover:text-white transition-all duration-300">
                    <f.icon className="size-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-gray-900 dark:text-white">{f.title}</h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────── */}
      <section id="cta" className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#0066FF] via-[#2563EB] to-[#3B82F6] px-8 py-16 sm:px-16 sm:py-20 text-center">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
            </div>
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Ready to transform your coaching?
              </h2>
              <p className="mt-4 text-lg text-blue-100 max-w-lg mx-auto">
                Join thousands of coaching centers already using EduConnect to manage their business.
              </p>
              <div className="mt-8">
                <Link href={ROUTES.REGISTER}>
                  <Button size="lg" className="rounded-full bg-white text-[#0066FF] hover:bg-gray-100 px-8 h-13 text-base font-semibold shadow-xl transition-all hover:-translate-y-0.5">
                    Get Started Free
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 dark:border-gray-800/50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-4 gap-8">
            <div className="sm:col-span-2">
              <Link href={ROUTES.HOME} className="flex items-center gap-2.5 mb-4">
                <div className="flex size-8 items-center justify-center rounded-lg bg-[#0066FF] text-white">
                  <GraduationCap className="size-4" />
                </div>
                <span className="font-bold text-gray-900 dark:text-white">EduConnect</span>
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">
                The all-in-one platform for coaching and education management.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li><a href="#features" className="hover:text-gray-900 dark:hover:text-white transition-colors">Features</a></li>
                <li><Link href={ROUTES.LOGIN} className="hover:text-gray-900 dark:hover:text-white transition-colors">Login</Link></li>
                <li><Link href={ROUTES.REGISTER} className="hover:text-gray-900 dark:hover:text-white transition-colors">Sign up</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li><span className="cursor-not-allowed">Privacy Policy</span></li>
                <li><span className="cursor-not-allowed">Terms of Service</span></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-800/50 text-center text-sm text-gray-400 dark:text-gray-500">
            &copy; {new Date().getFullYear()} {SITE.NAME}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
