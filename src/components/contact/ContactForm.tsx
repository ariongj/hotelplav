"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useId, useRef, useState, type FormEvent } from "react";

import { site } from "@/config/site";
import { CONTACT_TOPICS, parseContactPrefill, type ContactPrefill, type ContactTopic } from "@/lib/contact-link";
import { submitEnquiry } from "@/lib/enquiry-client";
import { cx } from "@/lib/cx";
import ui from "@/styles/ui.module.css";

import styles from "./ContactForm.module.css";
import { prefillMessage, staySummary } from "./prefill";

const TOPICS = Object.entries(CONTACT_TOPICS) as [ContactTopic, string][];

/** How the confirmation names what was sent: "your spa enquiry is with our team". */
const SENT_AS: Record<ContactTopic, string> = {
  reservation: "reservation enquiry",
  dining: "dining enquiry",
  events: "events enquiry",
  spa: "spa enquiry",
  press: "press enquiry",
  other: "message",
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactFormProps = {
  /** Enquiry passed in the URL, e.g. from "Reserve" after a rate is shown. */
  prefill?: ContactPrefill;
};

/** "Write to us" form. Rendered empty as the Suspense fallback, then pre-filled from the URL. */
export function ContactForm({ prefill = {} }: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<ContactTopic>(prefill.topic ?? "reservation");
  const [message, setMessage] = useState(() => prefillMessage(prefill));
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<{ text: string; field?: "email" } | null>(null);
  const [sentMsg, setSentMsg] = useState("");
  /** The static preview has nowhere to send the form — the confirmation says so. */
  const [previewOnly, setPreviewOnly] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  /** Set by "Write another message" so the fresh form's message box takes focus. */
  const refocusMessage = useRef(false);
  const errorId = useId();
  const stay = staySummary(prefill);

  // Stable callback refs: they run once when their element mounts.
  const focusOnMount = useCallback((el: HTMLElement | null) => el?.focus(), []);
  const messageRef = useCallback((el: HTMLTextAreaElement | null) => {
    if (el && refocusMessage.current) {
      refocusMessage.current = false;
      el.focus();
    }
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSentMsg("");
    const address = email.trim();
    if (!EMAIL.test(address)) {
      setError({
        text: address ? "Please enter a valid email address." : "Please enter your email address so we can reply.",
        field: "email",
      });
      emailRef.current?.focus();
      return;
    }

    const honeypot = new FormData(event.currentTarget).get("company");
    const topicLabel = CONTACT_TOPICS[topic];
    setSending(true);
    setError(null);
    const res = await submitEnquiry("contact", {
      name: name.trim(),
      email: address,
      topic: topicLabel,
      message: message.trim(),
      company: typeof honeypot === "string" ? honeypot : "",
      room: prefill.room,
      checkin: prefill.checkin,
      checkout: prefill.checkout,
      guests: prefill.guests,
      total: prefill.total,
    });
    setSending(false);

    if (!res.ok) {
      setError({ text: res.error });
      return;
    }
    setPreviewOnly(Boolean(res.preview));
    if (res.preview) {
      setSentMsg(
        `This is a preview site, so nothing was sent. On the live site your ${SENT_AS[topic]} goes straight to our front desk.`,
      );
      return;
    }
    const first = name.trim().split(/\s+/)[0];
    const thanks = first ? `Thank you, ${first}` : "Thank you";
    setSentMsg(`${thanks} — your ${SENT_AS[topic]} is with our team. Expect a reply within one working day.`);
  }

  function writeAnother() {
    refocusMessage.current = true;
    setMessage("");
    setSentMsg("");
  }

  const emailInvalid = error?.field === "email";

  return (
    <>
      {!sentMsg && (
        <form className={styles.form} onSubmit={onSubmit} noValidate>
          {stay.length > 0 && (
            <div className={styles.stay}>
              <span className={ui.label}>Your stay</span>
              <ul className={styles.stayChips}>
                {stay.map((part) => (
                  <li key={part}>{part}</li>
                ))}
              </ul>
            </div>
          )}

          <fieldset className={styles.topics}>
            <legend className={cx(ui.label, styles.legend)}>What&rsquo;s it about?</legend>
            <div className={styles.topicChips}>
              {TOPICS.map(([value, label]) => (
                <label key={value} className={styles.topic}>
                  <input
                    type="radio"
                    name="topic"
                    value={value}
                    className={styles.topicInput}
                    checked={topic === value}
                    onChange={() => setTopic(value)}
                  />
                  <span className={styles.topicPill}>{label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className={styles.row}>
            <label className={styles.field}>
              <span className={ui.label}>Your name</span>
              <input
                className={styles.input}
                type="text"
                name="name"
                autoComplete="name"
                placeholder="First and last name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <div className={styles.fieldWrap}>
              <label className={styles.field}>
                <span className={ui.label}>Email</span>
                <input
                  ref={emailRef}
                  className={styles.input}
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                  aria-invalid={emailInvalid || undefined}
                  aria-describedby={emailInvalid ? errorId : undefined}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              {emailInvalid && (
                <p id={errorId} className={styles.fieldError} role="alert">
                  {error.text}
                </p>
              )}
            </div>
          </div>

          <label className={styles.field}>
            <span className={ui.label}>Message</span>
            <textarea
              ref={messageRef}
              className={styles.textarea}
              name="message"
              rows={5}
              placeholder="Dates, how many of you, the occasion — whatever helps us help you."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </label>

          {/* Spam trap: hidden from people, filled in by bots. */}
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            className="visually-hidden"
            aria-hidden="true"
          />

          <div className={styles.submitRow}>
            <button type="submit" className={cx(ui.btnGold, styles.submit)} disabled={sending}>
              {sending ? "Sending…" : "Send message"}
            </button>
            <p className={styles.alt}>
              Prefer to talk?{" "}
              <a href={site.phone.href} className={styles.altLink}>
                Call {site.phone.display}
              </a>
            </p>
          </div>

          {error && !emailInvalid && (
            <p className={styles.formError} role="alert">
              {error.text}
            </p>
          )}
        </form>
      )}

      <div role="status">
        {sentMsg && (
          <div className={styles.sent}>
            {!previewOnly && <span className={styles.sentMark} aria-hidden="true" />}
            <h3 ref={focusOnMount} tabIndex={-1} className={styles.sentTitle}>
              {previewOnly ? "Preview only — not sent" : "Message sent"}
            </h3>
            <p className={styles.sentText}>{sentMsg}</p>
            <button type="button" className={cx(ui.btnOutline, styles.again)} onClick={writeAnother}>
              Write another message
            </button>
          </div>
        )}
      </div>
    </>
  );
}

/** Reads the enquiry from the query string (see contactHref) and starts the form from it. */
export function ContactFormFromUrl() {
  const params = useSearchParams();
  // A new query (e.g. following another enquiry link) starts a fresh form.
  return <ContactForm key={params.toString()} prefill={parseContactPrefill(params)} />;
}
