import type { MetadataRoute } from "next";

import { mainNav, site } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", ...mainNav.map((item) => item.href)];
  return pages.map((path) => ({
    url: new URL(path, site.url).toString(),
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
