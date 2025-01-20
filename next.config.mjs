// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    basePath: '/sixthouse',
    images: {
      unoptimized: true,
    },
    // Handle GLTF files
    webpack(config) {
      config.module.rules.push({
        test: /\.(glb|gltf)$/,
        type: 'asset/resource'
      });
      return config;
    },
  }
  
  export default nextConfig;