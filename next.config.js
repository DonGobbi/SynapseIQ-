/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',  // Enable static exports
  // Use basePath and assetPrefix for GitHub Pages
  basePath: process.env.NODE_ENV === 'production' ? '/SynapseIQ-' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/SynapseIQ-' : '',
  trailingSlash: true, // This helps with GitHub Pages routing
  images: {
    unoptimized: true,  // Required for static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      }
    ],
  },
  // Ensure environment variables are properly handled
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://synapseiq-api.onrender.com',
  },
};

module.exports = nextConfig;
