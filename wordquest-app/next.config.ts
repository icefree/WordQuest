import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/WordQuest', // 取消注释如果部署到非根目录（如 username.github.io/WordQuest）
  images: {
    unoptimized: true,
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
