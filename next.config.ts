import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },

      {
        protocol: "https",
        hostname: "eu.rarevinyl.com",
      },
      {
        protocol: 'https',
        hostname: '**',   // allow all HTTPS domains
      },
      {
        protocol: 'http',
        hostname: '**',   // optional, allow HTTP domains too
      },
    ],
  },
};


export default nextConfig;
