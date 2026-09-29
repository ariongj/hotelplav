import Link from "next/link";

import ui from "@/styles/ui.module.css";

import styles from "./TourCta.module.css";

/** Closing call to action under the tour: slow ripples on dark lake water. */
export function TourCta() {
  return (
    <section className={styles.cta}>
      <div className={styles.ripples} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className={styles.inner}>
        <div className={styles.kicker} data-reveal="up">
          Seen enough to fall for it?
        </div>
        <h2 className={styles.title} data-reveal="up" data-delay="80">
          The real view is <em>even better.</em>
        </h2>
        <p className={styles.lead} data-reveal="up" data-delay="120">
          Book direct for our best rate &mdash; no booking fees, and free cancellation up to 48 hours before arrival.
        </p>
        <div className={styles.actions} data-reveal="up" data-delay="160">
          <Link href="/#book" className={ui.btnGold}>
            Book your stay
          </Link>
          <Link href="/contact" className={ui.btnOutlineLight}>
            Ask the concierge
          </Link>
        </div>
      </div>
    </section>
  );
}
