/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa");
const runtimeCaching = require("next-pwa/cache");
require("dotenv").config();

module.exports = withPWA({
  pwa: {
    dest: "public",
    runtimeCaching,
    mode: "production",
  },
  reactStrictMode: true,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    // ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: false,
      },
    ];
  },
  assetPrefix:
    process.env.ENV === "local"
      ? "http://localhost:3000"
      : "https://calories-log.net",
});
