import type { NextConfig } from 'next';

const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    // For production, remove rewrites or use environment-specific config
    // The API calls should go to deployed backend
    return [];
  },
};

export default config;
