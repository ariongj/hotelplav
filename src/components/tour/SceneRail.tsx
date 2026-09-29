import { useEffect, useRef } from "react";

import { cx } from "@/lib/cx";

import type { Scene } from "./content";
import styles from "./SceneRail.module.css";

type SceneRailProps = {
  scenes: readonly Scene[];
  current: number;
  /** A 360° space is on the stage (not the 3D map): only then is a tab marked as current. */
  active: boolean;
  onSelect: (index: number) => void;
  /** -1 for the previous space, 1 for the next. */
  onStep: (delta: number) => void;
};

/** Scene tabs with previous/next arrows, directly under the viewer. */
export function SceneRail({ scenes, current, active, onSelect, onStep }: SceneRailProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  // On narrow screens the tabs scroll sideways: keep the current one in view.
  // (Scrolls the track only — never the page, which scrollIntoView would.)
  useEffect(() => {
    const track = trackRef.current;
    const tab = track?.children[current];
    if (!track || !(tab instanceof HTMLElement) || track.scrollWidth <= track.clientWidth) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({
      left: tab.offsetLeft - (track.clientWidth - tab.offsetWidth) / 2,
      behavior: reduce ? "auto" : "smooth",
    });
  }, [current]);

  return (
    <section className={styles.rail} aria-label="Choose a space">
      <div className={styles.inner}>
        <button type="button" className={styles.arrow} aria-label="Previous space" onClick={() => onStep(-1)}>
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </button>
        <div ref={trackRef} className={styles.tabs} role="group" aria-label="Spaces">
          {scenes.map((scene, i) => (
            <button
              key={scene.id}
              type="button"
              className={cx(styles.tab, active && i === current && styles.active)}
              aria-pressed={active && i === current}
              onClick={() => onSelect(i)}
            >
              <span className={styles.num}>{scene.num}</span> {scene.name}
            </button>
          ))}
        </div>
        <button type="button" className={styles.arrow} aria-label="Next space" onClick={() => onStep(1)}>
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="m6 3 5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </button>
      </div>
    </section>
  );
}
