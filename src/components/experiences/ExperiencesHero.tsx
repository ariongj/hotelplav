import { Photo } from "@/components/ui/Photo";

import styles from "./ExperiencesHero.module.css";
import { heroImage } from "./content";

export function ExperiencesHero() {
  return (
    <section className={styles.hero} data-nav-anchor>
      <Photo src={heroImage.src} alt={heroImage.alt} eager />
      <div className={styles.shade} aria-hidden="true" />
      <div className={styles.content}>
        <div className={styles.eyebrow} data-reveal="up">
          Experiences
        </div>
        <h1 className={styles.title} data-reveal="up" data-delay="80">
          The mountain,
          <br />
          <em>in every season.</em>
        </h1>
      </div>
    </section>
  );
}
