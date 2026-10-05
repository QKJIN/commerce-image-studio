import type { NextConfig } from "next";

const isPagesBuild =
  process.env.CF_PAGES === "1" ||
  process.env.npm_lifecycle_event === "build:pages";

const nextConfig: NextConfig = {
  output: isPagesBuild ? "export" : "standalone",
  // Locale URLs in the sitemap, canonical and hreflang tags end with "/".
  trailingSlash: true,
  pageExtensions: isPagesBuild ? ["tsx", "ts", "jsx", "js"] : ["runtime.ts", "tsx", "ts", "jsx", "js"],
  env: { ANALYTICS_ROUTE: isPagesBuild ? "" : "/analytics.js" },
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
