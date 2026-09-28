import { Photo } from "@/components/ui/Photo";

import styles from "./SpaHero.module.css";

const HERO_IMAGE =
  "https://static.wixstatic.com/media/1de95c_424350ad23d241d988255f926572dd10~mv2.jpg/v1/fill/w_1920,h_1080,al_c,q_85,enc_avif,quality_auto/1de95c_424350ad23d241d988255f926572dd10~mv2.jpg";

/** Page header — the nav stays transparent until it scrolls past this. */
export function SpaHero() {
  return (
    <section className={styles.hero} data-nav-anchor>
      <Photo src={HERO_IMAGE} alt="Spa — thermal pool by candlelight, steam, mountain window" sizes="100vw" eager />
      <div className={styles.shade} />
      <div className={styles.content}>
        <div className={styles.kicker}>Wellness</div>
        <h1 className={styles.title}>Spa &amp; Wellness</h1>
        <p className={styles.lead}>
          Pools, Finnish sauna, alpine steam and quiet hands at 1,100 metres — an oasis of calm at the heart of the hotel.
        </p>
      </div>
    </section>
  );
}
