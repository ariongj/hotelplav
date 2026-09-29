import Link from "next/link";

import { LazyPanoViewer } from "@/components/pano/LazyPanoViewer";
import { guideMinutes } from "@/components/tour/guide";
import { Photo } from "@/components/ui/Photo";
import { PhotoCredit } from "@/components/ui/PhotoCredit";
import { site } from "@/config/site";
import { contactHref } from "@/lib/contact-link";
import { cx } from "@/lib/cx";
import { plural } from "@/lib/format";
import ui from "@/styles/ui.module.css";

import { duo, intro, locationFacts, reviews, tourTeaser } from "./content";
import { Gallery } from "./Gallery";
import { RoomsRail } from "./RoomsRail";
import { SeasonsTabs } from "./SeasonsTabs";
import styles from "./sections.module.css";

const NUMBER_WORDS = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

/** "two minutes" — spelled out for prose, digits past ten. */
function minutesInWords(minutes: number): string {
  return plural(minutes, "minute").replace(/^\d+/, (n) => NUMBER_WORDS[Number(n) - 1] ?? n);
}

export function Intro() {
  return (
    <section id="discover" className={cx(ui.section, styles.intro)}>
      <div className={cx(ui.container, styles.introGrid)}>
        <div className={styles.introCopy}>
          <h2 className={cx(ui.eyebrow, styles.m0)} data-reveal="up">
            Welcome to Plav
          </h2>
          <p className={styles.statement} data-reveal="up" data-delay="80">
            {intro.statement}
          </p>
          <Link href="/experiences" className={cx(ui.linkUnderline, styles.mt32)} data-reveal="up" data-delay="140">
            What to do here <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div data-reveal="scale">
          <div className={styles.introPhoto}>
            <Photo
              src={intro.image.src}
              alt={intro.image.alt}
              position={intro.image.position}
              sizes="(max-width: 900px) 100vw, 45vw"
            />
            <span className={styles.introTag}>
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <path d="M7 13s4.5-4.2 4.5-7.4a4.5 4.5 0 0 0-9 0C2.5 8.8 7 13 7 13Z" fill="currentColor" />
                <circle cx="7" cy="5.6" r="1.6" fill="var(--dark)" />
              </svg>
              Lake Plav · 906 m
            </span>
          </div>
          <PhotoCredit credit={intro.image.credit} tone="dark" className={styles.introCredit} />
        </div>
      </div>
      <ul className={cx(ui.container, styles.stats)}>
        {intro.stats.map((stat, i) => (
          <li key={stat.label} className={styles.stat} data-reveal="up" data-delay={String(i * 70)}>
            <span className={styles.statValue}>{stat.value}</span>
            <span className={styles.statLabel}>{stat.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Stay() {
  return (
    <section id="stay" className={cx(ui.section, styles.stay)}>
      <div className={cx(ui.container, styles.rowHead)}>
        <div>
          <div className={ui.eyebrow} data-reveal="up">
            Stay
          </div>
          <h2 className={cx(ui.h2, styles.mt18)} data-reveal="up" data-delay="80">
            Rooms made for <em className={styles.accent}>the view</em>
          </h2>
        </div>
        <Link href="/rooms" className={ui.btnOutline} data-reveal="up" data-delay="140">
          All rooms &amp; rates
        </Link>
      </div>
      <div className={ui.container} data-reveal="up" data-delay="120">
        <RoomsRail />
      </div>
    </section>
  );
}

export function Seasons() {
  return (
    <section id="seasons" className={cx(ui.section, styles.seasons)}>
      <div className={ui.container}>
        <SeasonsTabs />
      </div>
    </section>
  );
}

export function Duo() {
  return (
    <section className={cx(ui.section, styles.duoSection)} aria-label="Spa and dining">
      <div className={cx(ui.container, styles.duo)}>
        {duo.map((card, i) => (
          <Link
            key={card.href}
            href={card.href}
            className={cx(styles.duoCard, i === 1 && styles.duoCardOffset)}
            data-reveal="up"
            data-delay={String(i * 100)}
          >
            <Photo src={card.image.src} alt={card.image.alt} sizes="(max-width: 900px) 100vw, 50vw" />
            <div className={styles.duoShade} aria-hidden="true" />
            <div className={styles.duoBody}>
              <span className={styles.duoKicker}>{card.kicker}</span>
              <h2 className={styles.duoTitle}>{card.title}</h2>
              <p className={styles.duoText}>{card.text}</p>
              <span className={styles.duoCta}>
                {card.cta} <span aria-hidden="true">→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function TourBand() {
  return (
    <section id="tour" className={cx(ui.section, styles.tour)}>
      <div className={styles.tourGlow} aria-hidden="true" />
      <div className={cx(ui.container, styles.tourGrid)}>
        <div>
          <div className={ui.eyebrowLight} data-reveal="up">
            Virtual tour · 3D &amp; 360°
          </div>
          <h2 className={cx(ui.h2Light, styles.mt18)} data-reveal="up" data-delay="80">
            Look around <em className={styles.accentLight}>before you arrive</em>
          </h2>
          <p className={cx(ui.leadLight, styles.mt24)} data-reveal="up" data-delay="140">
            Fly over the hotel and the lake in 3D, then step inside in full 360°. Prefer to sit back? The guided tour
            shows you everything in about {minutesInWords(guideMinutes)} — with a voice if you like.
          </p>
          <div className={styles.tourActions} data-reveal="up" data-delay="200">
            <Link href="/tour#guided-tour" className={ui.btnGold}>
              <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden="true">
                <path d="M3.5 1.8v10.4L12 7z" fill="currentColor" />
              </svg>
              Start the guided tour
            </Link>
            <Link href="/tour" className={ui.btnOutlineLight}>
              Explore on my own
            </Link>
          </div>
          <ul className={styles.tourTips} data-reveal="up" data-delay="240">
            <li>Drag to look around</li>
            <li>Pinch or double-tap to zoom</li>
            <li>Works in your phone&rsquo;s browser</li>
          </ul>
        </div>
        <div data-reveal="scale">
          <div className={styles.tourFrame}>
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
          <PhotoCredit credit={tourTeaser.credit} className={styles.tourCredit} />
        </div>
      </div>
    </section>
  );
}

export function GallerySection() {
  return (
    <section id="gallery" className={cx(ui.section, styles.gallery)}>
      <div className={ui.container}>
        <div className={styles.rowHead}>
          <div>
            <div className={ui.eyebrow} data-reveal="up">
              Gallery
            </div>
            <h2 className={cx(ui.h2, styles.mt18)} data-reveal="up" data-delay="80">
              A look around
            </h2>
          </div>
        </div>
        <Gallery />
      </div>
    </section>
  );
}

function Stars() {
  return (
    <span className={styles.stars} aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 16 16">
          <path d="m8 1.2 2.1 4.3 4.7.7-3.4 3.3.8 4.7L8 12l-4.2 2.2.8-4.7-3.4-3.3 4.7-.7z" fill="currentColor" />
        </svg>
      ))}
    </span>
  );
}

export function Reviews() {
  return (
    <section id="reviews" className={cx(ui.section, styles.reviews)}>
      <div className={cx(ui.container, styles.reviewsGrid)}>
        <div>
          <h2 className={cx(ui.eyebrow, styles.m0)} data-reveal="up">
            Guest stories
          </h2>
          <div className={styles.rating} data-reveal="up" data-delay="80">
            <span className={styles.ratingValue}>{reviews.rating}</span>
            <span>
              <Stars />
              <span className={styles.ratingCount}>
                <span className="visually-hidden">Rated {reviews.rating} out of 5 from </span>
                {reviews.count}
              </span>
            </span>
          </div>
          <blockquote className={styles.featured} data-reveal="up" data-delay="140">
            <p>&ldquo;{reviews.featured.quote}&rdquo;</p>
            <footer>— {reviews.featured.author}</footer>
          </blockquote>
        </div>
        <ul className={styles.reviewCards}>
          {reviews.cards.map((card, i) => (
            <li key={card.author} className={styles.reviewCard} data-reveal="up" data-delay={String(i * 80)}>
              <Stars />
              <p>&ldquo;{card.quote}&rdquo;</p>
              <span className={styles.reviewAuthor}>{card.author}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Illustrative map of the valley — not to scale. */
function PlavMap() {
  return (
    <svg className={styles.mapSvg} viewBox="0 0 520 440" role="img" aria-labelledby="plav-map-title">
      <title id="plav-map-title">
        Illustrative map: Plav Hotel on the eastern shore of Lake Plav. The town of Plav lies just north-east, Gusinje
        to the south-west and the Prokletije mountains to the south. The Lim flows out of the lake to the north;
        Podgorica airport is about 2½ hours by car.
      </title>
      <defs>
        <linearGradient id="plav-map-lake" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5f9ea3" />
          <stop offset="1" stopColor="#2f7176" />
        </linearGradient>
        <pattern id="plav-map-dots" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#0f3b3f" opacity="0.08" />
        </pattern>
      </defs>
      <rect width="520" height="440" fill="url(#plav-map-dots)" />

      {/* Prokletije ridges to the south */}
      <path
        d="M0 440 L0 372 L40 350 L78 364 L120 322 L160 346 L205 300 L250 338 L292 312 L336 342 L380 296 L424 330 L470 306 L520 330 L520 440 Z"
        fill="#0f3b3f"
        opacity="0.12"
      />
      <path
        d="M0 440 L0 398 L56 382 L104 396 L150 370 L200 390 L248 364 L300 388 L352 372 L400 392 L452 368 L520 386 L520 440 Z"
        fill="#0f3b3f"
        opacity="0.16"
      />
      <text x="512" y="420" textAnchor="end" className={styles.mapMountain}>
        PROKLETIJE
      </text>

      {/* Lim river, flowing north out of the lake */}
      <path
        d="M262 150 C 270 118, 250 92, 262 64 S 276 20, 268 0"
        fill="none"
        stroke="#5f9ea3"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <text x="276" y="40" className={styles.mapRiver}>
        Lim
      </text>

      {/* Roads */}
      <path
        d="M318 0 C 320 50, 330 96, 330 132 S 312 196, 322 250"
        fill="none"
        stroke="#b8894a"
        strokeWidth="2.5"
        strokeDasharray="1 7"
        strokeLinecap="round"
      />
      <path
        d="M196 232 C 160 262, 120 272, 70 300"
        fill="none"
        stroke="#b8894a"
        strokeWidth="2.5"
        strokeDasharray="1 7"
        strokeLinecap="round"
      />

      {/* Lake Plav */}
      <path
        d="M246 150 C 290 140, 318 176, 316 218 C 314 262, 288 292, 250 292 C 208 292, 186 262, 190 222 C 194 182, 210 156, 246 150 Z"
        fill="url(#plav-map-lake)"
      />
      <path d="M216 236 h40 M232 256 h52 M222 214 h30" stroke="#cfe3e6" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <text x="230" y="186" className={styles.mapLake}>
        Lake Plav
      </text>

      {/* Town */}
      <g className={styles.mapTown}>
        <circle cx="352" cy="112" r="5" />
        <text x="364" y="116">
          Plav
        </text>
      </g>
      <g className={styles.mapTown}>
        <circle cx="70" cy="300" r="5" />
        <text x="54" y="326">
          Gusinje
        </text>
      </g>
      <text x="508" y="22" textAnchor="end" className={styles.mapRoute}>
        ↑ Podgorica · 2½ h
      </text>

      {/* Hotel pin */}
      <g className={styles.mapPin}>
        <circle cx="318" cy="236" r="16" className={styles.mapPulse} />
        <circle cx="318" cy="236" r="9" />
        <circle cx="318" cy="236" r="3.5" fill="#fff" />
      </g>
      <g>
        <rect x="336" y="220" width="104" height="32" rx="16" fill="#0f3b3f" className={styles.mapHotelPill} />
        <text x="352" y="241" className={styles.mapHotel}>
          Plav Hotel
        </text>
      </g>
    </svg>
  );
}

export function Location() {
  return (
    <section id="location" className={cx(ui.section, styles.location)}>
      <div className={cx(ui.container, styles.locationGrid)}>
        <div>
          <div className={ui.eyebrow} data-reveal="up">
            Getting here
          </div>
          <h2 className={cx(ui.h2, styles.mt18)} data-reveal="up" data-delay="80">
            By the lake in <em className={styles.accent}>eastern Montenegro</em>
          </h2>
          <p className={cx(ui.lead, styles.mt24)} data-reveal="up" data-delay="120">
            Plav lies in the Upper Lim valley, close to the borders with Albania and Kosovo, about 2½ hours by car from
            Podgorica airport.
          </p>
          <dl className={styles.facts} data-reveal="up" data-delay="160">
            {locationFacts.map((fact) => (
              <div key={fact.label} className={styles.fact}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
          <div className={styles.locationActions} data-reveal="up" data-delay="200">
            <a href={site.directionsUrl} target="_blank" rel="noopener noreferrer" className={ui.btnGold}>
              Get directions
            </a>
            <Link href={contactHref({ topic: "reservation" })} className={ui.btnOutline}>
              Arrange a transfer
            </Link>
          </div>
        </div>
        <div className={styles.mapCard} data-reveal="scale">
          <PlavMap />
          <span className={styles.mapNote}>Illustrative · not to scale</span>
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className={styles.final}>
      <svg className={styles.finalRidge} viewBox="0 0 1440 220" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 150 L120 110 L210 128 L320 70 L420 112 L520 84 L640 40 L760 96 L880 62 L1000 104 L1120 56 L1240 98 L1340 76 L1440 104 V220 H0 Z" />
        <path d="M0 184 L140 160 L280 176 L420 148 L560 170 L700 150 L840 174 L980 152 L1120 172 L1260 156 L1440 170 V220 H0 Z" />
      </svg>
      <div className={styles.finalInner}>
        <div className={ui.eyebrowLight} data-reveal="up">
          Your stay awaits
        </div>
        <h2 className={styles.finalTitle} data-reveal="up" data-delay="80">
          The lake is <em>waiting.</em>
        </h2>
        <p className={styles.finalLead} data-reveal="up" data-delay="140">
          Book direct for our best rate — no booking fees, free cancellation up to 48 hours before arrival.
        </p>
        <div className={styles.finalActions} data-reveal="up" data-delay="200">
          <a href="#book" className={ui.btnGold}>
            Check availability
          </a>
          <Link href="/contact" className={ui.btnOutlineLight}>
            Talk to us
          </Link>
        </div>
      </div>
    </section>
  );
}
