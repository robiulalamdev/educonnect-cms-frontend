/**
 * Server-side environment config.
 * NEVER use NEXT_PUBLIC_ prefix — all values stay server-only.
 * Used in: middleware.ts, server actions, server components, ISR/SSR.
 */
const env = {
  IS_PRODUCTION: process.env.NODE_ENV === "production",

  // Backend API base URL (server-side only)
  API_BASE_URL: process.env.API_BASE_URL ?? "http://localhost:9000",

  // Cookie names (must match backend exactly)
  COOKIE_ACCESS_NAME: process.env.COOKIE_ACCESS_NAME ?? "cms_access_token",
  COOKIE_REFRESH_NAME: process.env.COOKIE_REFRESH_NAME ?? "cms_refresh_token",
  ADMIN_COOKIE_ACCESS_NAME: process.env.ADMIN_COOKIE_ACCESS_NAME ?? "cms_admin_access",
  ADMIN_COOKIE_REFRESH_NAME: process.env.ADMIN_COOKIE_REFRESH_NAME ?? "cms_admin_refresh",
  COOKIE_SECRET: process.env.COOKIE_SECRET ?? "",

  // Frontend URLs
  FRONTEND_URL: process.env.FRONTEND_URL ?? "https://educonnect-cms.vercel.app",
  ADMIN_FRONTEND_URL: process.env.ADMIN_FRONTEND_URL ?? "https://educonnect-cms.vercel.app",

  // Google Maps API (client-side, for location autocomplete)
  GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
} as const;

export default env;
