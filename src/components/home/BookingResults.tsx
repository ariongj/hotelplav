"use client";

import Link from "next/link";

import { Photo } from "@/components/ui/Photo";
import { PhotoCredit } from "@/components/ui/PhotoCredit";
import { getRoom } from "@/lib/booking/rooms";
import type { RoomQuote } from "@/lib/booking/types";
import { contactHref } from "@/lib/contact-link";
import { cx } from "@/lib/cx";
import { euro, plural, shortDate } from "@/lib/format";
import ui from "@/styles/ui.module.css";

import styles from "./BookingResults.module.css";
import { useHomeBooking } from "./HomeBooking";

function availabilityText(room: RoomQuote, guests: number): string {
  if (!room.fits) return `Sleeps ${room.sleeps} — too small for ${guests} guests`;
  if (room.left === 0) return "Not available on these dates";
  if (room.left === 1) return "Last room at this rate";
  return `${room.left} left at this rate`;
}

/** Priced rooms for the searched stay, with a summary to hold and complete the booking. */
export function BookingResults() {
  const { search, searchedPromo, selectedId, select, selection, held, holdError, hold, pricedFor } =
    useHomeBooking();

  if (!search) return null;

  const available = search.rooms.filter((room) => room.left > 0 && room.fits).length;

  return (
    <section id="results" className={styles.results} aria-labelledby="results-title">
      <div className={styles.inner}>
        <header className={styles.head}>
          <div>
            <div className={ui.eyebrow}>Your stay</div>
            {/* Focused after a search (tabIndex -1) so keyboard users continue from the results. */}
            <h2 id="results-title" className={styles.title} tabIndex={-1}>
              {shortDate(search.checkin)} <span aria-hidden="true">→</span>
              <span className="visually-hidden"> to </span> {shortDate(search.checkout)}
            </h2>
          </div>
          <p className={styles.meta}>
            {plural(search.nights, "night")} · {pricedFor.toLowerCase()} · {search.season.name.toLowerCase()} rates
            {search.promo
              ? ` · promo ${search.promo} applied`
              : searchedPromo && ` · promo code “${searchedPromo}” not recognised`}
            <br />
            <strong>{plural(available, "room type")} available</strong>
          </p>
          <a href="#book" className={styles.edit}>
            Change dates
          </a>
        </header>

        <div className={styles.layout}>
          <ul className={styles.list}>
            {search.rooms.map((room) => {
              const off = room.left === 0 || !room.fits;
              const on = !off && room.id === selectedId;
              const image = getRoom(room.id).image;
              return (
                <li key={room.id} className={cx(styles.room, off && styles.off, on && styles.on)}>
                  <div className={styles.photo}>
                    {/* Decorative: the room's name is right beside it. */}
                    <Photo src={image.src} alt="" position={image.position} sizes="(max-width: 700px) 40vw, 220px" />
                  </div>
                  <div>
                    <h3 className={styles.name}>{room.name}</h3>
                    <p className={styles.roomSummary}>{room.summary}</p>
                    <p className={cx(styles.left, room.left === 1 && !off && styles.leftUrgent)}>
                      {availabilityText(room, search.guests)}
                    </p>
                    <PhotoCredit credit={image.credit} tone="dark" className={styles.credit} />
                  </div>
                  <div className={styles.price}>
                    {off ? (
                      <span className={styles.total}>—</span>
                    ) : (
                      <>
                        <span className={styles.total}>{euro(room.direct)}</span>
                        <span className={styles.nightly}>{euro(room.nightly)} / night</span>
                        <span className={styles.ota}>
                          <span className="visually-hidden">Booking sites: </span>
                          <s>{euro(room.ota)}</s> elsewhere
                        </span>
                      </>
                    )}
                    {/* No aria-label: the visible text leads the accessible name; aria-pressed carries the state. */}
                    <button
                      type="button"
                      className={cx(styles.select, on && styles.selectOn)}
                      disabled={off}
                      aria-pressed={on}
                      onClick={() => select(room)}
                    >
                      {!room.fits ? "Too small" : room.left === 0 ? "Sold out" : on ? "Selected" : "Select"}
                      {on && <span aria-hidden="true"> ✓</span>}
                      <span className="visually-hidden"> — {room.name}</span>
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <aside className={styles.summary} aria-label="Your selection">
            {selection ? (
              <>
                <div className={styles.sumLabel}>Your selection</div>
                <div className={styles.sumName}>{selection.quote.name}</div>
                <div className={styles.sumMeta}>
                  {shortDate(selection.search.checkin)} – {shortDate(selection.search.checkout)} ·{" "}
                  {plural(selection.search.nights, "night")} · {pricedFor.toLowerCase()}
                </div>
                <dl className={styles.figures}>
                  <div>
                    <dt>Direct total</dt>
                    <dd className={styles.sumTotal}>{euro(selection.quote.direct)}</dd>
                  </div>
                  <div className={styles.muted}>
                    <dt>Booking sites</dt>
                    <dd>
                      <s>{euro(selection.quote.ota)}</s>
                    </dd>
                  </div>
                  <div className={styles.keep}>
                    <dt>You keep</dt>
                    <dd>{euro(selection.quote.ota - selection.quote.direct)}</dd>
                  </div>
                </dl>
                {held ? (
                  <>
                    <p className={styles.held} role="status">
                      Rate noted: {euro(selection.quote.direct)} for these dates. Add your details and our team will confirm your reservation.
                    </p>
                    <Link
                      className={cx(ui.btnGold, styles.sumButton)}
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
                    {holdError && (
                      <p className={styles.holdError} role="alert">
                        {holdError}
                      </p>
                    )}
                    <button type="button" className={cx(ui.btnGold, styles.sumButton)} onClick={() => void hold()}>
                      Request this rate
                    </button>
                  </>
                )}
                <p className={styles.terms}>
                  Breakfast for everyone in the room, spa access and taxes included · free cancellation up to 48 h
                  before arrival.
                </p>
              </>
            ) : (
              <>
                <div className={styles.sumLabel}>Nothing fits these dates</div>
                <p className={styles.terms}>
                  Try other dates or fewer guests — or write to us and reservations will find you a room.
                </p>
                <Link className={cx(ui.btnOutlineLight, styles.sumButton)} href={contactHref({ topic: "reservation" })}>
                  Ask reservations
                </Link>
              </>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
