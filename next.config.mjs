import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    images: {
        formats: ['image/avif', 'image/webp'],
        remotePatterns: [
            // Firebase Storage JSON API
            {
                protocol: "https",
                hostname: "firebasestorage.googleapis.com",
                pathname: "/v0/b/**",
            },
            // (opciono) Google Cloud Storage direct
            {
                protocol: "https",
                hostname: "storage.googleapis.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
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

export default nextConfig;
