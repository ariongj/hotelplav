import Link from "next/link";

import { Photo } from "@/components/ui/Photo";
import { PhotoCredit } from "@/components/ui/PhotoCredit";
import { fromRate } from "@/lib/booking/pricing";
import type { RoomType } from "@/lib/booking/rooms";
import { cx } from "@/lib/cx";
import { euro } from "@/lib/format";

import styles from "./RoomCard.module.css";

/* One column below ~790px, two up to ~1190px, then three across 1280px. */
const PHOTO_SIZES = "(max-width: 790px) 100vw, (max-width: 1190px) 50vw, 420px";

type RoomCardProps = {
  room: RoomType;
  /** This is the room the tour's 360° panorama shows (the others link to it as "a typical room"). */
  inTour: boolean;
};

export function RoomCard({ room, inTour }: RoomCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <Photo src={room.image.src} alt={room.image.alt} position={room.image.position} sizes={PHOTO_SIZES} />
        {room.badge && (
          <span className={cx(styles.badge, room.badge.tone === "gold" ? styles.badgeGold : styles.badgeDark)}>
            {room.badge.label}
          </span>
        )}
        {inTour && (
          <Link href="/tour#room" className={styles.pano} title="Stand inside this room in 360°">
            360&deg;<span className="visually-hidden"> view of the {room.name}</span>
          </Link>
        )}
        {room.image.credit && <PhotoCredit credit={room.image.credit} className={styles.credit} />}
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>{room.name}</h3>
        <ul className={styles.facts} aria-label="Key facts">
          <li>{room.size} m²</li>
          <li>Sleeps {room.sleeps}</li>
          <li>{room.bedLabel}</li>
          <li>{room.view} view</li>
        </ul>
        <p className={styles.description}>{room.description}</p>

        <div className={styles.footer}>
          <p className={styles.price}>
            <span className={styles.from}>from</span>{" "}
            <strong className={styles.amount}>{euro(fromRate(room.baseRate))}</strong>{" "}
            <span className={styles.from}>/ night</span>
          </p>
          <div className={styles.actions}>
            {/* Native disclosure: works without JavaScript and announces its state.
                The open panel lays itself over the photo. */}
            <details className={styles.more}>
              <summary className={styles.moreToggle}>
                <span className={styles.whenClosed}>Details</span>
                <span className={styles.whenOpen}>Close</span>
                <span className="visually-hidden"> — {room.name}</span>
              </summary>
              <div className={styles.moreBody}>
                <p className={styles.moreTitle}>In the room</p>
                <ul className={styles.highlights}>
                  {room.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className={styles.moreNote}>Book direct and breakfast, spa access and all taxes are included.</p>
                <Link href="/tour#room" className={styles.moreLink}>
                  {inTour ? (
                    <>
                      Step inside in 360&deg;<span className="visually-hidden"> — {room.name}</span>
                    </>
                  ) : (
                    "See a typical room in 360°"
                  )}
                </Link>
              </div>
            </details>
            <a href="#book" className={styles.book}>
              Book<span className="visually-hidden"> the {room.name}</span>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
