/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  // 生产部署优化：适用国内服务器
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  // 图片优化（Next.js 内置）
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

module.exports = nextConfig;
