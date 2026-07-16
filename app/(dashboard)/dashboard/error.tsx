"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="border-0 shadow-sm max-w-md w-full rounded-2xl">
        <CardContent className="p-8 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400">
            <AlertTriangle className="size-6" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            Something went wrong
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            An unexpected error occurred. Please try again.
          </p>
          <Button
            onClick={reset}
            className="mt-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
          >
            Try again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
