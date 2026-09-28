import type { Metadata } from "next";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";
import { TourCta } from "@/components/tour/TourCta";
import { TourExplorer } from "@/components/tour/TourExplorer";
import { TourIntro } from "@/components/tour/TourIntro";
import { contactHref } from "@/lib/contact-link";

export const metadata: Metadata = {
  title: "Virtual Tour — 3D Resort Map & 360° Spaces",
  description:
    "Fly over the resort in 3D, step inside the Grand Hall, an Alpine Room and the chapel in full 360°, or take the guided tour — and hold a direct rate without leaving it.",
};

export default function TourPage() {
  return (
    <>
      <SiteNav cta={{ label: "Book", href: "/#book" }} menuCta={{ label: "Reserve your stay", href: "/#book" }} />
      <main>
        <TourIntro />
        <TourExplorer />
        <TourCta />
      </main>
      <SiteFooter
        aside={{
          kind: "text",
          title: "Visit",
          text: "Prefer to see it in person? Private viewings of suites and event spaces by appointment.",
          link: { label: "Arrange a viewing", href: contactHref({ topic: "other" }) },
        }}
      />
    </>
  );
}
