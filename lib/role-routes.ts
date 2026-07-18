import { ROUTES } from "./constants";

type Role = "TEACHER" | "STUDENT" | "GUARDIAN";

/**
 * Role-based route access config.
 * If a route is listed here, only the specified roles can access it.
 * Routes NOT listed are accessible by all authenticated roles.
 */
export const ROLE_ROUTES: Partial<Record<string, Role[]>> = {
  [ROUTES.USER.SERVICES]: ["TEACHER"],
  [ROUTES.USER.BATCHES]: ["TEACHER"],
};

/**
 * Check if a user's role is allowed to access a given pathname.
 * Returns true if allowed, false if blocked.
 */
export function canAccessRoute(role: string, pathname: string): boolean {
  for (const [route, allowedRoles] of Object.entries(ROLE_ROUTES)) {
    if (!allowedRoles) continue;
    if (pathname === route || pathname.startsWith(route + "/")) {
      if (!allowedRoles.includes(role as Role)) {
        return false;
      }
    }
  }
  return true;
}
