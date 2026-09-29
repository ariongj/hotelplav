import { cx } from "@/lib/cx";
import ui from "@/styles/ui.module.css";

import styles from "./LakeIntro.module.css";
import { lakeStats } from "./content";

const nearby = ["Prokletije National Park", "Gusinje", "Visitor", "River Lim"] as const;

/** Why Plav: the lake in a few words and four big numbers. */
export function LakeIntro() {
  return (
    <section className={styles.section} aria-labelledby="lake-intro-title">
      <div className={styles.grid}>
        <div className={styles.copy} data-reveal="left">
          <p className={ui.eyebrow}>Lake Plav</p>
          <h2 id="lake-intro-title" className={cx(ui.h2, styles.title)}>
            Carved by ice, <em>ringed by mountains</em>
          </h2>
          <p className={cx(ui.lead, styles.lead)}>
            Lake Plav took shape as the glaciers retreated at the end of the last ice age. The Visitor range rises
            to the west and the Prokletije &mdash; the &ldquo;Accursed Mountains&rdquo; &mdash; to the south,
            where the river Ljuča flows in from Gusinje; the Lim flows out to the north.
          </p>
          <p className={cx(ui.lead, styles.lead)}>
            Prokletije National Park, which takes in parts of the Plav and Gusinje municipalities, begins a short
            drive from the lake.
          </p>
          <div className={styles.nearby}>
            <span className={styles.nearbyLabel}>On the doorstep</span>
            <ul className={styles.chips}>
              {nearby.map((place) => (
                <li key={place} className={styles.chip}>
                  {place}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <dl className={styles.stats} data-reveal="right" data-delay="120">
          {lakeStats.map((stat, i) => (
            <div
              key={stat.label}
              className={cx(styles.stat, "accent" in stat && stat.accent && styles.accent, i === 3 && styles.wide)}
            >
              <dt className={styles.statLabel}>{stat.label}</dt>
              <dd className={styles.statValue}>{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
