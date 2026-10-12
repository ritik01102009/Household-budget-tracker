/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export — required for Cloudflare Pages (no Node.js server)
  output: "export",

  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Static export doesn't support Next.js image optimisation server
    unoptimized: true,
  },
  turbopack: {
    root: __dirname,
  },
};

module.exports = nextConfig;

