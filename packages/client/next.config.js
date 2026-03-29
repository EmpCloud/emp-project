/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
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
};

module.exports = nextConfig;
