const runtimeCaching = require("next-pwa/cache");

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

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = [withPWA, nextConfig];
