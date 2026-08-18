/**
 * All route paths — single source of truth for navigation and middleware.
 */
export const ROUTES = {
  // Public
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  VERIFY_EMAIL: "/verify-email",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",

  // User (authenticated)
  USER: {
    DASHBOARD: "/dashboard",
    PROFILE: "/dashboard/profile",
    SERVICES: "/dashboard/services",
    BATCHES: "/dashboard/batches",
    ENROLLMENTS: "/dashboard/enrollments",
    PAYMENTS: "/dashboard/payments",
    MESSAGES: "/dashboard/messages",
    NOTIFICATIONS: "/dashboard/notifications",
    SETTINGS: "/dashboard/settings",
  },

  // Admin
  ADMIN: {
    LOGIN: "/admin/login",
    DASHBOARD: "/admin/dashboard",
    ADMINS: "/admin/admins",
    USERS: "/admin/users",
    TEACHERS: "/admin/teachers",
    SERVICES: "/admin/services",
    EDUCATION: "/admin/education",
    ENROLLMENTS: "/admin/enrollments",
    REVIEWS: "/admin/reviews",
    POSTS: "/admin/posts",
    SUBSCRIPTIONS: "/admin/subscriptions",
    MODERATION: "/admin/moderation",
    AUDIT_LOGS: "/admin/audit-logs",
    GUARDIAN_LINKS: "/admin/guardian-links",
    SETTINGS: "/admin/settings",
    BATCHES: "/admin/batches",
    PAYMENTS: "/admin/payments",
  },
} as const;

/**
 * Backend API endpoints — organized by module, matching backend route prefixes.
 */
export const API = {
  AUTH: {
    REGISTER: "/api/v1/auth/register",
    LOGIN: "/api/v1/auth/login",
    LOGOUT: "/api/v1/auth/logout",
    ME: "/api/v1/auth/me",
    REFRESH: "/api/v1/auth/refresh",
    VERIFY_EMAIL: "/api/v1/auth/verify-email",
    RESEND_VERIFICATION: "/api/v1/auth/resend-verification",
    FORGOT_PASSWORD: "/api/v1/auth/forgot-password",
    RESET_PASSWORD: "/api/v1/auth/reset-password",
  },
  USER: {
    PROFILE: "/api/v1/user/profile",
    UPDATE_PROFILE: "/api/v1/user/profile",
  },
  ADMIN: {
    AUTH: {
      LOGIN: "/api/v1/admin/auth/login",
      LOGOUT: "/api/v1/admin/auth/logout",
      ME: "/api/v1/admin/auth/me",
      REFRESH: "/api/v1/admin/auth/refresh",
    },
    DASHBOARD: {
      ADMINS: "/api/v1/admin/dashboard/admins",
    },
  },
  SERVICE: "/api/v1/services",
  BATCH: "/api/v1/batches",
  ENROLLMENT: "/api/v1/enrollments",
  POST: "/api/v1/posts",
  MESSAGING: "/api/v1/chats",
  NOTIFICATION: "/api/v1/notifications",
  REVIEW: "/api/v1/reviews",
  EDUCATION: "/api/v1/education",
  SUBSCRIPTION: "/api/v1/subscription",
  UPLOAD: "/api/v1/upload",
  PAYMENT: "/api/v1/payment",
  STATISTICS: "/api/v1/statistics",
  TEACHER: "/api/v1/teacher",
  STUDENT: "/api/v1/student",
  GUARDIAN: "/api/v1/guardian",
  DEVICE: "/api/v1/devices",
  STORY: "/api/v1/stories",
  ATTENDANCE: "/api/v1/attendance",
  TASK: "/api/v1/tasks",
  DAILY_NOTE: "/api/v1/daily-notes",
  ANNOUNCEMENT: "/api/v1/announcements",
  BLOCK: "/api/v1/blocks",
  FOLLOW: "/api/v1/follows",
  NOTIFICATION_PREFERENCE: "/api/v1/notification-preferences",
} as const;

/**
 * User roles matching backend.
 */
export const USER_ROLES = {
  TEACHER: "TEACHER",
  STUDENT: "STUDENT",
  GUARDIAN: "GUARDIAN",
} as const;

export const ADMIN_ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  MODERATOR: "MODERATOR",
} as const;

/**
 * Site metadata — used in layout.tsx and SEO components.
 */
export const SITE = {
  NAME: "EduConnect",
  DESCRIPTION:
    "A comprehensive platform for coaching and education management. Connect teachers, students, and guardians seamlessly.",
  URL: process.env.FRONTEND_URL ?? "https://educonnect-cms.vercel.app",
  OG_IMAGE: "/og-image.png",
} as const;
