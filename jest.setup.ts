import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";
import { jest, beforeAll, afterAll } from "@jest/globals";

// Polyfill for Next.js
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),

  usePathname: () => "/",

  useSearchParams: () => new URLSearchParams(),
}));

// Mock next/headers
jest.mock("next/headers", () => ({
  cookies: () => ({
    get: jest.fn(),
    getAll: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
    has: jest.fn(),
  }),

  headers: () => new Headers(),
}));

// Mock environment variables
process.env.API_BASE_URL = "http://localhost:9000";

process.env.COOKIE_ACCESS_NAME = "cms_access_token";
process.env.COOKIE_REFRESH_NAME = "cms_refresh_token";

process.env.ADMIN_COOKIE_ACCESS_NAME = "cms_admin_access";
process.env.ADMIN_COOKIE_REFRESH_NAME = "cms_admin_refresh";

process.env.COOKIE_SECRET = "test-secret";

process.env.FRONTEND_URL = "http://localhost:3000";
process.env.ADMIN_FRONTEND_URL = "http://localhost:3000";

process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = "test-key";

process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = "test-cloud";
process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET = "test-preset";

// Suppress specific React warning
const originalError = console.error;

beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Warning: ReactDOM.render is no longer supported")
    ) {
      return;
    }

    originalError(...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
