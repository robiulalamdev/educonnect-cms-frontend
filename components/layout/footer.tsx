import Link from "next/link";
import { ROUTES, SITE } from "@/lib/constants";
import { GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href={ROUTES.HOME} className="flex items-center gap-2 font-bold text-lg">
              <GraduationCap className="size-5 text-primary" />
              <span>CMS</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              A comprehensive platform for coaching and education management.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Platform</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#features" className="hover:text-foreground transition-colors">Features</Link></li>
              <li><Link href="#about" className="hover:text-foreground transition-colors">About</Link></li>
              <li><Link href={ROUTES.LOGIN} className="hover:text-foreground transition-colors">Log in</Link></li>
              <li><Link href={ROUTES.REGISTER} className="hover:text-foreground transition-colors">Sign up</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">For</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href={ROUTES.REGISTER} className="hover:text-foreground transition-colors">Teachers</Link></li>
              <li><Link href={ROUTES.REGISTER} className="hover:text-foreground transition-colors">Students</Link></li>
              <li><Link href={ROUTES.REGISTER} className="hover:text-foreground transition-colors">Guardians</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span className="cursor-not-allowed">Privacy Policy</span></li>
              <li><span className="cursor-not-allowed">Terms of Service</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {SITE.NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
