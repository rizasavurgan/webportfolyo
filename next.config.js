/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // For data URLs and local development
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Enable server-side rendering for Vercel
  experimental: {
    serverComponentsExternalPackages: ['fs']
  }
}

module.exports = nextConfig