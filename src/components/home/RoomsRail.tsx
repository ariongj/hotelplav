"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Photo } from "@/components/ui/Photo";
import { PhotoCredit } from "@/components/ui/PhotoCredit";
import { fromRate } from "@/lib/booking/pricing";
import { rooms } from "@/lib/booking/rooms";
import { euro } from "@/lib/format";

import styles from "./sections.module.css";

const ordered = [...rooms].sort((a, b) => a.rank - b.rank);

/** Swipeable row of room cards, with arrow buttons for mouse users. */
export function RoomsRail() {
  const railRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const update = () =>
      setEdges({
        start: rail.scrollLeft < 8,
        end: rail.scrollLeft + rail.clientWidth > rail.scrollWidth - 8,
      });
    update();
    rail.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      rail.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  function step(direction: 1 | -1) {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector("li");
    const distance = card ? card.getBoundingClientRect().width + 20 : rail.clientWidth * 0.8;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rail.scrollBy({ left: direction * distance, behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <div className={styles.rail}>
      <ul ref={railRef} className={styles.railTrack} aria-label="Rooms and suites">
        {ordered.map((room) => (
          <li key={room.id} className={styles.railItem}>
            {/* Named by its heading alone; the photo is decorative beside it. */}
            <Link href="/rooms" className={styles.roomCard} aria-labelledby={`rail-${room.id}`}>
              <div className={styles.roomPhoto}>
                <Photo
                  src={room.image.src}
                  alt=""
                  position={room.image.position}
                  sizes="(max-width: 700px) 80vw, 360px"
                />
                <span className={styles.roomPrice}>
                  from <strong>{euro(fromRate(room.baseRate))}</strong> / night
                </span>
                {room.badge && <span className={styles.roomBadge}>{room.badge.label}</span>}
              </div>
              <div className={styles.roomBody}>
                <span className={styles.roomCategory}>{room.category.replace(/s$/, "")}</span>
                <h3 id={`rail-${room.id}`} className={styles.roomName}>
                  {room.name}
                </h3>
                <p className={styles.roomSummary}>{room.summary}</p>
              </div>
            </Link>
            {/* Outside the card: the credit is a link of its own. */}
            <PhotoCredit credit={room.image.credit} tone="dark" className={styles.railCredit} />
          </li>
        ))}
      </ul>
      <div className={styles.railNav}>
        <button
          type="button"
          className={styles.railButton}
          onClick={() => step(-1)}
          disabled={edges.start}
          aria-label="Previous rooms"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path d="M11 3.5 5.5 9l5.5 5.5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          </svg>
        </button>
        <button
          type="button"
          className={styles.railButton}
          onClick={() => step(1)}
          disabled={edges.end}
          aria-label="More rooms"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path d="M7 3.5 12.5 9 7 14.5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
