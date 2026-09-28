import { cx } from "@/lib/cx";
import ui from "@/styles/ui.module.css";

import styles from "./ContactLocation.module.css";
import { travelFacts } from "./content";

export function ContactLocation() {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        <div data-reveal="up">
          <div className={cx(ui.eyebrow, styles.eyebrow)}>Location</div>
          <h2 className={styles.title}>
            Closer than
            <br />
            you think
          </h2>
          <dl className={styles.facts}>
            {travelFacts.map((fact) => (
              <div key={fact.label}>
                <dt className={styles.factLabel}>{fact.label}</dt>
                <dd className={styles.factValue}>
                  {fact.lines[0]}
                  <br />
                  {fact.lines[1]}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Stylised map — a placeholder until an embedded map is chosen. */}
        <div className={styles.map} role="img" aria-label="Map marking Brezovica" data-reveal="up" data-delay="90">
          <div className={styles.mapGrid} />
          <div className={styles.roadA} />
          <div className={styles.roadB} />
          <div className={styles.pin} />
          <div className={styles.pinLabel}>Brezovica</div>
        </div>
      </div>
    </section>
  );
}
