import Link from "next/link";

import { PhotoCredit } from "@/components/ui/PhotoCredit";
import { cx } from "@/lib/cx";
import ui from "@/styles/ui.module.css";

import type { Scene } from "./content";
import styles from "./SceneDetails.module.css";

type SceneDetailsProps = {
  scene: Scene;
  /** The space "Next space" opens. */
  next: Scene;
  /** Opens the next space and scrolls back up to the stage. */
  onNext: () => void;
};

/** Copy, facts and next steps for the scene currently in the viewer. */
export function SceneDetails({ scene, next, onNext }: SceneDetailsProps) {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div>
          {/* Keyed so the copy eases in again whenever the space changes. */}
          <div key={scene.id} className={styles.swap}>
            <div className={styles.meta}>
              <span className={styles.step}>Scene {scene.num}</span>
              <span className={styles.kicker}>{scene.kicker}</span>
            </div>
            <h2 className={styles.title}>{scene.name}</h2>
            <p className={cx(ui.lead, styles.description)}>{scene.description}</p>
          </div>
          <div className={styles.actions}>
            <Link href={scene.cta.href} className={ui.btnGold}>
              {scene.cta.label}
            </Link>
            <button type="button" className={styles.next} onClick={onNext}>
              <span className={styles.nextLabel}>Next:</span> {next.name}
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </button>
          </div>
        </div>

        <div className={styles.aside}>
          <dl key={scene.id} className={cx(styles.facts, styles.swap)}>
            {scene.facts.map((fact) => (
              <div key={fact.label} className={styles.fact}>
                <dt className={styles.factLabel}>{fact.label}</dt>
                <dd className={styles.factValue}>{fact.value}</dd>
              </div>
            ))}
          </dl>
          <div className={styles.credits}>
            <p className={styles.credit}>
              Sample panoramas from Wikimedia Commons, shown until our own 360&deg; photography is ready.
            </p>
            <PhotoCredit credit={scene.credit} tone="dark" />
          </div>
        </div>
      </div>
    </section>
  );
}
