import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Polyfill for Next.js
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    };
  },
  usePathname() {
    return '/';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock next/headers
jest.mock('next/headers', () => ({
  cookies() {
    return {
      get: jest.fn(),
      getAll: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
      has: jest.fn(),
    };
  },
  headers() {
    return new Headers();
  },
}));

// Mock environment variables
process.env.API_BASE_URL = 'http://localhost:9000';
process.env.COOKIE_ACCESS_NAME = 'cms_access_token';
process.env.COOKIE_REFRESH_NAME = 'cms_refresh_token';
process.env.ADMIN_COOKIE_ACCESS_NAME = 'cms_admin_access';
process.env.ADMIN_COOKIE_REFRESH_NAME = 'cms_admin_refresh';
process.env.COOKIE_SECRET = 'test-secret';
process.env.FRONTEND_URL = 'http://localhost:3000';
process.env.ADMIN_FRONTEND_URL = 'http://localhost:3000';
process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = 'test-key';
process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = 'test-cloud';
process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET = 'test-preset';

// Suppress console.error for cleaner test output
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});