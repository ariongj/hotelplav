import Link from "next/link";

import { TOUR_SCENES } from "./content";
import styles from "./TourStrip.module.css";

/** 360° strip — deep links into scenes of the virtual tour. */
export function TourStrip() {
  return (
    <section className={styles.strip}>
      <div className={styles.inner}>
        <div data-reveal="up" className={styles.intro}>
          <div className={styles.eyebrow}>360&deg; Virtual Tour</div>
          <h2 className={styles.title}>
            Arrive already
            <br />
            at ease.
          </h2>
          <p className={styles.text}>
            Walk the hotel in full 360&deg; before you book your treatment &mdash; drag to look around each space.
          </p>
        </div>

        <ul data-reveal="up" data-delay="100" className={styles.links}>
          {TOUR_SCENES.map((scene) => (
            <li key={scene.href}>
              <Link href={scene.href} className={styles.link}>
                <span className={styles.linkName}>{scene.name}</span>
                <span className={styles.linkCta}>
                  Enter 360&deg; <span aria-hidden="true">&rarr;</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
