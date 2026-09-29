"use client";

import { StickyBar } from "@/components/layout/StickyBar";
import { useHydrated } from "@/lib/booking/client";
import { nightsBetween, seasonFor } from "@/lib/booking/pricing";
import { lowestBaseRate, lowestFromRate } from "@/lib/booking/rooms";
import { euro, plural } from "@/lib/format";

import { useRoomsBooking } from "./RoomsBooking";
import styles from "./RoomsStickyBar.module.css";

export function RoomsStickyBar() {
  const { visibleRooms, checkin, checkout, loading, searchFromStickyBar } = useRoomsBooking();
  // The season depends on the visitor's dates, which only exist after hydration.
  const season = useHydrated() ? seasonFor(checkin) : null;
  const stayNights = nightsBetween(checkin, checkout);
  const nights = stayNights > 0 ? stayNights : 2;
  const cheapest = visibleRooms.length ? Math.min(...visibleRooms.map((room) => room.baseRate)) : lowestBaseRate;

  return (
    <StickyBar layout="split">
      <div className={styles.text}>
        {season ? (
          <>
            <div className={styles.rate}>
              From <em>{euro(cheapest * season.multiplier)} / night</em>
            </div>
            <div className={styles.dates}>
              {plural(nights, "night")} · {season.name} · best rate guaranteed
            </div>
          </>
        ) : (
          <>
            <div className={styles.rate}>
              Rooms from <em>{euro(lowestFromRate)} / night</em>
            </div>
            <div className={styles.dates}>Best rate guaranteed &mdash; direct only</div>
          </>
        )}
      </div>
      <button type="button" className={styles.button} aria-busy={loading} onClick={searchFromStickyBar}>
        Check availability
      </button>
    </StickyBar>
  );
}
