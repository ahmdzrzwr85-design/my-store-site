import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

dotenv.config({ path: fileURLToPath(new URL("../../.env", import.meta.url)) });

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const apiServer = process.env.API_SERVER_URL || "http://localhost:4000";
    return [
      {
        source: "/api/:path*",
        destination: `${apiServer}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
