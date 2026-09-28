import { cx } from "@/lib/cx";
import ui from "@/styles/ui.module.css";

import { TreatmentMenu } from "./TreatmentMenu";
import styles from "./Treatments.module.css";

/** The treatment menu (#treatments): heading, filter/sort toolbar and card grid. */
export function Treatments() {
  return (
    <section id="treatments" className={styles.treatments}>
      <div className={styles.inner}>
        <div data-reveal="up" className={styles.head}>
          <div className={cx(ui.eyebrow, styles.eyebrow)}>The Treatment Menu</div>
          <h2 className={styles.title}>Restore what the world takes</h2>
        </div>
        <TreatmentMenu />
      </div>
    </section>
  );
}
