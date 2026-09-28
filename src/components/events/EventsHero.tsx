import { Photo } from "@/components/ui/Photo";

import styles from "./EventsHero.module.css";
import { images } from "./content";

export function EventsHero() {
  return (
    <section className={styles.hero} data-nav-anchor>
      <Photo src={images.hero.src} alt={images.hero.alt} eager />
      <div className={styles.shade} aria-hidden="true" />
      <div className={styles.content}>
        <div className={styles.eyebrow} data-reveal="up">
          Events &amp; Weddings
        </div>
        <h1 className={styles.title} data-reveal="up" data-delay="80">
          Gathered,
          <br />
          <em>at altitude.</em>
        </h1>
      </div>
    </section>
  );
}
