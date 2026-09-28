import type { ReactNode } from "react";

import styles from "./ContactEnquiry.module.css";
import { contactDetails } from "./content";

/** Contact details beside the "Write to us" card; the page passes the form in as children. */
export function ContactEnquiry({ children }: { children: ReactNode }) {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        <div data-reveal="up">
          <dl className={styles.details}>
            {contactDetails.map((detail) => (
              <div key={detail.label} className={styles.row}>
                <dt className={styles.label}>{detail.label}</dt>
                {"lines" in detail ? (
                  <dd className={styles.address}>
                    {detail.lines.map((line, i) => (
                      <span key={line}>
                        {i > 0 && <br />}
                        {line}
                      </span>
                    ))}
                  </dd>
                ) : (
                  <dd className={styles.value}>
                    {detail.href ? (
                      <a href={detail.href} className={styles.link}>
                        {detail.value}
                      </a>
                    ) : (
                      detail.value
                    )}
                  </dd>
                )}
              </div>
            ))}
          </dl>

          <div className={styles.note}>
            <div className={styles.noteTitle}>Getting here</div>
            <p className={styles.noteText}>
              Pristina Airport is 90 minutes by car; Skopje 70 minutes. Chauffeured transfers, helicopter arrivals and
              valet parking with EV charging are arranged on request.
            </p>
          </div>
        </div>

        <div className={styles.card} data-reveal="up" data-delay="90">
          <h2 className={styles.title}>Write to us</h2>
          <p className={styles.subtitle}>We reply within one working day.</p>
          {children}
        </div>
      </div>
    </section>
  );
}
