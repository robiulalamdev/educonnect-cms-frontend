import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

export const metadata: Metadata = {
  title: "My Batches",
  description: "Manage your batches",
};

export default function BatchesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">My Batches</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your class batches</p>
      </div>
      <Card className="border-0 shadow-sm rounded-2xl dark:bg-gray-900 dark:border dark:border-gray-800">
        <CardContent className="p-12 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-400">
            <GraduationCap className="size-6" />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">Coming soon</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Batch management will be available shortly.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
