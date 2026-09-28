import Link from "next/link";

import { contactHref } from "@/lib/contact-link";

import styles from "./ConciergeCta.module.css";

export function ConciergeCta() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.eyebrow} data-reveal="up">
          Concierge
        </div>
        <h2 className={styles.title} data-reveal="up" data-delay="80">
          One call plans it all.
        </h2>
        <p className={styles.lead} data-reveal="up" data-delay="140">
          Tell us the season, the pace and who&rsquo;s coming &mdash; we&rsquo;ll shape the days around you.
        </p>
        <div className={styles.actions} data-reveal="up" data-delay="200">
          <Link href={contactHref({ topic: "other" })} className={styles.ctaGold}>
            Speak to the concierge
          </Link>
          <Link href="/tour" className={styles.ctaOutline}>
            Take the 360&deg; tour
          </Link>
        </div>
      </div>
    </section>
  );
}
