"use client";

import { useId, useState, type FormEvent } from "react";

import { useHydrated } from "@/lib/booking/client";
import { isIsoDate, localTodayIso } from "@/lib/booking/pricing";
import { cx } from "@/lib/cx";
import { isEmailOrPhone, submitEnquiry } from "@/lib/enquiry-client";
import ui from "@/styles/ui.module.css";

import { BOOKABLE_TREATMENTS, DEFAULT_SPA_TIME, SPA_GUESTS, SPA_TIMES } from "./content";
import styles from "./TreatmentBooking.module.css";

type Notice = { kind: "done" | "invalid" | "failed"; text: string; field?: "date" | "contact" };

const DATE_ERROR = "Choose a date from today onwards and our spa team will confirm your appointment.";
const CONTACT_ERROR = "Leave an email or phone number so our spa team can confirm your appointment.";

/** "Monday 12 October" from an ISO date, independent of the visitor's time zone. */
function longDate(iso: string): string {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
}

/** Treatment request bar (#book) that overlaps the bottom of the hero. */
export function TreatmentBooking() {
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
    const treatment = value("treatment");
    const guests = value("guests");
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
    const res = await submitEnquiry("spa", {
      date,
      time,
      treatment,
      guests,
      contact,
      company: value("company"),
    });
    setSending(false);

    if (!res.ok) {
      setNotice({ kind: "failed", text: res.error });
      return;
    }
    const forTwo = guests === "2 Guests" ? " for two" : "";
    setNotice({
      kind: "done",
      text: `Your ${treatment}, ${longDate(date)} at ${time}${forTwo}, is requested. Our spa team will confirm your appointment shortly.`,
    });
  }

  const dateInvalid = notice?.kind === "invalid" && notice.field === "date";
  const contactInvalid = notice?.kind === "invalid" && notice.field === "contact";

  return (
    <section id="book" className={styles.section}>
      <form className={styles.bar} onSubmit={onSubmit} noValidate aria-label="Book a treatment">
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
            <select className={styles.select} name="time" defaultValue={DEFAULT_SPA_TIME}>
              {SPA_TIMES.map((time) => (
                <option key={time}>{time}</option>
              ))}
            </select>
          </label>
          <label className={cx(styles.field, styles.treatment)}>
            <span className={ui.label}>Treatment</span>
            <select className={styles.select} name="treatment" defaultValue={BOOKABLE_TREATMENTS[0]}>
              {BOOKABLE_TREATMENTS.map((treatment) => (
                <option key={treatment}>{treatment}</option>
              ))}
            </select>
          </label>
          <label className={cx(styles.field, styles.guests)}>
            <span className={ui.label}>Guests</span>
            <select className={styles.select} name="guests" defaultValue={SPA_GUESTS[0]}>
              {SPA_GUESTS.map((guests) => (
                <option key={guests}>{guests}</option>
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
            Book a treatment
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
