import { cx } from "@/lib/cx";
import ui from "@/styles/ui.module.css";

import styles from "./DiningStatement.module.css";

export function DiningStatement() {
  return (
    <section className={styles.statement}>
      <div className={styles.inner}>
        <div data-reveal="up" className={cx(ui.eyebrow, styles.eyebrow)}>
          At the table
        </div>
        <p data-reveal="up" data-delay="80" className={styles.text}>
          Everything begins within sight of the peaks — the cheese from the valley farm, the trout from the lake below,
          the herbs from the kitchen garden. Then it is plated with quiet precision, and served by candlelight.
        </p>
      </div>
    </section>
  );
}
