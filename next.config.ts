import type { NextConfig } from "next";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:9000";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: "standalone",

  // Proxy /api/* and /socket.io/* requests to the backend
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_BASE_URL}/api/:path*`,
      },
      {
        source: "/socket.io/:path*",
        destination: `${API_BASE_URL}/socket.io/:path*`,
      },
      {
        source: "/socket.io",
        destination: `${API_BASE_URL}/socket.io`,
      },
    ];
  },

  // Image domains for Cloudinary
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;