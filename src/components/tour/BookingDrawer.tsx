import Link from "next/link";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";

import { MAX_ONLINE_NIGHTS, quoteStay, seasonFor, type Season } from "@/lib/booking/pricing";
import { contactHref } from "@/lib/contact-link";
import { cx } from "@/lib/cx";
import { submitEnquiry } from "@/lib/enquiry-client";
import { euro } from "@/lib/format";

import styles from "./BookingDrawer.module.css";
import type { TourOffer } from "./content";

export const DEFAULT_NIGHTS = 2;
const MIN_NIGHTS = 1;
/** Same limit as the booking engine: longer stays are arranged personally. */
const MAX_NIGHTS = MAX_ONLINE_NIGHTS;
/** The in-tour quote is for two guests (booking-site breakfast is per guest). */
const GUESTS = 2;

/**
 * Direct price, and for stays the booking-site price it beats. Flat items
 * (a ceremony) aren't sold on booking sites, so they get no comparison.
 */
function quote(offer: TourOffer, nights: number, season: Season): { direct: number; ota: number | null } {
  if (offer.flat) return { direct: offer.rate * season.multiplier, ota: null };
  const { direct, ota } = quoteStay({ baseRate: offer.rate, nights, guests: GUESTS, season });
  return { direct, ota };
}

const nightsLabel = (nights: number) => `${nights} ${nights === 1 ? "night" : "nights"}`;

type BookingDrawerProps = {
  offer: TourOffer;
  /** Scene the request is made from, sent with the enquiry. */
  scene: string;
  nights: number;
  onNights: (nights: number) => void;
  onClose: () => void;
};

/**
 * "Book from inside the room": the direct rate (vs booking sites for a stay),
 * sent to the team as a rate request, over the panorama. The quote uses the
 * current season — the visitor's dates, added on the contact form, set the
 * final price. Rendered inside the viewer so it also shows in fullscreen.
 */
export function BookingDrawer({ offer, scene, nights, onNights, onClose }: BookingDrawerProps) {
  const [season] = useState(() => seasonFor());
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const doneRef = useRef<HTMLParagraphElement>(null);
  const kickerId = useId();
  const titleId = useId();
  const nightsId = useId();

  const { direct, ota } = quote(offer, nights, season);
  const total = euro(direct);
  const team = offer.topic === "events" ? "events" : "reservations";

  // Focus the first control on open. On close, hand focus back to the hotspot
  // that opened the drawer — unless the visitor has already moved on.
  useLayoutEffect(() => {
    const opener = document.activeElement;
    const panel = panelRef.current;
    closeRef.current?.focus();
    return () => {
      if (!panel?.contains(document.activeElement)) return;
      if (opener instanceof HTMLElement && opener !== document.body && opener.isConnected) {
        opener.focus({ preventScroll: true });
      }
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // The panel sits inside the viewer: keep presses, double-clicks and wheel
  // zoom on it from steering the panorama underneath.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const stop = (e: Event) => e.stopPropagation();
    panel.addEventListener("pointerdown", stop);
    panel.addEventListener("dblclick", stop);
    panel.addEventListener("wheel", stop, { passive: true });
    return () => {
      panel.removeEventListener("pointerdown", stop);
      panel.removeEventListener("dblclick", stop);
      panel.removeEventListener("wheel", stop);
    };
  }, []);

  // Read the confirmation out by moving focus to it.
  useEffect(() => {
    if (status === "done") doneRef.current?.focus();
  }, [status]);

  async function hold() {
    setStatus("sending");
    setError("");
    const res = await submitEnquiry("stay-hold", {
      item: offer.name,
      nights: offer.flat ? null : nights,
      total,
      season: season.name,
      scene,
    });
    if (res.ok) {
      setStatus("done");
    } else {
      setStatus("idle");
      setError(res.error);
    }
  }

  return (
    <div className={styles.layer}>
      <div ref={panelRef} className={styles.panel} role="dialog" aria-labelledby={`${kickerId} ${titleId}`}>
        <div className={styles.head}>
          <div>
            <div id={kickerId} className={styles.kicker}>
              Book from inside the tour
            </div>
            <h2 id={titleId} className={styles.name}>
              {offer.name}
            </h2>
          </div>
          <button ref={closeRef} type="button" className={styles.close} aria-label="Close" onClick={onClose}>
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {status === "done" ? (
          <>
            <p ref={doneRef} className={styles.done} tabIndex={-1}>
              <span className={styles.doneIcon} aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 14 14">
                  <path d="M2.5 7.5 5.5 10.5 11.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </span>
              <span>
                Rate noted: {total}
                {offer.flat ? "" : ` for ${nightsLabel(nights)}`}. Add your dates and email on the next page and our{" "}
                {team} team will confirm.
              </span>
            </p>
            <Link
              href={contactHref({
                topic: offer.topic,
                room: offer.flat ? offer.name : `${offer.name} · ${nightsLabel(nights)}`,
                total,
              })}
              className={styles.confirm}
            >
              Complete reservation
            </Link>
          </>
        ) : (
          <>
            <p className={styles.meta}>{offer.meta}</p>
            {!offer.flat && (
              <div className={styles.nights} role="group" aria-labelledby={nightsId}>
                <span id={nightsId} className={styles.nightsLabel}>
                  Nights
                </span>
                <div className={styles.stepper}>
                  <button
                    type="button"
                    className={styles.step}
                    aria-label="Fewer nights"
                    onClick={() => onNights(Math.max(MIN_NIGHTS, nights - 1))}
                  >
                    &minus;
                  </button>
                  <span className={styles.count} aria-live="polite" aria-atomic="true">
                    {nights}
                    <span className="visually-hidden"> {nights === 1 ? "night" : "nights"}</span>
                  </span>
                  <button
                    type="button"
                    className={styles.step}
                    aria-label="More nights"
                    onClick={() => onNights(Math.min(MAX_NIGHTS, nights + 1))}
                  >
                    +
                  </button>
                </div>
              </div>
            )}
            <div className={styles.price}>
              <div className={styles.total}>
                <span className={styles.totalLabel}>{offer.flat ? "Total" : "Direct total"}</span>
                <span className={styles.totalValue}>{total}</span>
              </div>
              {ota !== null && (
                <>
                  <div className={styles.row}>
                    <span>Booking sites</span>
                    <s>{euro(ota)}</s>
                  </div>
                  <div className={cx(styles.row, styles.keep)}>
                    <span>You keep</span>
                    <span className={styles.saving}>{euro(ota - direct)}</span>
                  </div>
                </>
              )}
            </div>
            <button
              type="button"
              className={styles.confirm}
              disabled={status === "sending"}
              onClick={() => void hold()}
            >
              {status === "sending" ? "Sending…" : "Request this rate"}
            </button>
            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}
            <p className={styles.note}>
              {offer.flat
                ? `${season.name} rate — your date sets the final price. No obligation until our events team confirms.`
                : `${season.name} rate — your dates set the final price. Breakfast and spa included, free cancellation to 48 h.`}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
