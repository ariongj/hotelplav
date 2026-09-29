import type { Metadata } from "next";
import Link from "next/link";

import * as dining from "@/components/dining/content";
import * as events from "@/components/events/content";
import * as experiences from "@/components/experiences/content";
import * as home from "@/components/home/content";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";
import * as spa from "@/components/spa/content";
import * as tour from "@/components/tour/content";
import { PageHero } from "@/components/ui/PageHero";
import { Photo } from "@/components/ui/Photo";
import type { Credit } from "@/components/ui/PhotoCredit";
import * as rooms from "@/lib/booking/rooms";

import styles from "./credits.module.css";

export const metadata: Metadata = {
  title: "Photo credits",
  description: "Credits and licences for the photographs and 360° panoramas used on the Plav Hotel website.",
  alternates: { canonical: "/credits" },
};

type CreditedImage = { src: string; alt: string; credit: Credit; pages: string[] };

/** Where each content module is shown, for the "Used on" line. */
const SOURCES: { page: string; data: unknown }[] = [
  { page: "Home", data: home },
  // The home page shows every room in its rooms carousel and search results.
  { page: "Home", data: rooms },
  { page: "Rooms", data: rooms },
  { page: "Dining", data: dining },
  { page: "Spa", data: spa },
  { page: "Experiences", data: experiences },
  { page: "Virtual tour", data: tour },
  { page: "Events", data: events },
];

function isCredit(value: unknown): value is Credit {
  if (!value || typeof value !== "object") return false;
  const credit = value as Record<string, unknown>;
  return typeof credit.author === "string" && typeof credit.license === "string" && typeof credit.href === "string";
}

/**
 * Every image in the content modules that carries a Commons credit, found by
 * walking the exported data — so a credited photo added anywhere shows up here
 * without a second list to keep in sync. One entry per Commons file.
 */
function collectCredits(): CreditedImage[] {
  const byFile = new Map<string, CreditedImage>();
  for (const { page, data } of SOURCES) {
    const seen = new Set<unknown>();
    const walk = (value: unknown) => {
      if (!value || typeof value !== "object" || seen.has(value)) return;
      seen.add(value);
      if (Array.isArray(value)) return value.forEach(walk);
      const record = value as Record<string, unknown>;
      if (typeof record.src === "string" && isCredit(record.credit)) {
        const entry = byFile.get(record.credit.href);
        if (entry) {
          if (!entry.pages.includes(page)) entry.pages.push(page);
        } else {
          const alt = typeof record.alt === "string" ? record.alt : typeof record.name === "string" ? record.name : "";
          byFile.set(record.credit.href, { src: record.src, alt, credit: record.credit, pages: [page] });
        }
      }
      Object.values(record).forEach(walk);
    };
    walk(data);
  }
  return [...byFile.values()];
}

export default function CreditsPage() {
  const credits = collectCredits();

  return (
    <>
      <SiteNav cta={{ label: "Book", href: "/#book" }} menuCta={{ label: "Book your stay", href: "/#book" }} />
      <main>
        <PageHero
          size="compact"
          kicker="Photo credits"
          title={
            <>
              Thank you, <em>photographers</em>
            </>
          }
          intro="The lake, mountain and room photographs below are from Wikimedia Commons, used under their free licences. Other images on the site are placeholders until the hotel's own photography arrives."
        />
        <section className={styles.section} aria-label="Credited photographs">
          <ul className={styles.grid}>
            {credits.map((item) => (
              <li key={item.credit.href} className={styles.card}>
                <div className={styles.photo}>
                  <Photo src={item.src} alt={item.alt} sizes="(max-width: 700px) 100vw, 360px" />
                </div>
                <div className={styles.body}>
                  <p className={styles.alt}>{item.alt}</p>
                  <p className={styles.meta}>
                    {item.credit.author} · {item.credit.license}
                  </p>
                  <p className={styles.used}>Used on: {item.pages.join(", ")}</p>
                  <a href={item.credit.href} target="_blank" rel="noopener noreferrer" className={styles.link}>
                    View on Wikimedia Commons
                  </a>
                </div>
              </li>
            ))}
          </ul>
          <p className={styles.note}>
            Spotted a mistake in a credit? <Link href="/contact">Let us know</Link> and we&apos;ll put it right.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
