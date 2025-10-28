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
    // API Rewrites - works for both local and production
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (isProduction && process.env.NEXT_PUBLIC_API_URL) {
      // Production: proxy to deployed backend
      return [
        {
          source: '/api/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
        },
      ];
    } else {
      // Development: proxy to localhost backend
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:5000/api/:path*',
        },
      ];
    }
  },
};

export default config;
