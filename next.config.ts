import type { NextConfig } from "next";

const isPagesBuild =
  process.env.CF_PAGES === "1" ||
  process.env.npm_lifecycle_event === "build:pages";

const nextConfig: NextConfig = {
  output: isPagesBuild ? "export" : "standalone",
  experimental: {
    globalNotFound: true,
  },
  headers: isPagesBuild ? undefined : async () => {
    return ["/models/:path*", "/ort/:path*"].map((source) => ({
      source,
      headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
    }));
  },
};

export default nextConfig;
