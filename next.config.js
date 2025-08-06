/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',  // Enable static exports
  // Use assetPrefix for GitHub Pages
  assetPrefix: process.env.NODE_ENV === 'production' ? '/SynapseIQ-' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/SynapseIQ-' : '',
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
};

module.exports = nextConfig;
