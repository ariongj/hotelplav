import Link from "next/link";

import { cx } from "@/lib/cx";
import ui from "@/styles/ui.module.css";

import { HOURS } from "./content";
import styles from "./DiningHours.module.css";

function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Opening hours (#hours) as three info cards. */
export function DiningHours() {
  return (
    <section id="hours" className={styles.hours} aria-labelledby="hours-title">
      <div className={styles.inner}>
        <div data-reveal="up" className={styles.head}>
          <div className={cx(ui.eyebrow, styles.eyebrow)}>At a glance</div>
          <h2 id="hours-title" className={styles.title}>
            Hours &amp; <em>service</em>
          </h2>
        </div>

        <div className={styles.grid}>
          {HOURS.map((venue, index) => (
            <div
              key={venue.name}
              data-reveal="up"
              data-delay={index > 0 ? String(index * 80) : undefined}
              className={styles.cell}
            >
              <article className={cx(styles.card, venue.dark && styles.dark)}>
                <div className={styles.top}>
                  <span className={styles.icon}>
                    <ClockIcon />
                  </span>
                  <span className={styles.type}>{venue.type}</span>
                </div>
                <h3 className={styles.name}>{venue.name}</h3>
                <dl className={styles.rows}>
                  {venue.rows.map((row) => (
                    <div key={row.label} className={styles.row}>
                      <dt>{row.label}</dt>
                      <dd>{row.value}</dd>
                    </div>
                  ))}
                </dl>
                <div className={styles.foot}>
                  {venue.bookable ? (
                    <a href="#reserve" className={styles.link}>
                      Reserve a table<span className="visually-hidden"> at {venue.name}</span>{" "}
                      <span aria-hidden="true">&rarr;</span>
                    </a>
                  ) : (
                    <p className={styles.walkIn}>Walk in — no booking needed</p>
                  )}
                  {venue.link && (
                    <Link href={venue.link.href} className={styles.link}>
                      {venue.link.label}
                      <span className="visually-hidden"> about {venue.name}</span> <span aria-hidden="true">&rarr;</span>
                    </Link>
                  )}
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
