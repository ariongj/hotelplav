import Link from "next/link";

import { cx } from "@/lib/cx";
import ui from "@/styles/ui.module.css";

import styles from "./ConciergeCta.module.css";
import { conciergeHelps, conciergeHref } from "./content";

export function ConciergeCta() {
  return (
    <section className={styles.section} aria-labelledby="concierge-title">
      <div className={styles.panel} data-reveal="up">
        <div className={styles.copy}>
          <p className={ui.eyebrowLight}>Concierge</p>
          <h2 id="concierge-title" className={cx(ui.h2Light, styles.title)}>
            One message <em>plans it all</em>
          </h2>
          <p className={cx(ui.leadLight, styles.lead)}>
            Tell us the season, the pace and who&rsquo;s coming &mdash; we&rsquo;ll shape the days around you and
            have everything waiting when you arrive.
          </p>
          <div className={styles.actions}>
            <Link href={conciergeHref} className={ui.btnGold}>
              Plan it with our concierge
            </Link>
            <Link href="/tour" className={ui.btnOutlineLight}>
              Take the 360&deg; tour
            </Link>
          </div>
        </div>

        <ul className={styles.helps}>
          {conciergeHelps.map((help, i) => (
            <li key={help.title} className={styles.help}>
              <span className={styles.helpNumber} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className={styles.helpTitle}>{help.title}</h3>
                <p className={styles.helpText}>{help.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
