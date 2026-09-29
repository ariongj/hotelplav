"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

import { submitEnquiry } from "@/lib/enquiry-client";

import styles from "./SiteFooter.module.css";

export function NewsletterForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");
  /** The static preview has nowhere to send the sign-up (see lib/enquiry-client). */
  const [preview, setPreview] = useState(false);
  const doneRef = useRef<HTMLParagraphElement>(null);

  // The form (and its focused button) is replaced by the thank-you line; move
  // focus there so keyboard and screen-reader users aren't dropped to <body>.
  useEffect(() => {
    if (status === "done") doneRef.current?.focus();
  }, [status]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setError("");
    const res = await submitEnquiry("newsletter", {
      email: String(data.get("email") ?? ""),
      company: String(data.get("company") ?? ""),
    });
    if (res.ok) {
      setPreview(Boolean(res.preview));
      setStatus("done");
      form.reset();
    } else {
      setStatus("idle");
      setError(res.error);
    }
  }

  if (status === "done") {
    return (
      <p ref={doneRef} tabIndex={-1} className={styles.newsletterDone} role="status">
        {preview
          ? "This is a preview site, so nothing was sent. On the live site, this adds you to the list."
          : "Thank you — you’re on the list."}
      </p>
    );
  }

  return (
    <form className={styles.newsletter} onSubmit={onSubmit}>
      <label className="visually-hidden" htmlFor="newsletter-email">
        Email address
      </label>
      <input
        id="newsletter-email"
        className={styles.newsletterInput}
        type="email"
        name="email"
        placeholder="Email address"
        autoComplete="email"
        required
      />
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="visually-hidden" aria-hidden="true" />
      <button type="submit" className={styles.newsletterButton} disabled={status === "sending"}>
        Join
      </button>
      {error && (
        <p className={styles.newsletterError} role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
