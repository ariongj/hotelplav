"use client";

import Link from "next/link";
import { useState } from "react";

import { fetchAvailability, useStayDates } from "@/lib/booking/client";
import { DEFAULT_GUESTS, GUEST_OPTIONS, paxFor } from "@/lib/booking/guests";
import { addDays, checkStay, seasonFor } from "@/lib/booking/pricing";
import { rooms, type RoomId } from "@/lib/booking/rooms";
import type { RoomQuote } from "@/lib/booking/types";
import { contactHref } from "@/lib/contact-link";
import { cx } from "@/lib/cx";
import { submitEnquiry } from "@/lib/enquiry-client";
import { euro, plural } from "@/lib/format";

import styles from "./BookingPanel.module.css";
import { useHomeBooking, useSelectedQuote } from "./HomeBooking";

/** "Reserve your stay": availability search, direct-vs-booking-site rates, rate hold. */
export function BookingPanel() {
  const { checkin, checkout, setCheckin, setCheckout, today } = useStayDates();
  const [guests, setGuests] = useState(DEFAULT_GUESTS);
  const [roomType, setRoomType] = useState<RoomId>("presidential-suite");
  const [promo, setPromo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [held, setHeld] = useState(false);
  /** Guest label the current results were priced for. */
  const [pricedFor, setPricedFor] = useState(DEFAULT_GUESTS);
  const { search, setSearch, selectedId, setSelectedId } = useHomeBooking();
  const selection = useSelectedQuote();

  const seasonChip = checkin ? `${seasonFor(checkin).name} · no booking fees` : "No booking fees";

  function clearResults(message: string) {
    setSearch(null);
    setSelectedId(null);
    setHeld(false);
    setError(message);
  }

  async function onBook() {
    const stay = checkStay(checkin, checkout);
    if (!stay.ok) return clearResults(stay.error);

    setLoading(true);
    const result = await fetchAvailability({ checkin, checkout, guests: paxFor(guests), promo });
    setLoading(false);
    if (!result.ok) return clearResults(result.error);

    const bookable = result.rooms.filter((room) => room.left > 0 && room.fits);
    const keep = bookable.some((room) => room.id === roomType) ? roomType : (bookable[0]?.id ?? null);
    setError("");
    setPricedFor(guests);
    setSearch(result);
    setSelectedId(keep);
    setHeld(false);
  }

  function select(room: RoomQuote) {
    if (room.left === 0 || !room.fits) return;
    setSelectedId(room.id);
    setRoomType(room.id);
    setHeld(false);
  }

  function hold() {
    if (!selection) return;
    const { quote, search: s } = selection;
    setHeld(true);
    // Notify reservations; the guest sees the hold immediately either way.
    void submitEnquiry("stay-hold", {
      room: quote.name,
      checkin: s.checkin,
      checkout: s.checkout,
      nights: s.nights,
      guests: pricedFor,
      total: euro(quote.direct),
      promo: s.promo,
    });
  }

  const available = search ? search.rooms.filter((room) => room.left > 0 && room.fits).length : 0;

  return (
    <div className={styles.card} data-reveal="up">
      <div className={styles.head}>
        <h2 className={styles.title}>Reserve your stay</h2>
        <span className={styles.chips}>
          <span className={styles.chip}>Best rate guaranteed</span>
          <span>{seasonChip}</span>
        </span>
      </div>

      <div className={styles.fields}>
        <label className={styles.field}>
          <span className={styles.label}>Check-in</span>
          <input
            className={styles.input}
            type="date"
            value={checkin}
            min={today || undefined}
            onChange={(e) => setCheckin(e.target.value)}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Check-out</span>
          <input
            className={styles.input}
            type="date"
            value={checkout}
            min={checkin ? addDays(checkin, 1) : today || undefined}
            onChange={(e) => setCheckout(e.target.value)}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Guests</span>
          <select className={styles.input} value={guests} onChange={(e) => setGuests(e.target.value)}>
            {GUEST_OPTIONS.map((option) => (
              <option key={option.label}>{option.label}</option>
            ))}
          </select>
        </label>
        <label className={cx(styles.field, styles.fieldWide)}>
          <span className={styles.label}>Room type</span>
          <select className={styles.input} value={roomType} onChange={(e) => setRoomType(e.target.value as RoomId)}>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>
        </label>
        <label className={cx(styles.field, styles.fieldNarrow)}>
          <span className={styles.label}>Promo code</span>
          <input
            className={styles.input}
            type="text"
            value={promo}
            placeholder="Optional"
            autoComplete="off"
            onChange={(e) => setPromo(e.target.value)}
          />
        </label>
        <button type="button" className={styles.book} onClick={onBook} disabled={loading} aria-busy={loading}>
          Book Now
        </button>
      </div>

      {error && (
        <div className={styles.error} role="alert">
          {error}
        </div>
      )}

      {search && (
        <div className={styles.results} aria-live="polite">
          <div className={styles.resultsHead}>
            <div className={styles.resultsTitle}>
              {available} of {search.rooms.length} room types available · {plural(search.nights, "night")}
            </div>
            <div className={styles.resultsSub}>
              {search.season.name} rate · {pricedFor.toLowerCase()}
              {search.promo && ` · promo ${search.promo} applied`}
            </div>
          </div>

          <div className={styles.rows}>
            {search.rooms.map((room) => {
              const off = room.left === 0 || !room.fits;
              const on = !off && room.id === selectedId;
              const availability = !room.fits
                ? `Sleeps ${room.sleeps} — too small for ${search.guests} guests`
                : room.left === 0
                  ? "Not available on these dates"
                  : room.left === 1
                    ? "Last room at this rate"
                    : `${room.left} rooms left`;
              const action = !room.fits ? "Too small" : room.left === 0 ? "Sold out" : on ? "Selected" : "Select";
              return (
                <div
                  key={room.id}
                  className={cx(styles.row, off && styles.rowOff, on && styles.rowOn)}
                  onClick={() => select(room)}
                >
                  <div className={styles.rowMain}>
                    <div className={styles.rowName}>{room.name}</div>
                    <div className={styles.rowMeta}>{room.summary}</div>
                    <div className={styles.rowLeft}>{availability}</div>
                  </div>
                  <div className={styles.rowPrice}>
                    <div className={styles.rowTotal}>{off ? "—" : euro(room.direct)}</div>
                    {!off && (
                      <>
                        <div className={styles.rowNightly}>{euro(room.nightly)} / night</div>
                        <div className={styles.rowOta}>
                          <span className="visually-hidden">Booking sites: </span>
                          {euro(room.ota)}
                        </div>
                      </>
                    )}
                  </div>
                  <div className={styles.rowAction}>
                    <button
                      type="button"
                      className={cx(styles.select, off && styles.selectOff, on && styles.selectOn)}
                      disabled={off}
                      aria-pressed={on}
                      onClick={(e) => {
                        e.stopPropagation();
                        select(room);
                      }}
                    >
                      {action}
                    </button>
                    {!off && <span className={styles.rowSave}>Save {euro(room.ota - room.direct)} vs booking sites</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {selection && (
            <div className={styles.selection}>
              <div>
                <div className={styles.selLabel}>Your selection</div>
                <div className={styles.selName}>{selection.quote.name}</div>
                <div className={styles.selMeta}>{selection.quote.summary}</div>
              </div>
              <div className={styles.selFigures}>
                <div className={styles.selRow}>
                  <span className={styles.selRowLabel}>Direct total</span>
                  <span className={styles.selTotal}>{euro(selection.quote.direct)}</span>
                </div>
                <div className={cx(styles.selRow, styles.selRowMuted)}>
                  <span>Booking sites</span>
                  <s>{euro(selection.quote.ota)}</s>
                </div>
                <div className={cx(styles.selRow, styles.selRowGold)}>
                  <span>You keep</span>
                  <span>{euro(selection.quote.ota - selection.quote.direct)}</span>
                </div>
              </div>
              <div className={styles.selActions}>
                {held ? (
                  <>
                    <div className={styles.heldMsg} role="status">
                      Held for 30 minutes at {euro(selection.quote.direct)}, guaranteed at or below any booking site.
                      Finish now and the rate is locked.
                    </div>
                    <Link
                      className={styles.selButton}
                      href={contactHref({
                        topic: "reservation",
                        room: selection.quote.name,
                        checkin: selection.search.checkin,
                        checkout: selection.search.checkout,
                        guests: pricedFor,
                        total: euro(selection.quote.direct),
                      })}
                    >
                      Complete reservation
                    </Link>
                  </>
                ) : (
                  <>
                    <button type="button" className={styles.selButton} onClick={hold}>
                      Hold this rate
                    </button>
                    <span className={styles.selTerms}>
                      {selection.search.season.name} · breakfast, thermal spa and taxes included · free cancellation to
                      48h
                    </span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <p className={styles.note}>
        Live rates shown are direct-booking rates including breakfast, thermal spa and taxes.
      </p>
    </div>
  );
}
