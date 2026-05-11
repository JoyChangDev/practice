/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // Use production env for GitHub Pages base path.
  basePath: process.env.NODE_ENV === "production" ? "/practice" : "",
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  // Supports importing SVG as React components @see {@link https://react-svgr.com/docs/next/}
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
