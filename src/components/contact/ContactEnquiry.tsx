import type { ReactNode } from "react";

import { site } from "@/config/site";
import { cx } from "@/lib/cx";

import styles from "./ContactEnquiry.module.css";
import { emailContacts } from "./content";

/**
 * The "Write to us" form card beside the ways to reach us (phone, email,
 * address, getting here). The page passes the form in as children. Pulled up
 * over the bottom of the hero.
 */
export function ContactEnquiry({ children }: { children: ReactNode }) {
  return (
    <section id="write" className={styles.section} aria-label="Get in touch">
      <div className={styles.grid}>
        <div className={styles.formCard} data-reveal="up">
          <h2 className={styles.title}>Write to us</h2>
          <p className={styles.subtitle}>Tell us what you have in mind — we reply within one working day.</p>
          {children}
        </div>

        {/* One reveal for the stack: the cards own their hover transition. */}
        <div className={styles.cards} data-reveal="up" data-delay="120">
          <div className={cx(styles.card, styles.phoneCard)}>
            <h3 className={styles.cardLabel}>Call the front desk</h3>
            <a href={site.phone.href} className={styles.big}>
              {site.phone.display}
            </a>
            <p className={styles.cardNote}>Answered 24 hours a day, every day.</p>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardLabel}>Email</h3>
            <ul className={styles.emails}>
              {emailContacts.map((item) => (
                <li key={item.address}>
                  <span className={styles.emailLabel}>{item.label}</span>
                  <a href={`mailto:${item.address}`} className={styles.emailLink}>
                    {item.address}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardLabel}>Address</h3>
            <address className={styles.address}>
              {site.name}
              <br />
              {site.address.line1}
              <br />
              {site.address.locality}, {site.address.country}
            </address>
          </div>

          <div className={cx(styles.card, styles.travelCard)}>
            <h3 className={styles.cardLabel}>Getting here</h3>
            <p className={styles.travelText}>
              Fly into <strong>Podgorica (TGD)</strong> — Plav is about <strong>2½ hours</strong> by car. Tell us
              your flight and we&rsquo;ll arrange a private transfer, or help you plan the drive.
            </p>
            <a href={site.directionsUrl} className={styles.directions} target="_blank" rel="noopener noreferrer">
              Get directions
              <span className="visually-hidden"> (opens Google Maps in a new tab)</span>
              <span aria-hidden="true">&nbsp;&#8599;</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
