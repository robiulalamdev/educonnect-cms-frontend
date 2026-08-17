import Link from "next/link";
import { GraduationCap, Home, Compass, Search } from "lucide-react";
import { Header } from "@/components/layout/header";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FB] dark:bg-[#101014]">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-lg w-full text-center">
          <div className="relative inline-flex mb-8">
            <div className="flex size-24 items-center justify-center rounded-3xl bg-blue-600 text-white shadow-2xl shadow-blue-600/30">
              <GraduationCap className="size-12" />
            </div>
            <div className="absolute -top-3 -right-3 flex size-10 items-center justify-center rounded-full bg-red-500 text-white text-lg font-bold shadow-lg">
              404
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Page not found
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or may have been moved.
            Let&apos;s get you back on track.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700"
            >
              <Home className="size-4" /> Back to Home
            </Link>
            <Link
              href="/discover"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 transition hover:border-gray-300 dark:hover:border-gray-600"
            >
              <Compass className="size-4" /> Explore Discover
            </Link>
          </div>

          <div className="mt-10 inline-flex items-center gap-2 rounded-full border border-dashed border-gray-300 dark:border-gray-700 px-4 py-2 text-sm text-gray-400 dark:text-gray-500">
            <Search className="size-4" />
            Try searching from the navigation above
          </div>
        </div>
      </main>
    </div>
  );
}
