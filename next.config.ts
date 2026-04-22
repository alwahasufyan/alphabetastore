import type { NextConfig } from "next";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "http://localhost:3001/api/v1";

function buildUploadsPattern(urlString: string) {
  try {
    const url = new URL(urlString);

    return {
      protocol: url.protocol.replace(":", ""),
      hostname: url.hostname,
      port: url.port,
      pathname: "/uploads/**"
    };
  } catch {
    return null;
  }
}

const backendUploadsPattern = buildUploadsPattern(apiBaseUrl);

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ui-lib.com"
      },
      {
        protocol: "https",
        hostname: "cloudflare-ipfs.com"
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/uploads/**"
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "3001",
        pathname: "/uploads/**"
      }
    ].concat(backendUploadsPattern ? [backendUploadsPattern] : [])
  }
};

export default nextConfig;
