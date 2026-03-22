/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["*.replit.dev", "*.repl.co", "localhost:5000"],
    },
  },
};

export default nextConfig;
