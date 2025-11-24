import { withSentryConfig } from "@sentry/nextjs";

const nextConfig = {
  reactStrictMode: true,

  // Enable experimental features
  experimental: {
    instrumentationHook: true,
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/v0/b/**",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/**",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/_next/data/:buildId/:lang/my-profile.json",
        destination: "/api/my-profile?buildId=:buildId&lang=:lang",
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  org: "ginekoloska-ordinacija-palmoti",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  disableLogger: true,
  automaticVercelMonitors: true,
});