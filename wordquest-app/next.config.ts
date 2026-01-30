import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'quizlet.com',
      },
      {
        protocol: 'https',
        hostname: 'o.quizlet.com',
      },
    ],
  },
};

export default nextConfig;
