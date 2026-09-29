"use client";

import type { FormEvent } from "react";

import { GUEST_OPTIONS } from "@/lib/booking/guests";
import { addDays } from "@/lib/booking/pricing";
import { plural, shortDate } from "@/lib/format";

import styles from "./HeroBooking.module.css";
import { useHomeBooking } from "./HomeBooking";

/** The frosted search bar at the foot of the hero (the page's #book target). */
export function HeroBooking() {
  const b = useHomeBooking();
  const available = b.search ? b.search.rooms.filter((room) => room.left > 0 && room.fits).length : 0;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // aria-disabled rather than disabled, so the button keeps focus while it checks.
    if (b.loading) return;
    if (await b.runSearch()) {
      // Wait a frame for the results to render, then bring them into view and move focus there.
      window.setTimeout(() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        document.getElementById("results")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        document.getElementById("results-title")?.focus({ preventScroll: true });
      }, 80);
    }
  }

  return (
    <div className={styles.wrap}>
      <form id="book" className={styles.bar} onSubmit={onSubmit} aria-label="Check availability" noValidate>
        <label className={styles.field}>
          <span className={styles.label}>Check in</span>
          <input
            className={styles.input}
            type="date"
            value={b.checkin}
            min={b.today || undefined}
            onChange={(e) => b.setCheckin(e.target.value)}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Check out</span>
          <input
            className={styles.input}
            type="date"
            value={b.checkout}
            min={b.checkin ? addDays(b.checkin, 1) : b.today || undefined}
            onChange={(e) => b.setCheckout(e.target.value)}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Guests</span>
          <select className={styles.input} value={b.guests} onChange={(e) => b.setGuests(e.target.value)}>
            {GUEST_OPTIONS.map((option) => (
              <option key={option.label}>{option.label}</option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Promo code</span>
          <input
            className={styles.input}
            type="text"
            value={b.promo}
            placeholder="Optional"
            autoComplete="off"
            onChange={(e) => b.setPromo(e.target.value)}
          />
        </label>
        <button type="submit" className={styles.submit} aria-disabled={b.loading} aria-busy={b.loading}>
          {b.loading ? "Checking…" : "Check availability"}
        </button>
      </form>
      {/* Always rendered, so screen readers announce each new result. */}
      <p className="visually-hidden" role="status" aria-live="polite">
        {b.search
          ? `${plural(available, "room type")} available, ${shortDate(b.search.checkin)} to ${shortDate(b.search.checkout)}.` +
            (!b.search.promo && b.searchedPromo ? " Promo code not recognised." : "")
          : ""}
      </p>
      {b.error ? (
        <p className={styles.error} role="alert">
          {b.error}
        </p>
      ) : (
        <p className={styles.perks}>
          <span>Best rate guaranteed</span>
          <span>No booking fees</span>
          <span>Free cancellation up to 48 h</span>
        </p>
      )}
    </div>
  );
}
