import { site } from "@/config/site";
import { cx } from "@/lib/cx";
import ui from "@/styles/ui.module.css";

import styles from "./ContactLocation.module.css";
import { lakeFacts } from "./content";
import { LakeMap } from "./LakeMap";

export function ContactLocation() {
  return (
    <section className={styles.section} aria-labelledby="location-title">
      <div className={styles.inner}>
        <div className={styles.head} data-reveal="up">
          <div>
            <p className={ui.eyebrow}>Where we are</p>
            <h2 id="location-title" className={cx(ui.h2, styles.title)}>
              On a glacial lake, <em>906&nbsp;m up</em>
            </h2>
          </div>
          <p className={cx(ui.lead, styles.lead)}>
            Plav sits in eastern Montenegro&rsquo;s Upper Lim valley, near the Albanian and Kosovo borders, on the shore
            of a lake the last ice age left behind &mdash; with the Visitor range to the west and the Prokletije, the
            &ldquo;Accursed Mountains&rdquo;, rising to the south.
          </p>
        </div>

        <div className={styles.bento}>
          <figure className={styles.mapCard} data-reveal="up">
            <LakeMap />
            <figcaption className={styles.mapFoot}>
              <span className={styles.mapPlace}>
                <strong>{site.name}</strong>
                <span>
                  {site.address.line1}, {site.address.locality}, {site.address.country}
                </span>
              </span>
              <a href={site.directionsUrl} className={styles.mapLink} target="_blank" rel="noopener noreferrer">
                Get directions
                <span className="visually-hidden"> (opens Google Maps in a new tab)</span>
                <span aria-hidden="true">&nbsp;&#8599;</span>
              </a>
            </figcaption>
          </figure>

          <dl className={styles.stats} data-reveal="up" data-delay="120">
            {lakeFacts.map((fact) => (
              <div key={fact.value} className={styles.stat}>
                <dt className={styles.statValue}>{fact.value}</dt>
                <dd className={styles.statLabel}>{fact.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
