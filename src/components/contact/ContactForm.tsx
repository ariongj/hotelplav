"use client";

import { useSearchParams } from "next/navigation";
import { useId, useRef, useState, type FormEvent } from "react";

import { CONTACT_TOPICS, parseContactPrefill, type ContactPrefill, type ContactTopic } from "@/lib/contact-link";
import { submitEnquiry } from "@/lib/enquiry-client";
import ui from "@/styles/ui.module.css";

import styles from "./ContactForm.module.css";
import { prefillMessage } from "./prefill";

const TOPICS = Object.entries(CONTACT_TOPICS) as [ContactTopic, string][];

/** How the confirmation names what was sent: "your spa enquiry is with our team". */
const SENT_AS: Record<ContactTopic, string> = {
  reservation: "reservation enquiry",
  events: "events enquiry",
  spa: "spa enquiry",
  press: "press enquiry",
  other: "message",
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactFormProps = {
  /** Enquiry passed in the URL, e.g. from "Complete reservation" after a rate is held. */
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
  const emailRef = useRef<HTMLInputElement>(null);
  const errorId = useId();

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
    const who = name.trim().split(/\s+/)[0] || "there";
    setSentMsg(
      `Thank you, ${who} — your ${SENT_AS[topic]} is with our team. Expect a reply within one working day.`,
    );
  }

  const emailInvalid = error?.field === "email";

  return (
    <>
      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <div className={styles.row}>
          <label className={styles.field}>
            <span className={ui.label}>Name</span>
            <input
              className={styles.input}
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
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
        </div>

        <label className={styles.field}>
          <span className={ui.label}>Topic</span>
          <select
            className={styles.select}
            name="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value as ContactTopic)}
          >
            {TOPICS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span className={ui.label}>Message</span>
          <textarea
            className={styles.textarea}
            name="message"
            rows={5}
            placeholder="Dates, party size, the occasion — whatever helps us help you."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>

        {/* Spam trap: hidden from people, filled in by bots. */}
        <input type="text" name="company" tabIndex={-1} autoComplete="off" className="visually-hidden" aria-hidden="true" />

        <button type="submit" className={styles.submit} disabled={sending}>
          Send message
        </button>
      </form>

      {error && (
        <p id={errorId} className={styles.message} role="alert">
          {error.text}
        </p>
      )}
      <div role="status">{sentMsg && <p className={styles.message}>{sentMsg}</p>}</div>
    </>
  );
}

/** Reads the enquiry from the query string (see contactHref) and starts the form from it. */
export function ContactFormFromUrl() {
  const params = useSearchParams();
  // A new query (e.g. following another enquiry link) starts a fresh form.
  return <ContactForm key={params.toString()} prefill={parseContactPrefill(params)} />;
}
