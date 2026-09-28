/**
 * Deep links into the contact form, pre-filled with an enquiry — e.g. the
 * "Complete reservation" button after a rate is held. Until the PMS checkout
 * is connected, reservations are completed by the reservations team from
 * this enquiry.
 */

export type ContactTopic = "reservation" | "events" | "spa" | "press" | "other";

/** Options of the contact form's topic select, keyed by URL value. */
export const CONTACT_TOPICS: Record<ContactTopic, string> = {
  reservation: "Reservation enquiry",
  events: "Events & weddings",
  spa: "Spa & wellness",
  press: "Press & partnerships",
  other: "Something else",
};

export type ContactPrefill = {
  topic?: ContactTopic;
  /** Room or item name, e.g. "Presidential Suite". */
  room?: string;
  /** ISO dates. */
  checkin?: string;
  checkout?: string;
  /** Guest label, e.g. "2 Adults". */
  guests?: string;
  /** Quoted direct total, e.g. "€1,564". */
  total?: string;
};

const KEYS = ["topic", "room", "checkin", "checkout", "guests", "total"] as const;

export function contactHref(prefill: ContactPrefill = {}): string {
  const params = new URLSearchParams();
  for (const key of KEYS) {
    const value = prefill[key];
    if (value) params.set(key, value);
  }
  const query = params.toString();
  return query ? `/contact?${query}` : "/contact";
}

export function parseContactPrefill(params: URLSearchParams): ContactPrefill {
  const topic = params.get("topic");
  const text = (key: string) => params.get(key)?.slice(0, 120) || undefined;
  return {
    topic: topic && topic in CONTACT_TOPICS ? (topic as ContactTopic) : undefined,
    room: text("room"),
    checkin: text("checkin"),
    checkout: text("checkout"),
    guests: text("guests"),
    total: text("total"),
  };
}
