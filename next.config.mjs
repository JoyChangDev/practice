/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/practice',
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },
};

export default nextConfig;
