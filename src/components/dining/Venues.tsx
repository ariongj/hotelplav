import Link from "next/link";

import { Photo } from "@/components/ui/Photo";
import { cx } from "@/lib/cx";
import ui from "@/styles/ui.module.css";

import { VENUES, type Venue } from "./content";
import styles from "./Venues.module.css";

/** The venues as a bento: the restaurant wide, the lounge and bar side by side. */
export function Venues() {
  const [feature, ...others] = VENUES;

  return (
    <section className={styles.venues} aria-labelledby="venues-title">
      <div className={styles.inner}>
        <div data-reveal="up" className={styles.head}>
          <div>
            <div className={cx(ui.eyebrow, styles.eyebrow)}>Where to eat &amp; drink</div>
            <h2 id="venues-title" className={cx(ui.h2, styles.title)}>
              A restaurant, a lounge <em>and a bar</em>
            </h2>
          </div>
          <p className={cx(ui.lead, styles.lead)}>
            A slow six-course dinner, lunch on the lake terrace in summer, coffee and cake in the afternoon, or a late
            game of billiards — pick the day you&apos;re in the mood for.
          </p>
        </div>

        <div className={styles.bento}>
          {feature && (
            // The reveal sits on a wrapper so it never fights the card's hover lift.
            <div data-reveal="up" className={styles.featureCell}>
              <FeatureCard venue={feature} />
            </div>
          )}
          {others.map((venue, index) => (
            <div key={venue.name} data-reveal="up" data-delay={String(100 + index * 100)} className={styles.cell}>
              <VenueCard venue={venue} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** "Reserve" for the restaurant; the walk-in venues point to their hours instead. */
function VenueActions({ venue, light = false }: { venue: Venue; light?: boolean }) {
  const linkClass = cx(ui.linkUnderline, light && styles.linkLight);
  return (
    <div className={styles.actions}>
      {venue.bookable ? (
        <a href="#reserve" className={cx(ui.btnGold, styles.reserve)}>
          Reserve<span className="visually-hidden"> at {venue.name}</span>
        </a>
      ) : (
        <>
          <a href="#hours" className={cx(light ? ui.btnOutlineLight : ui.btnOutline, styles.reserve)}>
            See hours<span className="visually-hidden"> for {venue.name}</span>
          </a>
          <span className={styles.walkIn}>Walk in — no booking needed</span>
        </>
      )}
      {venue.link &&
        (venue.link.href.startsWith("#") ? (
          <a href={venue.link.href} className={linkClass}>
            {venue.link.label}
          </a>
        ) : (
          <Link href={venue.link.href} className={linkClass}>
            {venue.link.label}
          </Link>
        ))}
    </div>
  );
}

function FeatureCard({ venue }: { venue: Venue }) {
  return (
    <article className={styles.feature}>
      <div className={styles.media}>
        <Photo
          src={venue.image.src}
          alt={venue.image.alt}
          sizes="(max-width: 960px) 100vw, 720px"
          className={styles.photo}
        />
        <span className={styles.badge}>{venue.kicker}</span>
      </div>
      <div className={styles.featureBody}>
        <h3 className={styles.featureName}>{venue.name}</h3>
        <p className={styles.text}>{venue.description}</p>
        <dl className={styles.stats}>
          {venue.facts.map((fact) => (
            <div key={fact.label} className={styles.stat}>
              <dt className={styles.statLabel}>{fact.label}</dt>
              <dd className={styles.statValue}>{fact.value}</dd>
            </div>
          ))}
        </dl>
        <VenueActions venue={venue} />
      </div>
    </article>
  );
}

function VenueCard({ venue }: { venue: Venue }) {
  return (
    <article className={cx(styles.card, venue.dark && styles.dark)}>
      <div className={cx(styles.media, styles.cardMedia)}>
        <Photo
          src={venue.image.src}
          alt={venue.image.alt}
          sizes="(max-width: 760px) 100vw, 620px"
          className={styles.photo}
        />
        <span className={styles.badge}>{venue.kicker}</span>
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.cardName}>{venue.name}</h3>
        <p className={styles.text}>{venue.description}</p>
        <dl className={styles.chips}>
          {venue.facts.map((fact) => (
            <div key={fact.label} className={styles.chip}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
        <VenueActions venue={venue} light={venue.dark} />
      </div>
    </article>
  );
}
