import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/sixthouse',
  images: {
    unoptimized: true,
  },
}

export default nextConfig