import type { Metadata } from "next";
import Link from "next/link";

import { ConciergeCta } from "@/components/experiences/ConciergeCta";
import { LakeIntro } from "@/components/experiences/LakeIntro";
import { PhotoCredit } from "@/components/ui/PhotoCredit";
import { SeasonsSection } from "@/components/experiences/SeasonsSection";
import { conciergeHref, heroImage, seasonNotes } from "@/components/experiences/content";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";
import { PageHero } from "@/components/ui/PageHero";
import ui from "@/styles/ui.module.css";

export const metadata: Metadata = {
  title: "Experiences",
  description:
    "Paddle glacial Lake Plav, hike to Lake Hrid and the Peaks of the Balkans, snowshoe above a frozen lake — summer and winter in Plav, Montenegro, arranged by our concierge.",
  alternates: { canonical: "/experiences" },
};

export default function ExperiencesPage() {
  return (
    <>
      <SiteNav cta={{ label: "Book", href: "/#book" }} menuCta={{ label: "Book your stay", href: "/#book" }} />
      <main>
        <PageHero
          kicker="Experiences"
          title={
            <>
              Where the lake <em>meets the peaks</em>
            </>
          }
          intro="Lake Plav was left behind by the last ice age, 906 m up between the Prokletije and Visitor ranges. Paddle it in summer, walk its frozen shore in winter — our concierge plans the rest."
          image={heroImage}
          actions={
            <>
              <Link href={conciergeHref} className={ui.btnGold}>
                Plan it with our concierge
              </Link>
              <a href="#seasons" className={ui.btnOutlineLight}>
                Summer &amp; winter ideas
              </a>
            </>
          }
        >
          <PhotoCredit credit={heroImage.credit} spaced />
        </PageHero>
        <LakeIntro />
        <SeasonsSection />
        <ConciergeCta />
      </main>
      <SiteFooter aside={{ kind: "list", title: "Seasons", items: seasonNotes }} />
    </>
  );
}
