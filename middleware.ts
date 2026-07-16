import { NextRequest, NextResponse } from "next/server";

// ─── Cookie names (must match backend exactly) ──────────────
// process.env is available in Next.js 16 middleware
const USER_ACCESS = process.env.COOKIE_ACCESS_NAME || "cms_access_token";
const USER_REFRESH = process.env.COOKIE_REFRESH_NAME || "cms_refresh_token";
const ADMIN_ACCESS = process.env.ADMIN_COOKIE_ACCESS_NAME || "cms_admin_access";
const ADMIN_REFRESH = process.env.ADMIN_COOKIE_REFRESH_NAME || "cms_admin_refresh";

// ─── Route config ───────────────────────────────────────────
const adminLogin = "/admin/login";
const userLogin = "/login";

const adminProtected = [
  "/admin/dashboard",
  "/admin/users",
  "/admin/teachers",
  "/admin/services",
  "/admin/enrollments",
  "/admin/reviews",
  "/admin/posts",
  "/admin/subscriptions",
  "/admin/settings",
];

const userProtected = ["/dashboard"];

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Admin routes ──────────────────────────────────────────
  const isAdminProtected = adminProtected.some((p) => pathname.startsWith(p));
  const isAdminLogin = pathname === adminLogin;

  if (isAdminProtected && !isAdminLogin) {
    const hasAccess = req.cookies.has(ADMIN_ACCESS);
    const hasRefresh = req.cookies.has(ADMIN_REFRESH);

    if (!hasAccess && !hasRefresh) {
      return NextResponse.redirect(new URL(adminLogin, req.url));
    }
    return NextResponse.next();
  }

  // Redirect away from admin login if already authenticated
  if (isAdminLogin) {
    const hasAccess = req.cookies.has(ADMIN_ACCESS);
    const hasRefresh = req.cookies.has(ADMIN_REFRESH);
    if (hasAccess || hasRefresh) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // ── User routes ───────────────────────────────────────────
  const isUserProtected = userProtected.some((p) => pathname.startsWith(p));
  const isUserLogin = pathname === userLogin;

  if (isUserProtected && !isUserLogin) {
    const hasAccess = req.cookies.has(USER_ACCESS);
    const hasRefresh = req.cookies.has(USER_REFRESH);

    if (!hasAccess && !hasRefresh) {
      return NextResponse.redirect(new URL(userLogin, req.url));
    }
    return NextResponse.next();
  }

  // Redirect away from user login if already authenticated
  if (isUserLogin) {
    const hasAccess = req.cookies.has(USER_ACCESS);
    const hasRefresh = req.cookies.has(USER_REFRESH);
    if (hasAccess || hasRefresh) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // ── Public routes — pass through ──────────────────────────
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
