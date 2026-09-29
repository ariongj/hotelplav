import { Photo } from "@/components/ui/Photo";
import { cx } from "@/lib/cx";
import ui from "@/styles/ui.module.css";

import { BATH_FEATURES, BATH_STATS, BATHS_IMAGE } from "./content";
import styles from "./SpaPools.module.css";

/** The pools and sauna: a bold photo split with the facilities and a bento of stat cards. */
export function SpaPools() {
  return (
    <section className={styles.baths} aria-labelledby="baths-title">
      <div className={styles.grid}>
        <div data-reveal="left" className={styles.mediaCol}>
          <div className={styles.media}>
            <Photo
              src={BATHS_IMAGE.src}
              alt={BATHS_IMAGE.alt}
              sizes="(max-width: 960px) 100vw, 620px"
              className={styles.photo}
            />
          </div>
          <div className={cx(ui.glass, styles.float)}>
            <div className={styles.floatKicker}>Next door</div>
            <p className={styles.floatText}>
              Lake Plav took shape as the glaciers retreated at the end of the last ice age. Our cold plunge is a small
              tribute to it.
            </p>
          </div>
        </div>

        <div data-reveal="right">
          <div className={cx(ui.eyebrow, styles.eyebrow)}>The Lake Spa</div>
          <h2 id="baths-title" className={cx(ui.h2, styles.title)}>
            Water, warmth <em>and quiet</em>
          </h2>
          <p className={cx(ui.lead, styles.text)}>
            Glass-walled indoor pools among the pines, a few steps from the lake, and an outdoor pool in summer. Then a
            Finnish sauna, a steam room and a cold plunge — open to every hotel guest, every day. Come between
            treatments, or make an afternoon of it.
          </p>

          <ul className={styles.features}>
            {BATH_FEATURES.map((feature) => (
              <li key={feature} className={styles.feature}>
                {feature}
              </li>
            ))}
          </ul>

          <dl className={styles.stats}>
            {BATH_STATS.map((stat, index) => (
              // The label comes first for screen readers; CSS shows the number on top.
              <div key={stat.label} className={cx(styles.stat, index === 0 && styles.statDark)}>
                <dt className={styles.statLabel}>{stat.label}</dt>
                <dd className={styles.statValue}>
                  {stat.value}
                  {"unit" in stat && <span className={styles.statUnit}>{stat.unit}</span>}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
