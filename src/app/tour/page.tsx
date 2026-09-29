import type { Metadata } from "next";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";
import { tourRoom } from "@/components/tour/content";
import { TourCta } from "@/components/tour/TourCta";
import { TourExplorer } from "@/components/tour/TourExplorer";
import { TourIntro } from "@/components/tour/TourIntro";
import { contactHref } from "@/lib/contact-link";

export const metadata: Metadata = {
  title: "Virtual Tour — 3D Map & 360° Spaces",
  description: `Fly over Plav Hotel and Lake Plav in 3D, then step into four spaces in full 360° — the lake from above, the Grand Hall, the ${tourRoom.name} and the chapel — or take the guided tour, and check a direct rate without leaving it.`,
  alternates: { canonical: "/tour" },
};

export default function TourPage() {
  return (
    <>
      <SiteNav cta={{ label: "Book", href: "/#book" }} menuCta={{ label: "Book your stay", href: "/#book" }} />
      <main>
        <TourIntro />
        <TourExplorer />
        <TourCta />
      </main>
      <SiteFooter
        aside={{
          kind: "text",
          title: "Visit",
          text: "Prefer to see it in person? Private viewings of rooms and event spaces by appointment.",
          link: { label: "Arrange a viewing", href: contactHref({ topic: "other" }) },
        }}
      />
    </>
  );
}
