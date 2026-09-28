"use client";

import { useState, type FormEvent } from "react";

import { submitEnquiry } from "@/lib/enquiry-client";

import styles from "./SiteFooter.module.css";

export function NewsletterForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

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
      setStatus("done");
      form.reset();
    } else {
      setStatus("idle");
      setError(res.error);
    }
  }

  if (status === "done") {
    return (
      <p className={styles.newsletterDone} role="status">
        Thank you — you&rsquo;re on the list.
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
