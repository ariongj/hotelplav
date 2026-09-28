import { Photo } from "@/components/ui/Photo";

import styles from "./DiningHero.module.css";

const HERO_IMAGE =
  "https://static.wixstatic.com/media/1de95c_23d1c6f843b14ab7b1fbf724cd1ad230~mv2.jpg/v1/fill/w_1920,h_1080,al_c,q_85,enc_avif,quality_auto/1de95c_23d1c6f843b14ab7b1fbf724cd1ad230~mv2.jpg";

/** Page header — the nav stays transparent until it scrolls past this. */
export function DiningHero() {
  return (
    <section className={styles.hero} data-nav-anchor>
      <Photo
        src={HERO_IMAGE}
        alt="Dining room at dusk — candlelight, set tables, mountain window"
        sizes="100vw"
        eager
      />
      <div className={styles.shade} />
      <div className={styles.content}>
        <div className={styles.kicker}>Gastronomy</div>
        <h1 className={styles.title}>Dining</h1>
        <p className={styles.lead}>
          Three venues gathered around one idea — that the Sharr Mountains should be tasted as much as they are seen.
        </p>
      </div>
    </section>
  );
}
