/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // #1211 — Suppress React strict mode warnings in production
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'empcloud.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.empcloud.com',
        pathname: '/**',
      },
    ],
  },
  env: {
    IN_PRODUCTION: process.env.IN_PRODUCTION,
    LOCAL_URL: process.env.LOCAL_URL,
    PRODUCTION_URL: process.env.PRODUCTION_URL,
    PROJECT_API: process.env.PROJECT_API,
    TASK_API: process.env.TASK_API,
    USER_API: process.env.USER_API,
    HOSTING_URL: process.env.HOSTING_URL,
    SOCKET_URL: process.env.SOCKET_URL,
    TOTAL_USERS: process.env.TOTAL_USERS,
    SHARE_LINK: process.env.SHARE_LINK,
  },
  // #1205 — Exclude amcharts4 from server-side compilation (ESM incompatible with Node 20)
  experimental: {
    esmExternals: 'loose',
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Mark amcharts4 as external on server to avoid ESM resolution errors during build
      config.externals = config.externals || [];
      config.externals.push(function ({ request }, callback) {
        if (request && request.includes('@amcharts/amcharts4')) {
          return callback(null, 'commonjs ' + request);
        }
        callback();
      });
    }
    return config;
  },
};

module.exports = nextConfig;
