import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Placeholder photography from the design handoff is hot-linked from these
    // hosts. Once the hotel's licensed photography lives in /public (or a CMS),
    // remove the hosts that are no longer used.
    remotePatterns: [
      { protocol: "https", hostname: "static.wixstatic.com", pathname: "/media/**" },
      { protocol: "https", hostname: "upload.wikimedia.org", pathname: "/wikipedia/commons/**" },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
