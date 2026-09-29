import type { ReactNode } from "react";

import { BROWSE_HEADING_ID } from "./content";
import styles from "./RoomsBrowse.module.css";

/**
 * The "Find your room" section. It holds both the filter toolbar and the
 * grid, so the toolbar's sticky bar keeps sticking while the grid scrolls.
 */
export function RoomsBrowse({ children }: { children: ReactNode }) {
  return (
    <section id="results" className={styles.section} aria-labelledby={BROWSE_HEADING_ID}>
      <div className={styles.inner}>{children}</div>
    </section>
  );
}
