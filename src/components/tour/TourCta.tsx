import Link from "next/link";

import styles from "./TourCta.module.css";

/** Closing call to action under the tour. */
export function TourCta() {
  return (
    <section className={styles.cta}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.inner}>
        <div className={styles.eyebrow} data-reveal="up">
          Seen enough to fall for it?
        </div>
        <h2 className={styles.title} data-reveal="up" data-delay="80">
          The real view is better.
        </h2>
        <div className={styles.actions} data-reveal="up" data-delay="160">
          <Link href="/#book" className={styles.primary}>
            Reserve your stay
          </Link>
          <Link href="/contact" className={styles.secondary}>
            Ask the concierge
          </Link>
        </div>
      </div>
    </section>
  );
}
