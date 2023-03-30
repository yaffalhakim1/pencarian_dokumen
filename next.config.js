const runtimeCaching = require("next-pwa/cache");

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  runtimeCaching,
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  reactStrictMode: true,
});

module.exports = withPWA({
  reactStrictMode: true,
  // async rewrites() {
  //   return [
  //     {
  //       source: "/users/main",
  //       destination: "/users/main/index.html",
  //     },
  //   ];
  // },
  images: {
    remotePatterns: [{}],
  },
});
