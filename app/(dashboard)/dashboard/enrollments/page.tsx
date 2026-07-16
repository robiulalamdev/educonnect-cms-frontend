import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

export const metadata: Metadata = {
  title: "Enrollments",
  description: "Manage your enrollments",
};

export default function EnrollmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Enrollments</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">View and manage enrollments</p>
      </div>
      <Card className="border-0 shadow-sm rounded-2xl dark:bg-gray-900 dark:border dark:border-gray-800">
        <CardContent className="p-12 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-400">
            <CreditCard className="size-6" />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">Coming soon</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Enrollment management will be available shortly.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
