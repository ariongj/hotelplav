import Link from "next/link";

import { contactHref } from "@/lib/contact-link";
import { cx } from "@/lib/cx";
import ui from "@/styles/ui.module.css";

import styles from "./ConciergeStrip.module.css";

export function ConciergeStrip() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <p className={cx(ui.eyebrowLight, styles.kicker)}>Not sure which suits you?</p>
        <h2 className={styles.title}>
          Let our concierge
          <br />
          choose for you.
        </h2>
        <Link href={contactHref({ topic: "reservation" })} className={styles.cta}>
          Speak with us
        </Link>
      </div>
    </section>
  );
}
