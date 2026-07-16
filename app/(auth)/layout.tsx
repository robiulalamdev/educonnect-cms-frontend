import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50/80 via-white to-blue-50/40 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
