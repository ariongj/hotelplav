import type { Metadata } from "next";

import { Corporate } from "@/components/events/Corporate";
import { EventsHero } from "@/components/events/EventsHero";
import { Planning } from "@/components/events/Planning";
import { Venues } from "@/components/events/Venues";
import { Weddings } from "@/components/events/Weddings";
import { eventsEnquiryHref } from "@/components/events/content";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";

export const metadata: Metadata = {
  title: "Events & Weddings",
  description:
    "Weddings in a stone chapel, a ballroom for 300 and a terrace facing the Sharr range — plus boardroom retreats at 1,100 metres, with one planner from the first call to the last dance.",
};

export default function EventsPage() {
  return (
    <>
      <SiteNav cta={{ label: "Book", href: "/#book" }} menuCta={{ label: "Reserve your stay", href: "/#book" }} />
      <main>
        <EventsHero />
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
          text: "Walk the chapel, ballroom and terrace with our events team — viewings by appointment.",
          link: { label: "Arrange a viewing", href: eventsEnquiryHref },
        }}
      />
    </>
  );
}
