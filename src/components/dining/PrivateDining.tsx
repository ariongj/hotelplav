import Link from "next/link";

import { contactHref } from "@/lib/contact-link";
import { cx } from "@/lib/cx";
import ui from "@/styles/ui.module.css";

import styles from "./PrivateDining.module.css";

/** Sommelier strip — private dinners anywhere in the hotel. */
export function PrivateDining() {
  return (
    <section className={styles.strip}>
      <div className={styles.inner}>
        <div className={cx(ui.eyebrow, styles.eyebrow)}>In-suite &amp; beyond</div>
        <h2 className={styles.title}>
          A private dinner,
          <br />
          anywhere in the hotel.
        </h2>
        {/* The contact form has no dining topic, so this opens it on "Something else". */}
        <Link href={contactHref({ topic: "other" })} className={styles.cta}>
          Speak with our team
        </Link>
      </div>
    </section>
  );
}
