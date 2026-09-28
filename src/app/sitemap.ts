import type { MetadataRoute } from "next";

import { mainNav, site } from "@/config/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", ...mainNav.map((item) => item.href)];
  // Concatenate rather than new URL(path, base): the site may live under a sub-path.
  return pages.map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
