import { Photo } from "@/components/ui/Photo";
import ui from "@/styles/ui.module.css";

import type { Scene } from "./content";
import styles from "./SpacesGrid.module.css";

type SpacesGridProps = {
  scenes: readonly Scene[];
  /** Opens the scene and scrolls back up to the viewer. */
  onEnter: (index: number) => void;
};

/** "Four spaces, one visit" — every scene as a card. */
export function SpacesGrid({ scenes, onEnter }: SpacesGridProps) {
  return (
    <section className={styles.section}>
      <div className={ui.container}>
        <div className={styles.head} data-reveal="up">
          <h2 className={styles.title}>Four spaces, one visit</h2>
          <span className={styles.hint}>Click a space to step inside</span>
        </div>
        <div className={styles.grid}>
          {scenes.map((scene, i) => (
            <article
              key={scene.id}
              className={styles.card}
              data-reveal="up"
              data-delay={i > 0 ? String(i * 70) : undefined}
            >
              <div className={styles.thumb}>
                <Photo
                  src={scene.src}
                  alt={scene.thumbAlt}
                  sizes="(max-width: 600px) 100vw, (max-width: 1100px) 50vw, 340px"
                />
              </div>
              <div className={styles.body}>
                <div className={styles.num}>Scene {scene.num}</div>
                <h3 className={styles.name}>{scene.name}</h3>
                <button
                  type="button"
                  className={styles.enter}
                  aria-label={`Enter space — ${scene.name}`}
                  onClick={() => onEnter(i)}
                >
                  Enter space <span aria-hidden="true">&rarr;</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
