import Link from "next/link";

import { site } from "@/config/site";
import { contactHref } from "@/lib/contact-link";
import { cx } from "@/lib/cx";
import ui from "@/styles/ui.module.css";

import { PRIVATE_OCCASIONS } from "./content";
import styles from "./PrivateDining.module.css";

/** Private dining strip — dinners in-suite or anywhere in the hotel. */
export function PrivateDining() {
  return (
    <section className={styles.strip} aria-labelledby="private-dining-title">
      <div className={styles.card} data-reveal="up">
        <div>
          <div className={cx(ui.eyebrowLight, styles.eyebrow)}>Private dining</div>
          <h2 id="private-dining-title" className={styles.title}>
            A table of your own, <em>anywhere by the lake</em>
          </h2>
          <p className={styles.text}>
            In your suite, around a long table for the whole family, or somewhere quiet for two — tell us the occasion
            and the kitchen will write a menu for it.
          </p>
          <ul className={styles.occasions}>
            {PRIVATE_OCCASIONS.map((occasion) => (
              <li key={occasion} className={styles.occasion}>
                {occasion}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.actions}>
          <Link href={contactHref({ topic: "dining" })} className={ui.btnGold}>
            Speak with our team
          </Link>
          <a href={`mailto:${site.email.dine}`} className={styles.mail}>
            or write to <span>{site.email.dine}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
