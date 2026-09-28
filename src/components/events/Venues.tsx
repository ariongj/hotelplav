import Link from "next/link";

import { Photo } from "@/components/ui/Photo";
import { cx } from "@/lib/cx";
import ui from "@/styles/ui.module.css";

import styles from "./Venues.module.css";
import { staggerDelays, venues } from "./content";

export function Venues() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header} data-reveal="up">
          <div>
            <div className={cx(ui.eyebrowLight, styles.eyebrow)}>The venues</div>
            <h2 className={styles.title}>Three rooms, one view</h2>
          </div>
          <span className={styles.note}>All venues on one level &middot; step-free access</span>
        </div>

        <div className={styles.grid}>
          {venues.map((venue, i) => (
            <article key={venue.name} className={styles.card} data-reveal="up" data-delay={staggerDelays[i]}>
              <div className={styles.media}>
                <Photo
                  src={venue.image.src}
                  alt={venue.image.alt}
                  sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 33vw"
                />
              </div>
              <div className={styles.body}>
                <h3 className={styles.name}>{venue.name}</h3>
                <p className={styles.text}>{venue.text}</p>
                {venue.tour ? (
                  <div className={styles.footer}>
                    <div className={styles.meta}>{venue.meta}</div>
                    <Link href={venue.tour.href} className={styles.tourLink}>
                      {venue.tour.label}
                    </Link>
                  </div>
                ) : (
                  <div className={styles.meta}>{venue.meta}</div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
