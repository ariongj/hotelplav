import type { NextConfig } from "next";

/**
 * NEXT_PUBLIC_STATIC_EXPORT=true builds a static site (used for the GitHub
 * Pages preview, see .github/workflows/pages.yml): no server, so no API
 * routes or image optimiser, served under NEXT_PUBLIC_BASE_PATH (/<repo>).
 */
const staticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  // trailingSlash: pages export as rooms/index.html — GitHub Pages resolves
  // /rooms to that folder (a rooms.html beside it would 404).
  ...(staticExport ? { output: "export" as const, basePath, trailingSlash: true } : {}),
  images: {
    // Static hosting can't optimise images on request; the placeholder
    // photos are already sized and compressed by their CDN.
    unoptimized: staticExport,
    // Placeholder interiors (Wix) and credited Wikimedia Commons photos are
    // hot-linked from these hosts. Once the hotel's licensed photography lives
    // in /public (or a CMS), remove the hosts that are no longer used.
    remotePatterns: [
      { protocol: "https", hostname: "static.wixstatic.com", pathname: "/media/**" },
      { protocol: "https", hostname: "upload.wikimedia.org", pathname: "/wikipedia/commons/**" },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
