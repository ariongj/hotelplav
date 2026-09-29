import Link from "next/link";

import { PhotoCredit } from "@/components/ui/PhotoCredit";
import { Photo } from "@/components/ui/Photo";
import { cx } from "@/lib/cx";
import ui from "@/styles/ui.module.css";

import styles from "./Weddings.module.css";
import { chapelTourHref, eventsEnquiryHref, images, weddingStats } from "./content";

export function Weddings() {
  return (
    <section className={styles.section} aria-labelledby="weddings-title">
      <div className={styles.grid}>
        <figure className={styles.figure} data-reveal="left">
          <div className={styles.media}>
            <Photo
              src={images.wedding.src}
              alt={images.wedding.alt}
              position={images.wedding.position}
              sizes="(max-width: 900px) 100vw, 50vw"
            />
            <div className={cx(ui.glass, styles.badge)}>
              <span className={styles.badgeLabel}>Ceremony</span>
              <span className={styles.badgeValue}>Chapel or lake terrace</span>
            </div>
          </div>
          <figcaption>
            <PhotoCredit credit={images.wedding.credit} tone="dark" className={styles.credit} />
          </figcaption>
        </figure>

        <div className={styles.copy} data-reveal="right">
          <p className={ui.eyebrow}>Weddings</p>
          <h2 id="weddings-title" className={cx(ui.h2, styles.title)}>
            Say yes <em>by the water</em>
          </h2>
          <p className={cx(ui.lead, styles.lead)}>
            Vows in the chapel or out on the lake terrace, long tables in the ballroom and a kitchen that cooks for the
            occasion &mdash; with one planner beside you from the first call to the last dance.
          </p>

          <dl className={styles.stats}>
            {weddingStats.map((stat, i) => (
              <div key={stat.label} className={cx(styles.stat, i === 0 && styles.statAccent)}>
                <dt className={styles.statLabel}>{stat.label}</dt>
                <dd className={styles.statValue}>{stat.value}</dd>
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
      </div>
    </section>
  );
}
