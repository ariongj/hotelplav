"use client";

import { Fragment, type ReactNode } from "react";

import styles from "./RoomGrid.module.css";
import { useRoomsBooking } from "./RoomsBooking";

type RoomGridProps = {
  /** A server-rendered <RoomCard/> per room, keyed by room id. The grid only picks and orders them. */
  cards: Readonly<Record<string, ReactNode>>;
};

export function RoomGrid({ cards }: RoomGridProps) {
  const { visibleRooms, clearFilters } = useRoomsBooking();

  return (
    <div className={styles.grid}>
      {visibleRooms.map((room) => (
        <Fragment key={room.id}>{cards[room.id]}</Fragment>
      ))}
      {visibleRooms.length === 0 && (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>No stays match those filters</p>
          <p className={styles.emptyText}>Try a different room type, a higher nightly rate or fewer amenities.</p>
          <button type="button" className={styles.emptyButton} onClick={clearFilters}>
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
