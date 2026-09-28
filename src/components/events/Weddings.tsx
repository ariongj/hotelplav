import Link from "next/link";

import { Photo } from "@/components/ui/Photo";
import { cx } from "@/lib/cx";
import ui from "@/styles/ui.module.css";

import styles from "./Weddings.module.css";
import { chapelTourHref, eventsEnquiryHref, images, weddingFacts } from "./content";

export function Weddings() {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        <div data-reveal="left">
          <div className={cx(ui.eyebrow, styles.eyebrow)}>Weddings</div>
          <h2 className={styles.title}>
            Married above
            <br />
            the clouds
          </h2>
          <p className={styles.lead}>
            A stone chapel, a terrace facing the whole Sharr range, and a kitchen that cooks for the occasion &mdash;
            with one planner beside you from the first call to the last dance.
          </p>
          <dl className={styles.facts}>
            {weddingFacts.map((fact) => (
              <div key={fact.label} className={styles.fact}>
                <dt className={styles.factLabel}>{fact.label}</dt>
                <dd className={styles.factValue}>{fact.value}</dd>
              </div>
            ))}
          </dl>
          <div className={styles.actions}>
            <Link href={eventsEnquiryHref} className={ui.btnGold}>
              Enquire about a date
            </Link>
            <Link href={chapelTourHref} className={ui.btnOutline}>
              See the chapel in 360&deg;
            </Link>
          </div>
        </div>
        <div className={styles.media} data-reveal="right">
          <Photo src={images.wedding.src} alt={images.wedding.alt} sizes="(max-width: 770px) 100vw, 50vw" />
        </div>
      </div>
    </section>
  );
}
