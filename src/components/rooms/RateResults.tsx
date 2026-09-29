"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type Ref } from "react";

import { OTA_BREAKFAST_PER_GUEST } from "@/lib/booking/pricing";
import type { RoomId } from "@/lib/booking/rooms";
import { contactHref } from "@/lib/contact-link";
import { euro, plural, shortDate } from "@/lib/format";

import { isFiltered } from "./filters";
import styles from "./RateResults.module.css";
import { useRoomsBooking, type RateRow, type RatesSuccess } from "./RoomsBooking";
import { scrollBehavior } from "./scroll";

/** Rooms left at a rate before the row says so. */
const FEW_LEFT = 2;

/** Rows shown before "Show all": the best (lowest) rates. */
const BEST_RATES = 5;

/** "7 room types available" */
function availableLine(count: number): string {
  return `${plural(count, "room type")} available`;
}

/** "2 nights · 28 Oct – 30 Oct · 2 Adults · 7 room types available" */
function stayLine({ availability, guestLabel }: RatesSuccess, count: number): string {
  return [
    plural(availability.nights, "night"),
    `${shortDate(availability.checkin)} – ${shortDate(availability.checkout)}`,
    guestLabel,
    availableLine(count),
  ].join(" · ");
}

type RateResultsProps = {
  /** The room the tour's 360° room panorama shows — only its row links there. */
  tourRoomId: RoomId;
};

export function RateResults({ tourRoomId }: RateResultsProps) {
  const { outcome, rateRows } = useRoomsBooking();
  const boxRef = useRef<HTMLDivElement>(null);
  const outcomeId = outcome?.id ?? 0;

  // Bring every new result (or error) into view, just below the floating nav.
  // Keyed on the search, so changing the filters updates the panel in place.
  useEffect(() => {
    const box = boxRef.current;
    if (!outcomeId || !box) return;
    const top = box.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: Math.max(0, top), behavior: scrollBehavior() });
  }, [outcomeId]);

  return (
    <section id="rates" className={styles.section}>
      <p className="visually-hidden" role="status">
        {outcome ? (outcome.ok ? stayLine(outcome, rateRows.length) : outcome.error) : ""}
      </p>
      {outcome &&
        (outcome.ok ? (
          // Keyed on the search, so "Show all" starts collapsed for every new one.
          <RatePanel key={outcome.id} ref={boxRef} outcome={outcome} rows={rateRows} tourRoomId={tourRoomId} />
        ) : (
          <div ref={boxRef} className={styles.error}>
            <span className={styles.errorTitle}>We couldn&rsquo;t price that stay</span>
            <span>{outcome.error}</span>
          </div>
        ))}
    </section>
  );
}

type RatePanelProps = {
  outcome: RatesSuccess;
  rows: RateRow[];
  tourRoomId: RoomId;
  ref: Ref<HTMLDivElement>;
};

function RatePanel({ outcome, rows, tourRoomId, ref }: RatePanelProps) {
  const { filters, clearFilters } = useRoomsBooking();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [showAll, setShowAll] = useState(false);
  const { availability, guestLabel } = outcome;
  const { season } = availability;
  const filtered = isFiltered(filters);
  const shown = showAll ? rows : rows.slice(0, BEST_RATES);

  // Both "clear" buttons go away once nothing is filtered; keep focus in the panel.
  const showEveryRoom = () => {
    clearFilters();
    headingRef.current?.focus();
  };

  return (
    <div ref={ref} className={styles.panel}>
      <div className={styles.head}>
        <div>
          <h2 ref={headingRef} tabIndex={-1} className={styles.kicker}>
            Available for your dates
          </h2>
          <p className={styles.dates}>
            {shortDate(availability.checkin)} <span aria-hidden="true">&rarr;</span>
            <span className="visually-hidden"> to </span> {shortDate(availability.checkout)}
          </p>
          <ul className={styles.facts}>
            <li>{plural(availability.nights, "night")}</li>
            <li>{guestLabel}</li>
            <li>{availableLine(rows.length)}</li>
          </ul>
        </div>
        <p className={styles.season}>
          <span className={styles.seasonName}>{season.name}</span>
          <span>{season.note}</span>
        </p>
      </div>

      {/* The rates follow the filters under "Find your room" — say so, with a way out. */}
      {filtered && rows.length > 0 && (
        <p className={styles.filterNote}>
          Showing the room types that match your filters below.{" "}
          <button type="button" className={styles.textButton} onClick={showEveryRoom}>
            Show every room type
          </button>
        </p>
      )}

      <ul className={styles.rows}>
        {rows.length === 0 && (
          <li className={styles.emptyRow}>
            {filtered ? (
              <>
                No room types match your filters for these dates &mdash;{" "}
                <button type="button" className={styles.textButton} onClick={showEveryRoom}>
                  clear the filters
                </button>
                , change your dates, or{" "}
              </>
            ) : (
              <>Nothing is available for these dates and guests &mdash; try other dates, or </>
            )}
            <Link href={contactHref({ topic: "reservation" })} className={styles.emptyLink}>
              speak with us
            </Link>
            .
          </li>
        )}
        {shown.map(({ room, quote }) => {
          // Rounded first, so the saving always matches the two prices shown.
          const saving = Math.round(quote.ota) - Math.round(quote.direct);
          return (
            <li key={room.id} className={styles.row}>
              <div className={styles.room}>
                <h3 className={styles.roomName}>{room.name}</h3>
                <p className={styles.roomMeta}>
                  {room.size} m² · {room.bedLabel} · {room.view} view · sleeps {room.sleeps}
                </p>
                {quote.left <= FEW_LEFT && (
                  <span className={styles.left}>Only {plural(quote.left, "room")} left at this rate</span>
                )}
              </div>

              <div className={styles.compare}>
                <div className={styles.ota}>
                  <span className={styles.priceLabel}>Booking sites</span>
                  <s className={styles.otaPrice}>{euro(quote.ota)}</s>
                </div>
                <div className={styles.direct}>
                  <span className={styles.priceLabel}>Direct with us</span>
                  <strong className={styles.directPrice}>{euro(quote.direct)}</strong>
                  <span className={styles.perNight}>{euro(quote.nightly)} per night</span>
                </div>
                {saving > 0 && <span className={styles.save}>You save {euro(saving)}</span>}
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
                {/* Only one room has a 360° panorama so far; the room cards link the
                    others to it as "a typical room". */}
                {room.id === tourRoomId && (
                  <Link href="/tour#room" className={styles.pano}>
                    360&deg; view<span className="visually-hidden"> of the {room.name}</span>
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {rows.length > BEST_RATES && (
        <p className={styles.more}>
          <span>{showAll ? `All ${rows.length} room types` : `Showing the ${BEST_RATES} best rates`}</span>
          <button
            type="button"
            className={styles.textButton}
            aria-expanded={showAll}
            onClick={() => setShowAll((current) => !current)}
          >
            {showAll ? `Show the ${BEST_RATES} best rates only` : `Show all ${rows.length}`}
          </button>
        </p>
      )}

      <p className={styles.footnote}>
        Direct rates include breakfast for everyone in the room, spa access (pools, sauna and steam room) and all taxes.
        Booking-site totals add breakfast at {euro(OTA_BREAKFAST_PER_GUEST)} per guest, per night.
      </p>
    </div>
  );
}
