import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/sixthouse',
  images: {
    unoptimized: true,
  },
  // Add this line to handle GLTF files
  webpack(config) {
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      type: 'asset/resource'
    });
    return config;
  },
}

export default nextConfig