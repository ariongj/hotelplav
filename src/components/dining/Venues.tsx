import Link from "next/link";

import { Photo } from "@/components/ui/Photo";
import { cx } from "@/lib/cx";
import ui from "@/styles/ui.module.css";

import { VENUES, type Venue } from "./content";
import styles from "./Venues.module.css";

export function Venues() {
  return (
    <section className={styles.venues}>
      <div className={styles.inner}>
        <div data-reveal="up" className={styles.head}>
          <div className={cx(ui.eyebrow, styles.eyebrow)}>The Restaurants</div>
          <h2 className={styles.title}>Three tables, one mountain</h2>
        </div>

        {VENUES.map((venue, index) => (
          <VenueRow key={venue.name} venue={venue} imageFirst={index % 2 === 1} />
        ))}
      </div>
    </section>
  );
}

function VenueRow({ venue, imageFirst }: { venue: Venue; imageFirst: boolean }) {
  // Whichever column comes first slides in from the left.
  const text = (
    <div data-reveal={imageFirst ? "right" : "left"}>
      <div className={styles.kicker}>{venue.kicker}</div>
      <h3 className={styles.name}>{venue.name}</h3>
      <p className={styles.text}>{venue.description}</p>
      <dl className={styles.facts}>
        {venue.facts.map((fact) => (
          <div key={fact.label}>
            <dt className={styles.factLabel}>{fact.label}</dt>
            <dd className={styles.factValue}>{fact.value}</dd>
          </div>
        ))}
      </dl>
      <div className={styles.actions}>
        <a href="#reserve" className={styles.reserve}>
          Reserve<span className="visually-hidden"> at {venue.name}</span>
        </a>
        {venue.link.href.startsWith("#") ? (
          <a href={venue.link.href} className={ui.linkUnderline}>
            {venue.link.label}
          </a>
        ) : (
          <Link href={venue.link.href} className={ui.linkUnderline}>
            {venue.link.label}
          </Link>
        )}
      </div>
    </div>
  );

  const photo = (
    <div data-reveal={imageFirst ? "left" : "right"} className={styles.media}>
      <Photo
        src={venue.image.src}
        alt={venue.image.alt}
        sizes="(max-width: 800px) 100vw, (max-width: 1400px) 50vw, 640px"
      />
    </div>
  );

  return (
    <article className={styles.venue}>
      {imageFirst ? photo : text}
      {imageFirst ? text : photo}
    </article>
  );
}
