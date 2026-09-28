import Link from "next/link";

import { Photo } from "@/components/ui/Photo";
import type { RoomType } from "@/lib/booking/rooms";
import { cx } from "@/lib/cx";
import { euro, plural } from "@/lib/format";
import ui from "@/styles/ui.module.css";

import styles from "./RoomCard.module.css";

/* One column below ~850px, two up to ~1290px, then three across 1280px. */
const PHOTO_SIZES = "(max-width: 850px) 100vw, (max-width: 1290px) 50vw, 420px";

export function RoomCard({ room }: { room: RoomType }) {
  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <Photo src={room.image.src} alt={room.image.alt} sizes={PHOTO_SIZES} />
        {room.badge && (
          <span className={cx(styles.badge, room.badge.tone === "gold" ? styles.badgeGold : styles.badgeDark)}>
            {room.badge.label}
          </span>
        )}
        <Link
          href="/tour#room"
          className={styles.pano}
          title="Stand inside this room in 360°"
          aria-label={`360° view — ${room.name}`}
        >
          360&deg; VIEW
        </Link>
        {/* Gallery counter from the design; there is no gallery viewer yet. */}
        <span className={styles.counter} aria-hidden="true">
          1 / {room.photoCount}
        </span>
      </div>

      <div className={styles.body}>
        <div className={styles.titleRow}>
          <h3 className={styles.name}>{room.name}</h3>
          <span className={styles.from}>
            from <strong className={styles.fromPrice}>{euro(room.baseRate)}</strong>
          </span>
        </div>
        <p className={styles.meta}>
          {room.size} m² · {plural(room.sleeps, "guest")} · {room.bedLabel} · {room.view} view
        </p>
        <p className={styles.description}>{room.description}</p>
        <ul className={styles.highlights}>
          {room.highlights.map((item) => (
            <li key={item} className={styles.highlight}>
              {item}
            </li>
          ))}
        </ul>
        <div className={styles.actions}>
          <a href="#book" className={styles.book}>
            Book<span className="visually-hidden"> the {room.name}</span>
          </a>
          <a href="#book" className={cx(ui.linkUnderline, styles.details)}>
            View details<span className="visually-hidden"> of the {room.name}</span>
          </a>
        </div>
      </div>
    </article>
  );
}
