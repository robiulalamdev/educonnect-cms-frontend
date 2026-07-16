import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Proxy /api/* requests to the backend during development
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:9000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
