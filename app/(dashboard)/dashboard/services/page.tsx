import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "My Services",
  description: "Manage your coaching services",
};

export default function ServicesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">My Services</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Create and manage your coaching services</p>
      </div>
      <Card className="border-0 shadow-sm rounded-2xl dark:bg-gray-900 dark:border dark:border-gray-800">
        <CardContent className="p-12 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-400">
            <BookOpen className="size-6" />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">Coming soon</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Service management will be available shortly. You can create services through the API.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
