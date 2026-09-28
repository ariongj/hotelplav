import { cx } from "@/lib/cx";

import type { Scene } from "./content";
import styles from "./SceneRail.module.css";

type SceneRailProps = {
  scenes: readonly Scene[];
  current: number;
  onSelect: (index: number) => void;
  /** -1 for the previous space, 1 for the next. */
  onStep: (delta: number) => void;
};

/** Scene tabs with previous/next arrows, directly under the viewer. */
export function SceneRail({ scenes, current, onSelect, onStep }: SceneRailProps) {
  return (
    <section className={styles.rail}>
      <div className={styles.inner}>
        <button type="button" className={styles.arrow} aria-label="Previous space" onClick={() => onStep(-1)}>
          &larr;
        </button>
        <div className={styles.tabs} role="group" aria-label="Spaces">
          {scenes.map((scene, i) => (
            <button
              key={scene.id}
              type="button"
              className={cx(styles.tab, i === current && styles.active)}
              aria-pressed={i === current}
              onClick={() => onSelect(i)}
            >
              {scene.num} &middot; {scene.name}
            </button>
          ))}
        </div>
        <button type="button" className={styles.arrow} aria-label="Next space" onClick={() => onStep(1)}>
          &rarr;
        </button>
      </div>
    </section>
  );
}
