import Link from "next/link";

import { contactHref } from "@/lib/contact-link";
import { cx } from "@/lib/cx";
import ui from "@/styles/ui.module.css";

import styles from "./SpaConcierge.module.css";

/** Concierge strip — hands off to the contact form with the spa topic selected. */
export function SpaConcierge() {
  return (
    <section className={styles.strip}>
      <div className={styles.inner}>
        <div className={cx(ui.eyebrow, styles.eyebrow)}>Not sure where to start?</div>
        <h2 className={styles.title}>
          Let our therapists
          <br />
          design your day.
        </h2>
        <Link href={contactHref({ topic: "spa" })} className={styles.cta}>
          Speak with the spa
        </Link>
      </div>
    </section>
  );
}
