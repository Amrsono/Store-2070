import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: '/api/graphql',
        destination: process.env.NODE_ENV === 'development'
          ? 'http://127.0.0.1:8000/graphql'
          : '/api/:path*', // This is a better fallback or just remove it if api is handled by local files
      },
    ]
  },
};

export default nextConfig;
