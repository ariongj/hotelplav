import type { Metadata } from "next";
import Link from "next/link";

import { Corporate } from "@/components/events/Corporate";
import { Planning } from "@/components/events/Planning";
import { Venues } from "@/components/events/Venues";
import { Weddings } from "@/components/events/Weddings";
import { chapelTourHref, eventsEnquiryHref, images } from "@/components/events/content";
import { PhotoCredit } from "@/components/ui/PhotoCredit";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";
import { PageHero } from "@/components/ui/PageHero";
import ui from "@/styles/ui.module.css";

export const metadata: Metadata = {
  title: "Events & Weddings",
  description:
    "Weddings in the chapel or on the lake terrace, a ballroom for 300 — plus lakeside retreats for teams, with one planner from the first call to the last dance.",
  alternates: { canonical: "/events" },
};

export default function EventsPage() {
  return (
    <>
      <SiteNav cta={{ label: "Book", href: "/#book" }} menuCta={{ label: "Book your stay", href: "/#book" }} />
      <main>
        <PageHero
          kicker="Events & weddings"
          title={
            <>
              Gather <em>by the lake</em>
            </>
          }
          intro="Vows in the chapel, long tables in the ballroom, aperitifs on the lake terrace — for twenty guests or three hundred, with one planner from the first call to the last dance."
          image={images.hero}
          actions={
            <>
              <Link href={eventsEnquiryHref} className={ui.btnGold}>
                Enquire about a date
              </Link>
              <Link href={chapelTourHref} className={ui.btnOutlineLight}>
                See the chapel in 360&deg;
              </Link>
            </>
          }
        >
          <PhotoCredit credit={images.hero.credit} spaced />
        </PageHero>
        <Weddings />
        <Venues />
        <Corporate />
        <Planning />
      </main>
      <SiteFooter
        email="events"
        aside={{
          kind: "text",
          title: "Visit",
          text: "Walk the chapel, ballroom and lake terrace with our events team — viewings by appointment.",
          link: { label: "Arrange a viewing", href: eventsEnquiryHref },
        }}
      />
    </>
  );
}
