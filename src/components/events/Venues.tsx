import Link from "next/link";

import { PhotoCredit } from "@/components/ui/PhotoCredit";
import { Photo } from "@/components/ui/Photo";
import { cx } from "@/lib/cx";
import ui from "@/styles/ui.module.css";

import styles from "./Venues.module.css";
import { staggerDelays, venues } from "./content";

export function Venues() {
  return (
    <section className={styles.section} aria-labelledby="venues-title">
      <div className={styles.container}>
        <div className={styles.header} data-reveal="up">
          <div>
            <p className={ui.eyebrowLight}>The venues</p>
            <h2 id="venues-title" className={cx(ui.h2Light, styles.title)}>
              Three venues, <em>one lake</em>
            </h2>
          </div>
          <p className={styles.note}>
            <span className={styles.noteDot} aria-hidden="true" />
            A short, level walk apart &middot; step-free access
          </p>
        </div>

        <p className={styles.swipeHint} aria-hidden="true">
          Swipe for more <span className={styles.swipeArrow}>&rarr;</span>
        </p>
        <ul className={styles.grid}>
          {venues.map((venue, i) => (
            <li key={venue.name} className={styles.item} data-reveal="up" data-delay={staggerDelays[i]}>
              <article className={styles.card}>
                <div className={styles.media}>
                  <Photo
                    src={venue.image.src}
                    alt={venue.image.alt}
                    position={venue.image.position}
                    sizes="(max-width: 640px) 86vw, (max-width: 980px) 50vw, 33vw"
                  />
                  <span className={styles.capacity}>{venue.capacity}</span>
                  {venue.image.credit && (
                    <PhotoCredit credit={venue.image.credit} className={styles.credit} />
                  )}
                </div>
                <div className={styles.body}>
                  <h3 className={styles.name}>{venue.name}</h3>
                  <p className={styles.text}>{venue.text}</p>
                  <div className={styles.footer}>
                    <ul className={styles.tags} aria-label="Details">
                      {venue.tags.map((tag) => (
                        <li key={tag} className={styles.tag}>
                          {tag}
                        </li>
                      ))}
                    </ul>
                    {venue.tour && (
                      <Link href={venue.tour.href} className={styles.tourLink}>
                        {venue.tour.label} <span aria-hidden="true">&rarr;</span>
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
