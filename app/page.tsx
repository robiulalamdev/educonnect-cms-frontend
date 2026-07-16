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
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Service Management",
    description: "Create and manage coaching services with flexible batch scheduling and enrollment.",
  },
  {
    icon: Users,
    title: "Student Enrollment",
    description: "Streamlined enrollment process with approval workflows and waitlist management.",
  },
  {
    icon: Calendar,
    title: "Attendance Tracking",
    description: "Mark and track student attendance with detailed reports and analytics.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description: "Comprehensive dashboard with insights into student performance and business metrics.",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Integrated payment system with screenshot verification and transaction tracking.",
  },
  {
    icon: GraduationCap,
    title: "Multi-Role Support",
    description: "Dedicated dashboards for teachers, students, and guardians with role-based access.",
  },
];

const roles = [
  {
    title: "Teachers",
    description: "Manage your coaching services, batches, and students from one powerful dashboard.",
    benefits: ["Create & manage services", "Track attendance", "Assign tasks & notes", "Accept payments"],
  },
  {
    title: "Students",
    description: "Access your classes, submit assignments, and track your learning progress.",
    benefits: ["Join batches", "View schedules", "Submit tasks", "Track progress"],
  },
  {
    title: "Guardians",
    description: "Stay connected with your child's education and monitor their progress.",
    benefits: ["Link to students", "View attendance", "Track performance", "Monitor payments"],
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden py-20 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                Coaching Made{" "}
                <span className="text-primary">Simple</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                A comprehensive platform for coaching and education management.
                Connect teachers, students, and guardians seamlessly.
              </p>
              <div className="mt-10 flex items-center justify-center gap-4">
                <Link href={ROUTES.REGISTER}>
                  <Button size="lg" className="px-8">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" size="lg" className="px-8">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-t py-20 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Built for modern coaching centers with all the tools you need to succeed.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:max-w-none">
              {features.map((feature) => (
                <Card key={feature.title} className="relative overflow-hidden">
                  <CardContent className="p-6">
                    <feature.icon className="size-10 text-primary mb-4" />
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Roles */}
        <section id="about" className="border-t py-20 sm:py-32 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Built for everyone
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Whether you are a teacher, student, or guardian, we have got you covered.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-3 lg:max-w-none">
              {roles.map((role) => (
                <Card key={role.title}>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold">{role.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {role.description}
                    </p>
                    <ul className="mt-6 space-y-3">
                      {role.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="size-4 text-primary shrink-0" />
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

        {/* CTA */}
        <section className="border-t py-20 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands of coaching centers already using CMS.
            </p>
            <div className="mt-10">
              <Link href={ROUTES.REGISTER}>
                <Button size="lg" className="px-8">
                  Create Your Account
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
