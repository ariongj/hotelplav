import { Photo } from "@/components/ui/Photo";
import { PhotoCredit } from "@/components/ui/PhotoCredit";
import ui from "@/styles/ui.module.css";

import type { Scene } from "./content";
import styles from "./SpacesGrid.module.css";

type SpacesGridProps = {
  scenes: readonly Scene[];
  /** Opens the scene and scrolls back up to the viewer. */
  onEnter: (index: number) => void;
};

/** "Four spaces, one visit" — every scene as a card; the whole card steps inside. */
export function SpacesGrid({ scenes, onEnter }: SpacesGridProps) {
  return (
    <section className={styles.section}>
      <div className={ui.container}>
        <div className={styles.head} data-reveal="up">
          <div>
            <div className={ui.eyebrow}>Scene by scene</div>
            <h2 className={styles.title}>
              Four spaces, <em>one visit</em>
            </h2>
          </div>
          <p className={styles.hint}>Choose a space &mdash; it opens in the viewer above.</p>
        </div>
        <ul className={styles.grid}>
          {scenes.map((scene, i) => (
            <li key={scene.id} data-reveal="up" data-delay={i > 0 ? String(i * 70) : undefined}>
              <div className={styles.card}>
                <div className={styles.thumb}>
                  <Photo
                    src={scene.thumb}
                    alt={scene.thumbAlt}
                    sizes="(max-width: 600px) 100vw, (max-width: 1100px) 50vw, 340px"
                  />
                  <span className={styles.badge} aria-hidden="true">
                    360&deg;
                  </span>
                </div>
                <div className={styles.body}>
                  <div className={styles.num}>
                    Scene {scene.num} &middot; {scene.kicker}
                  </div>
                  <h3 className={styles.name}>{scene.name}</h3>
                  <button
                    type="button"
                    className={styles.enter}
                    aria-label={`Step inside — ${scene.name}`}
                    onClick={() => onEnter(i)}
                  >
                    Step inside
                    <span className={styles.enterArrow} aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 14 14">
                        <path
                          d="M2 7h10M8 3l4 4-4 4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                      </svg>
                    </span>
                  </button>
                  {/* Above the button's card-wide hit area, so the link stays clickable. */}
                  <div className={styles.credit}>
                    <PhotoCredit credit={scene.credit} tone="dark" />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
