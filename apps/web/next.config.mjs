import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

dotenv.config({ path: fileURLToPath(new URL("../../.env", import.meta.url)) });

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
