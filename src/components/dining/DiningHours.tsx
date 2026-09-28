import Link from "next/link";

import { cx } from "@/lib/cx";
import ui from "@/styles/ui.module.css";

import { HOURS } from "./content";
import styles from "./DiningHours.module.css";

export function DiningHours() {
  return (
    <section id="hours" className={styles.hours}>
      <div className={styles.inner}>
        <div data-reveal="up" className={styles.head}>
          <div className={cx(ui.eyebrow, styles.eyebrow)}>At a glance</div>
          <h2 className={styles.title}>Hours &amp; service</h2>
        </div>

        <div className={styles.grid}>
          {HOURS.map((venue, index) => (
            <div
              key={venue.name}
              data-reveal="up"
              data-delay={index > 0 ? String(index * 80) : undefined}
              className={cx(styles.card, venue.dark && styles.dark)}
            >
              <h3 className={styles.name}>{venue.name}</h3>
              <div className={styles.type}>{venue.type}</div>
              <dl className={styles.rows}>
                {venue.rows.map((row) => (
                  <div key={row.label} className={styles.row}>
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
              {venue.link && (
                <Link href={venue.link.href} className={styles.link}>
                  {venue.link.label} <span aria-hidden="true">→</span>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
