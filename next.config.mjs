/** @type {import('next').NextConfig} */
const replitDevDomain = process.env.REPLIT_DEV_DOMAIN;

const nextConfig = {
  allowedDevOrigins: [
    "*.replit.dev",
    "*.repl.co",
    "*.picard.replit.dev",
    ...(replitDevDomain ? [replitDevDomain] : []),
  ],
  experimental: {
    serverActions: {
      allowedOrigins: [
        "*.replit.dev",
        "*.repl.co",
        "*.picard.replit.dev",
        "localhost:5000",
        ...(replitDevDomain ? [replitDevDomain] : []),
      ],
    },
  },
};

export default nextConfig;
