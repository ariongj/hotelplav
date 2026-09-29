"use client";

import { useId, useState, type FormEvent } from "react";

import { useHydrated } from "@/lib/booking/client";
import { isIsoDate, localTodayIso } from "@/lib/booking/pricing";
import { cx } from "@/lib/cx";
import { isEmailOrPhone, submitEnquiry } from "@/lib/enquiry-client";
import ui from "@/styles/ui.module.css";

import {
  DEFAULT_PARTY_SIZE,
  DEFAULT_RESERVATION_TIME,
  LAKE_ROOM,
  PARTY_SIZES,
  RESERVATION_SLOTS,
  TABLE_OPTIONS,
  TABLE_PHRASES,
  TERRACE_MONTHS,
} from "./content";
import styles from "./TableReservation.module.css";

type Field = "date" | "table" | "contact";

type Notice = { kind: "done" | "invalid" | "failed"; text: string; field?: Field };

const DATE_ERROR = "Choose a date from today onwards and our maître d’ will confirm your table.";
const TERRACE_ERROR = "The lake terrace is open from May to October — choose another table, or a date in season.";
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

/** Table request card (#reserve), frosted and pulled up over the bottom of the hero. */
export function TableReservation() {
  const hydrated = useHydrated();
  const titleId = useId();
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
    const table = TABLE_OPTIONS.find((option) => option === value("table")) ?? TABLE_OPTIONS[0];
    const contact = value("contact").trim();

    const invalid = (field: Field, text: string) => {
      setNotice({ kind: "invalid", text, field });
      const control = form.elements.namedItem(field);
      if (control instanceof HTMLInputElement || control instanceof HTMLSelectElement) control.focus();
    };
    if (!isIsoDate(date) || date < localTodayIso()) return invalid("date", DATE_ERROR);
    if (table === "Terrace" && !TERRACE_MONTHS.includes(Number(date.slice(5, 7)))) {
      return invalid("table", TERRACE_ERROR);
    }
    if (!isEmailOrPhone(contact)) return invalid("contact", CONTACT_ERROR);

    setSending(true);
    setNotice(null);
    const res = await submitEnquiry("table", {
      date,
      time,
      party,
      restaurant: LAKE_ROOM,
      table,
      contact,
      company: value("company"),
    });
    setSending(false);

    if (!res.ok) {
      setNotice({ kind: "failed", text: res.error });
      return;
    }
    setNotice({
      kind: "done",
      text: `${TABLE_PHRASES[table]} for ${party.toLowerCase()} at ${LAKE_ROOM}, ${longDate(date)} at ${time}. ${res.preview ? "This is a preview site, so nothing was sent — on the live site our maître d’ confirms by email or phone." : "Our maître d’ will confirm your reservation shortly."}`,
    });
  }

  const invalidField = notice?.kind === "invalid" ? notice.field : undefined;
  const dateInvalid = invalidField === "date";
  const tableInvalid = invalidField === "table";
  const contactInvalid = invalidField === "contact";

  return (
    <section id="reserve" className={styles.section}>
      <form className={styles.card} onSubmit={onSubmit} noValidate aria-labelledby={titleId}>
        <div className={styles.head}>
          <div>
            <h2 id={titleId} className={styles.title}>
              Reserve a <em>table</em>
            </h2>
            <p className={styles.sub}>
              Lunch or dinner at {LAKE_ROOM} — our maître d&rsquo; confirms every request personally.
            </p>
          </div>
          <a href="#hours" className={styles.headLink}>
            Opening hours <span aria-hidden="true">&rarr;</span>
          </a>
        </div>

        <div className={styles.fields}>
          <label className={styles.field}>
            <span className={ui.label}>Date</span>
            <input
              className={styles.control}
              type="date"
              name="date"
              // Set after hydration so a statically rendered page never bakes in a stale day.
              min={hydrated ? localTodayIso() : undefined}
              required
              aria-invalid={dateInvalid || undefined}
              aria-describedby={dateInvalid ? noticeId : undefined}
            />
          </label>
          <label className={styles.field}>
            <span className={ui.label}>Time</span>
            <select className={styles.control} name="time" defaultValue={DEFAULT_RESERVATION_TIME}>
              {RESERVATION_SLOTS.map((slot) => (
                <optgroup key={slot.service} label={slot.service}>
                  {slot.times.map((time) => (
                    <option key={time}>{time}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
          <label className={styles.field}>
            <span className={ui.label}>Party</span>
            <select className={styles.control} name="party" defaultValue={DEFAULT_PARTY_SIZE}>
              {PARTY_SIZES.map((size) => (
                <option key={size}>{size}</option>
              ))}
            </select>
          </label>
          <label className={styles.field}>
            <span className={ui.label}>Table</span>
            <select
              className={styles.control}
              name="table"
              defaultValue={TABLE_OPTIONS[0]}
              aria-invalid={tableInvalid || undefined}
              aria-describedby={tableInvalid ? noticeId : undefined}
            >
              {TABLE_OPTIONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className={cx(styles.field, styles.contact)}>
            <span className={ui.label}>Email or phone</span>
            <input
              className={styles.control}
              type="text"
              name="contact"
              autoComplete="email"
              placeholder="So we can confirm"
              required
              aria-invalid={contactInvalid || undefined}
              aria-describedby={contactInvalid ? noticeId : undefined}
            />
          </label>
          <button type="submit" className={cx(ui.btnGold, styles.submit)} disabled={sending}>
            {sending ? "Sending…" : "Reserve a table"}
          </button>
        </div>

        <input type="text" name="company" tabIndex={-1} autoComplete="off" className="visually-hidden" aria-hidden="true" />

        <div role="status">
          {notice && (
            <p id={noticeId} className={styles.note} data-kind={notice.kind}>
              <span className={styles.noteIcon} aria-hidden="true">
                {notice.kind === "done" ? "✓" : "!"}
              </span>
              <span>{notice.text}</span>
            </p>
          )}
        </div>
      </form>
    </section>
  );
}
