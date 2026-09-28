import Link from "next/link";

import { LazyPanoViewer } from "@/components/pano/LazyPanoViewer";
import { Photo } from "@/components/ui/Photo";
import { site } from "@/config/site";
import { getRoom } from "@/lib/booking/rooms";
import { contactHref } from "@/lib/contact-link";
import { cx } from "@/lib/cx";
import { euro } from "@/lib/format";
import ui from "@/styles/ui.module.css";

import { dining, events, locationFacts, offers, reviews, roomTeasers, spa, stats, tourTeaser, trust } from "./content";
import { Gallery } from "./Gallery";
import styles from "./sections.module.css";

export function TrustStrip() {
  return (
    <section className={styles.trust} aria-label="Why book with us">
      <div className={styles.trustGrid}>
        {trust.map((item) => (
          <div key={item.label}>
            <div className={styles.trustLabel}>{item.label}</div>
            <div className={styles.trustValue}>{item.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Statement() {
  return (
    <section className={styles.statement}>
      <div className={styles.statementInner}>
        <div data-reveal="up" className={cx(ui.eyebrow, styles.statementEyebrow)}>
          Welcome to Brezovica
        </div>
        <p data-reveal="up" data-delay="80" className={styles.statementText}>
          Cradled beneath the snow-lit peaks of the Sharr Mountains, Brezovica Hotel is a sanctuary where alpine
          grandeur meets a warmth that feels, unmistakably, like your own.
        </p>
        <div data-reveal="up" data-delay="160" className={styles.stats}>
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function RoomsTeaser() {
  return (
    <section id="rooms" className={cx(ui.section, styles.bgLight)}>
      <div className={ui.container}>
        <div className={styles.roomsHead}>
          <div data-reveal="up">
            <div className={cx(ui.eyebrow, styles.mb20)}>Rooms &amp; Suites</div>
            <h2 className={styles.roomsTitle}>Where the day begins slowly</h2>
          </div>
          <Link href="/rooms" data-reveal="up" className={styles.viewAll}>
            View all rooms →
          </Link>
        </div>
        <div className={styles.roomsGrid}>
          {roomTeasers.map((teaser, i) => {
            const room = getRoom(teaser.id);
            return (
              <article key={teaser.id} className={styles.roomCard} data-reveal="up" data-delay={i ? String(i * 80) : undefined}>
                <div className={styles.roomImage}>
                  <Photo src={teaser.image} alt={room.name} sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 25vw" />
                  {teaser.badge && <span className={styles.badge}>{teaser.badge}</span>}
                </div>
                <div className={styles.roomBody}>
                  <h3 className={styles.roomName}>{room.name}</h3>
                  <div className={styles.roomMeta}>{teaser.meta}</div>
                  <div className={styles.priceRow}>
                    <span className={styles.priceLead}>
                      from <strong className={styles.price}>{euro(room.baseRate)}</strong> / night
                    </span>
                    <Link href="/rooms" className={ui.linkUnderline} aria-label={`Discover the ${room.name}`}>
                      Discover
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function DiningTeaser() {
  return (
    <section id="dining" className={cx(ui.section, styles.bgDark)}>
      <div className={styles.split}>
        <div data-reveal="left">
          <div className={cx(ui.eyebrowLight, styles.mb24)}>Dining</div>
          <h2 className={cx(ui.h2Light, styles.mb26)}>
            A table set by
            <br />
            the mountains
          </h2>
          <p className={cx(ui.leadLight, styles.copyDark)}>
            Three restaurants, one philosophy: ingredients gathered within sight of the peaks, plated with quiet
            precision and served by candlelight. From sunrise breakfast to a chef&rsquo;s tasting under the stars.
          </p>
          <div className={styles.hours}>
            {dining.hours.map((item) => (
              <div key={item.label}>
                <div className={styles.hoursLabel}>{item.label}</div>
                <div className={styles.hoursValue}>{item.value}</div>
              </div>
            ))}
          </div>
          <Link href="/dining#reserve" className={ui.btnGold}>
            Reserve a table
          </Link>
        </div>
        <div data-reveal="right" className={styles.diningGrid}>
          {dining.images.map((image, i) => (
            <div key={image.src} className={cx(styles.diningTile, i === 0 && styles.diningTileTall)}>
              <Photo src={image.src} alt={image.alt} sizes="(max-width: 700px) 50vw, 25vw" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SpaTeaser() {
  return (
    <section id="spa" className={cx(ui.section, styles.bgPaper)}>
      <div className={styles.split}>
        <div data-reveal="left" className={styles.spaImage}>
          <Photo src={spa.image.src} alt={spa.image.alt} sizes="(max-width: 700px) 100vw, 50vw" />
        </div>
        <div data-reveal="right">
          <div className={cx(ui.eyebrow, styles.mb24)}>Spa &amp; Wellness</div>
          <h2 className={cx(ui.h2, styles.mb26)}>
            The art of
            <br />
            letting go
          </h2>
          <p className={cx(ui.lead, styles.copyLight)}>
            Pools, Finnish sauna and alpine steam at 1,100 metres. Our wellness rituals draw on mountain botanicals to
            restore what the world takes.
          </p>
          <ul className={styles.treatments}>
            {spa.treatments.map((item) => (
              <li key={item.name} className={styles.treatment}>
                <span className={styles.treatmentName}>{item.name}</span>
                <span className={styles.treatmentPrice}>{item.price}</span>
              </li>
            ))}
          </ul>
          <Link href="/spa#book" className={cx(ui.btnOutline, styles.mt34)}>
            Book a treatment
          </Link>
        </div>
      </div>
    </section>
  );
}

export function TourTeaser() {
  return (
    <section id="tour" className={cx(ui.section, styles.bgDeeper)}>
      <div className={styles.split}>
        <div data-reveal="left">
          <div className={cx(ui.eyebrowLight, styles.mb24)}>360&deg; Virtual Tour</div>
          <h2 className={cx(ui.h2Light, styles.mb26)}>
            Walk the halls
            <br />
            before you arrive
          </h2>
          <p className={cx(ui.leadLight, styles.copyDark)}>
            Four spaces of the resort, captured in full 360&deg;. Drag the view beside you &mdash; then step into the
            valley, the suite and the chapel.
          </p>
          <div className={styles.tourActions}>
            <Link href="/tour" className={ui.btnGold}>
              Launch the full tour
            </Link>
            <Link href="/tour#guided-tour" className={styles.guidedLink}>
              Take the guided 3D tour &rarr;
            </Link>
          </div>
          <p className={styles.tourHint}>Drag to look around &middot; double-tap to zoom</p>
        </div>
        <div data-reveal="right" className={styles.tourFrame}>
          <LazyPanoViewer
            className={styles.tourViewer}
            src={tourTeaser.src}
            yaw={tourTeaser.yaw}
            pitch={tourTeaser.pitch}
            fov={tourTeaser.fov}
            autorotate={tourTeaser.autorotate}
            label={tourTeaser.label}
            touchAction="pan-y"
          />
        </div>
      </div>
    </section>
  );
}

export function EventsTeaser() {
  return (
    <section id="events" className={cx(ui.section, styles.bgLight)}>
      <div className={ui.container}>
        <div data-reveal="up" className={styles.eventsHead}>
          <div className={cx(ui.eyebrow, styles.mb22)}>Events &amp; Weddings</div>
          <h2 className={cx(ui.h2, styles.mb22)}>
            Occasions held
            <br />
            at altitude
          </h2>
          <p className={ui.lead}>
            From intimate mountain weddings to boardrooms with a view — our events team choreographs every detail.
          </p>
        </div>
        <div data-reveal="up" className={styles.eventsImage}>
          <Photo src={events.image.src} alt={events.image.alt} sizes="(max-width: 1300px) 100vw, 1280px" />
        </div>
        <div className={styles.eventsGrid}>
          {events.cards.map((card, i) => (
            <div key={card.title} data-reveal="up" data-delay={i ? "80" : undefined} className={styles.eventCard}>
              <h3 className={styles.eventTitle}>{card.title}</h3>
              <p className={styles.eventText}>{card.text}</p>
            </div>
          ))}
          <div data-reveal="up" data-delay="160" className={styles.capacityCard}>
            <div>
              {events.capacities.map((row) => (
                <div key={row.label} className={styles.capacityRow}>
                  <span>{row.label}</span>
                  <span className={styles.capacityValue}>{row.value}</span>
                </div>
              ))}
            </div>
            <Link href={contactHref({ topic: "events" })} className={styles.enquire}>
              Enquire →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function GallerySection() {
  return (
    <section id="gallery" className={cx(ui.section, styles.bgPaper)}>
      <div className={ui.container}>
        <div data-reveal="up" className={styles.galleryHead}>
          <div className={cx(ui.eyebrow, styles.mb22)}>Gallery</div>
          <h2 className={ui.h2}>A closer look</h2>
        </div>
        <Gallery />
      </div>
    </section>
  );
}

export function Offers() {
  return (
    <section id="offers" className={cx(ui.section, styles.bgSand)}>
      <div className={ui.container}>
        <div data-reveal="up" className={styles.offersHead}>
          <div className={cx(styles.offersEyebrow, styles.mb22)}>Offers &amp; Packages</div>
          <h2 className={ui.h2}>Reasons to linger longer</h2>
        </div>
        <div className={styles.offersGrid}>
          {offers.map((offer, i) => (
            <article key={offer.title} data-reveal="up" data-delay={i ? String(i * 80) : undefined} className={styles.offer}>
              <div className={styles.offerImage}>
                <Photo src={offer.image} alt={offer.title} sizes="(max-width: 700px) 100vw, 33vw" />
                <span className={styles.offerBadge}>Active</span>
              </div>
              <div className={styles.offerBody}>
                <h3 className={styles.offerTitle}>{offer.title}</h3>
                <div className={styles.offerDates}>{offer.dates}</div>
                <p className={styles.offerText}>{offer.text}</p>
                <div className={styles.offerFoot}>
                  <span className={styles.priceLead}>
                    {offer.priceLead} <strong className={styles.price}>{offer.price}</strong>
                  </span>
                  <a href="#book" className={ui.linkUnderline} aria-label={`Book ${offer.title}`}>
                    Book
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stars({ className }: { className: string }) {
  return (
    <div className={className} role="img" aria-label="Five out of five stars">
      ★★★★★
    </div>
  );
}

export function Reviews() {
  return (
    <section className={cx(ui.section, styles.bgPaper)}>
      <div className={styles.reviews}>
        <div data-reveal="up" className={cx(ui.eyebrow, styles.mb26)}>
          Guest Reviews
        </div>
        <div data-reveal="up" className={styles.rating}>
          <Stars className={styles.ratingStars} />
          <span className={styles.ratingText}>4.9 · 1,240 reviews</span>
        </div>
        <figure className={styles.featured}>
          <blockquote data-reveal="up" className={styles.quote}>
            &ldquo;{reviews.featured.quote}&rdquo;
          </blockquote>
          <figcaption data-reveal="up" className={styles.quoteBy}>
            {reviews.featured.author}
          </figcaption>
        </figure>
        <div className={styles.reviewGrid}>
          {reviews.cards.map((review, i) => (
            <figure key={review.author} data-reveal="up" data-delay={i ? String(i * 80) : undefined} className={styles.review}>
              <Stars className={styles.reviewStars} />
              <blockquote className={styles.reviewText}>&ldquo;{review.quote}&rdquo;</blockquote>
              <figcaption className={styles.reviewBy}>{review.author}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Location() {
  return (
    <section id="location" className={cx(ui.section, styles.bgLight)}>
      <div className={styles.locationGrid}>
        <div data-reveal="left">
          <div className={cx(ui.eyebrow, styles.mb24)}>Location</div>
          <h2 className={cx(ui.h2, styles.mb26)}>
            Find your way
            <br />
            to Brezovica
          </h2>
          <dl className={styles.facts}>
            {locationFacts.map((fact) => (
              <div key={fact.label}>
                <dt className={styles.factLabel}>{fact.label}</dt>
                <dd className={styles.factValue}>
                  {fact.lines.map((line, i) => (
                    <span key={line}>
                      {i > 0 && <br />}
                      {line}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
          <a href={site.directionsUrl} target="_blank" rel="noopener noreferrer" className={ui.btnOutline}>
            Get directions
          </a>
        </div>
        <div data-reveal="right" className={styles.map} role="img" aria-label="Map: Brezovica in the Sharr Mountains, Kosovo">
          <div className={styles.mapGrid} />
          <div className={styles.mapRoadA} />
          <div className={styles.mapRoadB} />
          <div className={styles.mapPin} />
          <div className={styles.mapLabel}>Brezovica</div>
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className={styles.finalCta}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.finalInner}>
        <div data-reveal="up" className={styles.finalEyebrow}>
          Your stay awaits
        </div>
        <h2 data-reveal="up" data-delay="80" className={styles.finalTitle}>
          The mountains are ready.
          <br />
          So are we.
        </h2>
        <a href="#book" data-reveal="up" data-delay="160" className={styles.finalButton}>
          Reserve your stay
        </a>
      </div>
    </section>
  );
}
