"use client";

import { useId, useState, type FormEvent } from "react";

import { useHydrated } from "@/lib/booking/client";
import { isIsoDate, localTodayIso } from "@/lib/booking/pricing";
import { cx } from "@/lib/cx";
import { isEmailOrPhone, submitEnquiry } from "@/lib/enquiry-client";
import ui from "@/styles/ui.module.css";

import {
  ANY_RESTAURANT,
  DEFAULT_PARTY_SIZE,
  DEFAULT_RESERVATION_TIME,
  PARTY_SIZES,
  RESERVATION_TIMES,
  RESTAURANT_OPTIONS,
} from "./content";
import styles from "./TableReservation.module.css";

type Notice = { kind: "done" | "invalid" | "failed"; text: string; field?: "date" | "contact" };

const DATE_ERROR = "Choose a date from today onwards and our maître d’ will confirm your table.";
const CONTACT_ERROR = "Leave an email or phone number so our maître d’ can confirm your table.";

/** "Monday 12 October" from an ISO date, independent of the visitor's time zone. */
function longDate(iso: string): string {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
}

/** Table request bar (#reserve) that overlaps the bottom of the hero. */
export function TableReservation() {
  const hydrated = useHydrated();
  const noticeId = useId();
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const value = (name: string) => String(data.get(name) ?? "");
    const date = value("date");
    const time = value("time");
    const party = value("party");
    const restaurant = value("restaurant");
    const contact = value("contact").trim();

    const invalid = (field: "date" | "contact", text: string) => {
      setNotice({ kind: "invalid", text, field });
      const input = form.elements.namedItem(field);
      if (input instanceof HTMLInputElement) input.focus();
    };
    if (!isIsoDate(date) || date < localTodayIso()) return invalid("date", DATE_ERROR);
    if (!isEmailOrPhone(contact)) return invalid("contact", CONTACT_ERROR);

    setSending(true);
    setNotice(null);
    const res = await submitEnquiry("table", {
      date,
      time,
      party,
      restaurant,
      contact,
      company: value("company"),
    });
    setSending(false);

    if (!res.ok) {
      setNotice({ kind: "failed", text: res.error });
      return;
    }
    const where = restaurant === ANY_RESTAURANT ? "Brezovica" : restaurant;
    setNotice({
      kind: "done",
      text: `A table for ${party.toLowerCase()} at ${where}, ${longDate(date)} at ${time}. Our maître d’ will confirm your reservation shortly.`,
    });
  }

  const dateInvalid = notice?.kind === "invalid" && notice.field === "date";
  const contactInvalid = notice?.kind === "invalid" && notice.field === "contact";

  return (
    <section id="reserve" className={styles.section}>
      <form className={styles.bar} onSubmit={onSubmit} noValidate aria-label="Reserve a table">
        <div className={styles.fields}>
          <label className={cx(styles.field, styles.date)}>
            <span className={ui.label}>Date</span>
            <input
              className={styles.input}
              type="date"
              name="date"
              // Set after hydration so a statically rendered page never bakes in a stale day.
              min={hydrated ? localTodayIso() : undefined}
              required
              aria-invalid={dateInvalid || undefined}
              aria-describedby={dateInvalid ? noticeId : undefined}
            />
          </label>
          <label className={cx(styles.field, styles.time)}>
            <span className={ui.label}>Time</span>
            <select className={styles.select} name="time" defaultValue={DEFAULT_RESERVATION_TIME}>
              {RESERVATION_TIMES.map((time) => (
                <option key={time}>{time}</option>
              ))}
            </select>
          </label>
          <label className={cx(styles.field, styles.party)}>
            <span className={ui.label}>Party</span>
            <select className={styles.select} name="party" defaultValue={DEFAULT_PARTY_SIZE}>
              {PARTY_SIZES.map((size) => (
                <option key={size}>{size}</option>
              ))}
            </select>
          </label>
          <label className={cx(styles.field, styles.restaurant)}>
            <span className={ui.label}>Restaurant</span>
            <select className={styles.select} name="restaurant" defaultValue={ANY_RESTAURANT}>
              {RESTAURANT_OPTIONS.map((restaurant) => (
                <option key={restaurant}>{restaurant}</option>
              ))}
            </select>
          </label>
          <label className={cx(styles.field, styles.contact)}>
            <span className={ui.label}>Email or phone</span>
            <input
              className={styles.input}
              type="text"
              name="contact"
              autoComplete="email"
              placeholder="So we can confirm"
              required
              aria-invalid={contactInvalid || undefined}
              aria-describedby={contactInvalid ? noticeId : undefined}
            />
          </label>
          <button type="submit" className={styles.submit} disabled={sending}>
            Reserve a table
          </button>
        </div>

        <input type="text" name="company" tabIndex={-1} autoComplete="off" className="visually-hidden" aria-hidden="true" />

        <div role="status">
          {notice && (
            <p id={noticeId} className={styles.note}>
              {notice.text}
            </p>
          )}
        </div>
      </form>
    </section>
  );
}
