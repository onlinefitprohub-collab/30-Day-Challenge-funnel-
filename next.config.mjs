/** @type {import('next').NextConfig} */
const replitDevDomain = process.env.REPLIT_DEV_DOMAIN;

// Build a comprehensive list of allowed origins for Replit's proxied preview
const replitOrigins = [
  ...(replitDevDomain ? [
    replitDevDomain,
    `https://${replitDevDomain}`,
  ] : []),
  "replit.dev",
  "repl.co",
  "picard.replit.dev",
];

const nextConfig = {
  // Allow all dev origins — Replit proxies through dynamic subdomains
  allowedDevOrigins: ["*", ...replitOrigins],
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:5000",
        ...replitOrigins,
      ],
    },
    optimizePackageImports: [],
  },
};

export default nextConfig;
