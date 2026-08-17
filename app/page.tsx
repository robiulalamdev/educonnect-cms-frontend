import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
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


export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* ─── Hero ──────────────────────────────────────────── */}
        <section className="relative overflow-hidden py-28 sm:py-36">
          {/* Ambient glows */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-blue-500/10 blur-3xl" />
            <div className="absolute top-1/2 -left-40 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
            <div className="absolute top-1/2 -right-40 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">

              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                <span className="text-gray-900 dark:text-white">EduConnect</span>
                <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  {" "}Bangladesh
                </span>
                <br />
                <span className="text-gray-900 dark:text-white">Premier Coaching Platform</span>
              </h1>

              <p className="mt-6 text-lg leading-8 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                The ultimate platform for SSC, HSC, and University admission coaching. 
                Connect teachers, students, and guardians seamlessly across the country.
              </p>

              <div className="mt-10 flex items-center justify-center gap-4">
                <Link href={ROUTES.REGISTER}>
                  <Button
                    size="lg"
                    className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-8 h-13 font-semibold text-base shadow-xl shadow-blue-600/25 hover:shadow-blue-600/40 transition-all duration-300 active:scale-[0.98]"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full px-8 h-13 font-semibold text-base border-gray-200/60 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-300"
                  >
                    See Our Work
                  </Button>
                </Link>
              </div>
            </div>


          </div>
        </section>

        {/* ─── Features ──────────────────────────────────────── */}
        <section id="features" className="relative py-28 sm:py-36">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-96 w-[600px] rounded-full bg-blue-500/5 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-gray-900 dark:text-white">
                Everything you need to <span className="text-blue-600">manage coaching</span>
              </h2>
              <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
                From batch management and student enrollments to attendance and fees, 
                EduConnect handles it all.
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:max-w-none">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group glass-card-solid p-7 hover:shadow-2xl hover:shadow-blue-900/5 dark:hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-500"
                >
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-950 transition-colors duration-300">
                    <feature.icon className="size-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── How It Works ──────────────────────────────────── */}
        <section id="how-it-works" className="relative py-28 sm:py-36">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/2 right-0 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-gray-900 dark:text-white">
                How it works
              </h2>
              <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
                Get started in three simple steps.
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-3 lg:max-w-none">
              {steps.map((step) => (
                <div key={step.number} className="relative">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-600 text-white font-bold text-xl mb-6 shadow-xl shadow-blue-600/25">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                  <ul className="mt-5 space-y-3">
                    {step.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300"
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
        <section id="roles" className="relative py-28 sm:py-36">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 h-96 w-[600px] rounded-full bg-indigo-500/5 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-gray-900 dark:text-white">
                Built for <span className="text-blue-600">everyone</span>
              </h2>
              <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
                Whether you are a teacher, student, or guardian, we have got you
                covered.
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-3 lg:max-w-none">
              {roles.map((role) => (
                <div
                  key={role.title}
                  className="group glass-card-solid p-7 hover:shadow-2xl hover:shadow-blue-900/5 dark:hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-500"
                >
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-950 transition-colors duration-300">
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
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA ───────────────────────────────────────────── */}
        <section className="relative py-28 sm:py-36">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-[2rem] bg-blue-600 px-8 py-20 sm:px-16 sm:py-24 text-center shadow-2xl shadow-blue-600/20">
              {/* Decorative elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
              </div>

              <div className="relative">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">
                  Ready to transform your
                  <br />
                  coaching center?
                </h2>
                <p className="mt-4 text-lg text-blue-100 max-w-lg mx-auto">
                  Join thousands of teachers and students across Bangladesh already using EduConnect.
                </p>
                <div className="mt-8">
                  <Link href={ROUTES.REGISTER}>
                    <Button
                      size="lg"
                      className="rounded-full bg-white text-blue-600 hover:bg-gray-100 px-8 h-13 font-semibold text-base shadow-xl transition-all duration-300 active:scale-[0.98]"
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
