import Link from "next/link";

import { site } from "@/config/site";
import { contactHref } from "@/lib/contact-link";
import { cx } from "@/lib/cx";
import ui from "@/styles/ui.module.css";

import styles from "./ConciergeStrip.module.css";

export function ConciergeStrip() {
  return (
    <section className={styles.section} aria-labelledby="concierge-title">
      <div className={styles.inner}>
        <div data-reveal="up">
          <p className={ui.eyebrowLight}>Not sure which to choose?</p>
          <h2 id="concierge-title" className={cx(ui.h2Light, styles.title)}>
            Tell us who&rsquo;s coming. <em>We&rsquo;ll find the room.</em>
          </h2>
          <p className={cx(ui.leadLight, styles.lead)}>
            A lake view for two, space for the whole family, a fireplace for cool mountain evenings — our reservations
            team knows every room in the house and will suggest the one that fits your stay.
          </p>
        </div>

        <div className={cx(ui.glassDark, styles.card)} data-reveal="up" data-delay="120">
          <p className={styles.cardTitle}>Talk to reservations</p>
          <a href={site.phone.href} className={styles.line}>
            <span className={styles.lineLabel}>Call</span>
            <span className={styles.lineValue}>{site.phone.display}</span>
          </a>
          <a href={`mailto:${site.email.stay}`} className={styles.line}>
            <span className={styles.lineLabel}>Email</span>
            <span className={styles.lineValue}>{site.email.stay}</span>
          </a>
          <Link href={contactHref({ topic: "reservation" })} className={cx(ui.btnGold, styles.cta)}>
            Send us a note
          </Link>
        </div>
      </div>
    </section>
  );
}
