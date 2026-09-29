import Link from "next/link";

import { ResortMap } from "@/components/resort3d/ResortMap";
import ui from "@/styles/ui.module.css";

import { HeroBooking } from "./HeroBooking";
import styles from "./HomeHero.module.css";

/** Full-screen opening: the live 3D valley, the promise, and the booking bar. */
export function HomeHero() {
  return (
    <section className={styles.hero} data-nav-anchor aria-label="Welcome to Plav Hotel">
      <div className={styles.scene}>
        <ResortMap variant="hero" />
      </div>
      <div className={styles.shade} aria-hidden="true" />

      {/* No data-reveal here: the first screen must not wait for hydration (CSS entrance instead). */}
      <div className={styles.content}>
        <div className={styles.kicker}>Plav · Montenegro</div>
        <h1 className={styles.title}>
          Where the lake meets <em>the Accursed Mountains.</em>
        </h1>
        <p className={styles.lead}>
          A lakeside hotel &amp; spa on Lake Plav, beneath the Prokletije peaks. Look around in 3D — or let us show
          you.
        </p>
        <div className={styles.actions}>
          <Link href="/tour#guided-tour" className={ui.btnGold}>
            <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M3.5 1.8v10.4L12 7z" fill="currentColor" />
            </svg>
            Start the guided tour
          </Link>
          <Link href="/tour" className={ui.btnOutlineLight}>
            Explore in 3D
          </Link>
        </div>
      </div>

      <div className={styles.booking}>
        <HeroBooking />
      </div>
    </section>
  );
}
