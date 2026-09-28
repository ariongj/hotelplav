"use client";

import Link from "next/link";
import { useEffect, useRef, type Ref } from "react";

import { OTA_BREAKFAST_PER_GUEST } from "@/lib/booking/pricing";
import { contactHref } from "@/lib/contact-link";
import { euro, plural, shortDate } from "@/lib/format";

import styles from "./RateResults.module.css";
import { useRoomsBooking, type RatesSuccess } from "./RoomsBooking";
import { scrollBehavior } from "./scroll";

/** "2 nights · 28 Oct – 30 Oct · 2 Adults · 4 rooms available" */
function stayLine({ availability, guestLabel, rows }: RatesSuccess): string {
  return [
    plural(availability.nights, "night"),
    `${shortDate(availability.checkin)} – ${shortDate(availability.checkout)}`,
    guestLabel,
    `${plural(rows.length, "room")} available`,
  ].join(" · ");
}

export function RateResults() {
  const { outcome } = useRoomsBooking();
  const boxRef = useRef<HTMLDivElement>(null);
  const outcomeId = outcome?.id ?? 0;

  // Bring every new result (or error) into view, just below the fixed nav.
  useEffect(() => {
    const box = boxRef.current;
    if (!outcomeId || !box) return;
    const top = box.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: Math.max(0, top), behavior: scrollBehavior() });
  }, [outcomeId]);

  return (
    <section id="rates" className={styles.section}>
      <p className="visually-hidden" role="status">
        {outcome ? (outcome.ok ? stayLine(outcome) : outcome.error) : ""}
      </p>
      {outcome &&
        (outcome.ok ? (
          <RatePanel ref={boxRef} outcome={outcome} />
        ) : (
          <div ref={boxRef} className={styles.error}>
            {outcome.error}
          </div>
        ))}
    </section>
  );
}

function RatePanel({ outcome, ref }: { outcome: RatesSuccess; ref: Ref<HTMLDivElement> }) {
  const { availability, guestLabel, rows } = outcome;
  const { season } = availability;

  return (
    <div ref={ref} className={styles.panel}>
      <div className={styles.head}>
        <div>
          <h2 className={styles.kicker}>Available for your dates</h2>
          <div className={styles.stay}>{stayLine(outcome)}</div>
        </div>
        <div className={styles.season}>
          {season.name} — {season.note}
        </div>
      </div>

      <ul className={styles.rows}>
        {rows.length === 0 && (
          <li className={styles.emptyRow}>
            No rooms match your filters for these dates — adjust the filters or dates, or{" "}
            <Link href={contactHref({ topic: "reservation" })} className={styles.emptyLink}>
              speak with us
            </Link>
            .
          </li>
        )}
        {rows.map(({ room, quote }) => {
          // Rounded first, so the saving always matches the two prices shown.
          const saving = Math.round(quote.ota) - Math.round(quote.direct);
          return (
            <li key={room.id} className={styles.row}>
              <div className={styles.room}>
                <div className={styles.roomName}>{room.name}</div>
                <div className={styles.roomMeta}>
                  {room.size} m² · {room.bedLabel} · {room.view} view · sleeps {room.sleeps}
                </div>
              </div>
              <div className={styles.ota}>
                <div className={styles.otaLabel}>Booking sites</div>
                <div className={styles.otaPrice}>{euro(quote.ota)}</div>
              </div>
              <div className={styles.direct}>
                <div className={styles.directLabel}>Direct</div>
                <div className={styles.directPrice}>{euro(quote.direct)}</div>
                <div className={styles.directNote}>
                  {euro(quote.nightly)} per night · you keep {euro(saving)}
                </div>
              </div>
              <div className={styles.actions}>
                <Link
                  href={contactHref({
                    topic: "reservation",
                    room: room.name,
                    checkin: availability.checkin,
                    checkout: availability.checkout,
                    guests: guestLabel,
                    total: euro(quote.direct),
                  })}
                  className={styles.reserve}
                >
                  Reserve<span className="visually-hidden"> the {room.name}</span>
                </Link>
                <Link href="/tour#room" className={styles.pano}>
                  360&deg;<span className="visually-hidden"> view of the {room.name}</span>
                </Link>
              </div>
            </li>
          );
        })}
      </ul>

      <p className={styles.footnote}>
        Direct rates include breakfast for two, thermal spa access and all taxes. Booking-site totals add breakfast at{" "}
        {euro(OTA_BREAKFAST_PER_GUEST)} per guest, per night.
      </p>
    </div>
  );
}
