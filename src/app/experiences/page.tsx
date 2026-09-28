import type { Metadata } from "next";

import { ConciergeCta } from "@/components/experiences/ConciergeCta";
import { ExperiencesHero } from "@/components/experiences/ExperiencesHero";
import { SeasonSection } from "@/components/experiences/SeasonSection";
import { summer, winter } from "@/components/experiences/content";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";

export const metadata: Metadata = {
  title: "Experiences",
  description:
    "Ski-in, ski-out winters, guided peak hikes, glacial lakes and shepherd’s-table lunches in the Sharr Mountains — the mountain in every season, arranged by our concierge.",
};

export default function ExperiencesPage() {
  return (
    <>
      <SiteNav cta={{ label: "Book", href: "/#book" }} menuCta={{ label: "Reserve your stay", href: "/#book" }} />
      <main>
        <ExperiencesHero />
        <SeasonSection season={winter} />
        <SeasonSection season={summer} />
        <ConciergeCta />
      </main>
      <SiteFooter
        aside={{
          kind: "list",
          title: "Seasons",
          items: ["Winter · Dec — Mar", "Green season · Jun — Sep", "Spa & dining · Year-round"],
        }}
      />
    </>
  );
}
