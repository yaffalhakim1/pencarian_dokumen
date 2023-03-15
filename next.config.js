const withPWA = require("next-pwa")({
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
    runtimeCaching,
  },
  async rewrites() {
    return [
      {
        source: "/users/main",
        destination: "/users/main/index.html",
      },
    ];
  },
});
const runtimeCaching = require("next-pwa/cache");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = withPWA({
  ...nextConfig,
  reactStrictMode: true,
});
