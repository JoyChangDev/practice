/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Use production env for GitHub Pages base path.
  basePath: process.env.NODE_ENV === 'production' ? '/practice' : '',
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },
};

export default nextConfig;
