"use client";

import { useId } from "react";

import { GUEST_OPTIONS } from "@/lib/booking/guests";
import { addDays, isIsoDate } from "@/lib/booking/pricing";
import { cx } from "@/lib/cx";
import ui from "@/styles/ui.module.css";

import styles from "./AvailabilityBar.module.css";
import { DIRECT_PERKS } from "./content";
import { useRoomsBooking } from "./RoomsBooking";

/** Frosted booking card pulled up over the bottom of the hero. */
export function AvailabilityBar() {
  const { checkin, checkout, today, setCheckin, setCheckout, guests, setGuests, search, loading } = useRoomsBooking();
  const headingId = useId();

  return (
    <section id="book" className={styles.section} aria-labelledby={headingId}>
      <div className={styles.card} data-reveal="up">
        <div className={styles.head}>
          <h2 id={headingId} className={styles.title}>
            Plan your stay
          </h2>
          <ul className={styles.perks} aria-label="Included when you book direct">
            {DIRECT_PERKS.map((perk) => (
              <li key={perk} className={styles.perk}>
                {perk}
              </li>
            ))}
          </ul>
        </div>

        {/* Dates are validated by the availability API; its message shows in the rates panel. */}
        <form
          className={styles.form}
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
              onChange={(event) => {
                const value = event.target.value;
                setCheckin(value);
                // Keep check-out after check-in: move it on to the next morning if needed.
                if (isIsoDate(value) && checkout && checkout <= value) setCheckout(addDays(value, 1));
              }}
            />
          </label>
          <label className={styles.field}>
            <span className={ui.label}>Check-out</span>
            <input
              type="date"
              name="checkout"
              className={styles.input}
              value={checkout}
              min={isIsoDate(checkin) ? addDays(checkin, 1) : today || undefined}
              onChange={(event) => setCheckout(event.target.value)}
            />
          </label>
          <label className={cx(styles.field, styles.guests)}>
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
            {loading ? "Checking…" : "Check availability"}
          </button>
        </form>

        <p className={styles.note}>
          <span className={styles.badge}>Best rate guaranteed</span>
          <span>Found a lower public rate elsewhere? We&rsquo;ll match it and take off another 5%.</span>
        </p>
      </div>
    </section>
  );
}
