"use client";

import { GUEST_OPTIONS } from "@/lib/booking/guests";
import ui from "@/styles/ui.module.css";

import styles from "./AvailabilityBar.module.css";
import { useRoomsBooking } from "./RoomsBooking";

export function AvailabilityBar() {
  const { checkin, checkout, today, setCheckin, setCheckout, guests, setGuests, search, loading } = useRoomsBooking();

  return (
    <section id="book" className={styles.section}>
      {/* Dates are validated by the availability API; its message shows in the rates panel. */}
      <form
        className={styles.bar}
        role="search"
        aria-label="Room availability"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          search();
        }}
      >
        <label className={styles.field}>
          <span className={ui.label}>Check-in</span>
          <input
            type="date"
            name="checkin"
            className={styles.input}
            value={checkin}
            min={today || undefined}
            onChange={(event) => setCheckin(event.target.value)}
          />
        </label>
        <label className={styles.field}>
          <span className={ui.label}>Check-out</span>
          <input
            type="date"
            name="checkout"
            className={styles.input}
            value={checkout}
            min={today || undefined}
            onChange={(event) => setCheckout(event.target.value)}
          />
        </label>
        <label className={styles.field}>
          <span className={ui.label}>Guests</span>
          <select
            name="guests"
            className={styles.select}
            value={guests}
            onChange={(event) => setGuests(event.target.value)}
          >
            {GUEST_OPTIONS.map((option) => (
              <option key={option.label} value={option.label}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className={styles.submit} aria-busy={loading}>
          Check availability
        </button>
        <div className={styles.note}>
          <span className={styles.chip}>Best rate guaranteed</span>
          <span className={styles.noteText}>
            Lower public rate elsewhere? We match it and take a further five percent off.
          </span>
        </div>
      </form>
    </section>
  );
}
