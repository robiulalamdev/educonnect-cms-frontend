import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants";
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
  Target,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Service Management",
    description:
      "Create and manage coaching services with flexible batch scheduling and enrollment.",
  },
  {
    icon: Users,
    title: "Student Enrollment",
    description:
      "Streamlined enrollment process with approval workflows and waitlist management.",
  },
  {
    icon: Calendar,
    title: "Attendance Tracking",
    description:
      "Mark and track student attendance with detailed reports and analytics.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description:
      "Comprehensive dashboard with insights into student performance and business metrics.",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description:
      "Integrated payment system with screenshot verification and transaction tracking.",
  },
  {
    icon: GraduationCap,
    title: "Multi-Role Support",
    description:
      "Dedicated dashboards for teachers, students, and guardians with role-based access.",
  },
];

const steps = [
  {
    number: "01",
    title: "Create Your Account",
    description:
      "Sign up as a teacher, student, or guardian. Complete your profile and get started in minutes.",
    items: ["Quick registration", "Email verification", "Profile setup"],
  },
  {
    number: "02",
    title: "Set Up Services",
    description:
      "Teachers create coaching services, define batches, set schedules, and configure payment methods.",
    items: ["Service creation", "Batch management", "Schedule configuration"],
  },
  {
    number: "03",
    title: "Connect & Learn",
    description:
      "Students enroll in batches, attend classes, submit tasks, and track their learning progress.",
    items: ["Easy enrollment", "Task submission", "Progress tracking"],
  },
];

const roles = [
  {
    title: "Teachers",
    description:
      "Manage your coaching services, batches, and students from one powerful dashboard.",
    benefits: [
      "Create & manage services",
      "Track attendance",
      "Assign tasks & notes",
      "Accept payments",
    ],
    icon: BookOpen,
  },
  {
    title: "Students",
    description:
      "Access your classes, submit assignments, and track your learning progress.",
    benefits: [
      "Join batches",
      "View schedules",
      "Submit tasks",
      "Track progress",
    ],
    icon: GraduationCap,
  },
  {
    title: "Guardians",
    description:
      "Stay connected with your child's education and monitor their progress.",
    benefits: [
      "Link to students",
      "View attendance",
      "Track performance",
      "Monitor payments",
    ],
    icon: Users,
  },
];

const stats = [
  { value: "500+", label: "Teachers" },
  { value: "10K+", label: "Students" },
  { value: "2K+", label: "Batches" },
  { value: "99.9%", label: "Uptime" },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* ─── Hero ──────────────────────────────────────────── */}
        <section className="relative overflow-hidden py-24 sm:py-32">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-white dark:from-blue-950/20 dark:to-gray-950" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-950/50 px-4 py-1.5 text-sm font-medium text-blue-700 dark:text-blue-300 mb-6">
                <Star className="size-3.5" />
                Trusted by 500+ coaching centers
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                Coaching Made{" "}
                <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Simple
                </span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                A comprehensive platform for coaching and education management.
                Connect teachers, students, and guardians seamlessly.
              </p>
              <div className="mt-10 flex items-center justify-center gap-4">
                <Link href={ROUTES.REGISTER}>
                  <Button
                    size="lg"
                    className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 font-medium text-base"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full px-8 h-12 font-medium text-base"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-20 grid grid-cols-2 gap-8 sm:grid-cols-4 max-w-3xl mx-auto">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Features ──────────────────────────────────────── */}
        <section id="features" className="py-24 sm:py-32 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Everything you need
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                Built for modern coaching centers with all the tools you need to
                succeed.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:max-w-none">
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  className="group border-0 shadow-sm hover:shadow-md dark:bg-gray-900 dark:border dark:border-gray-800 transition-all duration-300 rounded-2xl"
                >
                  <CardContent className="p-7">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-950 transition-colors">
                      <feature.icon className="size-6" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ─── How It Works ──────────────────────────────────── */}
        <section id="how-it-works" className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                How it works
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                Get started in three simple steps.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-3 lg:max-w-none">
              {steps.map((step) => (
                <div key={step.number} className="relative">
                  <div className="flex size-12 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg mb-5">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                  <ul className="mt-5 space-y-2">
                    {step.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
                      >
                        <CheckCircle2 className="size-4 text-blue-600 dark:text-blue-400 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Roles ─────────────────────────────────────────── */}
        <section id="roles" className="py-24 sm:py-32 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Built for everyone
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                Whether you are a teacher, student, or guardian, we have got you
                covered.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-3 lg:max-w-none">
              {roles.map((role) => (
                <Card
                  key={role.title}
                  className="group border-0 shadow-sm hover:shadow-md dark:bg-gray-900 dark:border dark:border-gray-800 transition-all duration-300 rounded-2xl"
                >
                  <CardContent className="p-7">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-950 transition-colors">
                      <role.icon className="size-6" />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-gray-900 dark:text-white">
                      {role.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                      {role.description}
                    </p>
                    <ul className="mt-6 space-y-3">
                      {role.benefits.map((benefit) => (
                        <li
                          key={benefit}
                          className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300"
                        >
                          <CheckCircle2 className="size-4 text-blue-600 dark:text-blue-400 shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA ───────────────────────────────────────────── */}
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-blue-600 px-8 py-16 sm:px-16 sm:py-20 text-center">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMS41IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-40" />
              <div className="relative">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">
                  Ready to get started?
                </h2>
                <p className="mt-4 text-lg text-blue-100">
                  Join thousands of coaching centers already using CMS.
                </p>
                <div className="mt-8">
                  <Link href={ROUTES.REGISTER}>
                    <Button
                      size="lg"
                      className="rounded-full bg-white text-blue-600 hover:bg-gray-100 px-8 h-12 font-medium text-base"
                    >
                      Create Your Account
                      <ArrowRight className="ml-2 size-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
