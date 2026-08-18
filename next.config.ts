import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: "standalone",

  // transformers.js (ONNX runtime) must not be bundled into the server
  serverExternalPackages: ["@huggingface/transformers"],

  // Proxy /api/* requests to the backend during development
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:9000/api/:path*",
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
