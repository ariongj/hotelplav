import { Photo } from "@/components/ui/Photo";
import { cx } from "@/lib/cx";

import styles from "./SeasonSection.module.css";
import { staggerDelays, type Season } from "./content";

/** One season: heading row and a three-up grid of activity cards. */
export function SeasonSection({ season }: { season: Season }) {
  return (
    <section className={cx(styles.section, season.tone === "dark" && styles.dark)}>
      <div className={styles.container}>
        <div className={styles.header} data-reveal="up">
          <div>
            <div className={styles.eyebrow}>{season.eyebrow}</div>
            <h2 className={styles.title}>{season.title}</h2>
          </div>
          <span className={styles.note}>{season.note}</span>
        </div>

        <div className={styles.grid}>
          {season.activities.map((activity, i) => (
            <article key={activity.title} className={styles.card} data-reveal="up" data-delay={staggerDelays[i]}>
              <div className={styles.media}>
                <Photo
                  src={activity.image.src}
                  alt={activity.image.alt}
                  sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 33vw"
                />
              </div>
              <div className={styles.body}>
                <h3 className={styles.name}>{activity.title}</h3>
                <p className={styles.text}>{activity.text}</p>
                <div className={styles.meta}>{activity.meta}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
