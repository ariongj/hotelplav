import Link from "next/link";

import { cx } from "@/lib/cx";
import ui from "@/styles/ui.module.css";

import type { Scene } from "./content";
import styles from "./SceneDetails.module.css";

/** Copy, facts and next step for the scene currently in the viewer. */
export function SceneDetails({ scene }: { scene: Scene }) {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div>
          <div className={cx(ui.eyebrow, styles.kicker)}>{scene.kicker}</div>
          <h2 className={styles.title}>{scene.name}</h2>
          <p className={cx(ui.lead, styles.description)}>{scene.description}</p>
          <Link href={scene.cta.href} className={cx(ui.btnGold, styles.cta)}>
            {scene.cta.label}
          </Link>
        </div>
        <div className={styles.aside}>
          <dl className={styles.facts}>
            {scene.facts.map((fact) => (
              <div key={fact.label} className={styles.fact}>
                <dt className={styles.factLabel}>{fact.label}</dt>
                <dd className={styles.factValue}>{fact.value}</dd>
              </div>
            ))}
          </dl>
          {/* TODO(content): addressed to the hotel, not guests — replace once the real captures are in. */}
          <p className={styles.credit}>
            Sample 360&deg; captures (Wikimedia Commons, CC BY-SA) shown for demonstration &mdash; swap in your
            property&rsquo;s own panoramas anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
