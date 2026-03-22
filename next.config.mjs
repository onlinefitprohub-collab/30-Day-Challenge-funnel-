/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["*.replit.dev", "*.repl.co"],
  experimental: {
    serverActions: {
      allowedOrigins: ["*.replit.dev", "*.repl.co", "localhost:5000"],
    },
  },
};

export default nextConfig;
