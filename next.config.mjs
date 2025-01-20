// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    basePath: '/sixthouse',
    images: {
      unoptimized: true,
    },
    webpack(config) {
      config.module.rules.push({
        test: /\.(glb|gltf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/3d/[name].[hash][ext]'
        }
      });
  
      return config;
    },
    // Add headers to allow loading 3D models
    async headers() {
      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'Cross-Origin-Opener-Policy',
              value: 'same-origin',
            },
            {
              key: 'Cross-Origin-Embedder-Policy',
              value: 'require-corp',
            },
          ],
        },
      ];
    },
  }
  
  export default nextConfig;