import { cx } from "@/lib/cx";
import ui from "@/styles/ui.module.css";

import { TreatmentMenu } from "./TreatmentMenu";
import styles from "./Treatments.module.css";

/** The treatment menu (#treatments): heading, filter pills and sort, then the cards. */
export function Treatments() {
  return (
    <section id="treatments" className={styles.treatments} aria-labelledby="treatments-title">
      <div className={styles.inner}>
        <div data-reveal="up" className={styles.head}>
          <div>
            <div className={cx(ui.eyebrow, styles.eyebrow)}>The treatment menu</div>
            <h2 id="treatments-title" className={cx(ui.h2, styles.title)}>
              Slow hands, <em>mountain botanicals</em>
            </h2>
          </div>
          <p className={cx(ui.lead, styles.lead)}>
            Massages, facials, body rituals and longer retreats. Filter by what you&apos;re after — tap
            &ldquo;Book&rdquo; and we&apos;ll fill in the request card for you.
          </p>
        </div>
        <TreatmentMenu />
      </div>
    </section>
  );
}
