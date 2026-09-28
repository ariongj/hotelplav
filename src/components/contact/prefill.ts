import { isIsoDate, nightsBetween } from "@/lib/booking/pricing";
import type { ContactPrefill } from "@/lib/contact-link";
import { plural, shortDate } from "@/lib/format";

/** " from 28 Oct to 30 Oct 2026 (2 nights)" — empty when the dates are unusable. */
function stayDates(checkin = "", checkout = ""): string {
  const hasIn = isIsoDate(checkin);
  const hasOut = isIsoDate(checkout);
  const year = (iso: string) => iso.slice(0, 4);

  if (hasIn && hasOut) {
    const nights = nightsBetween(checkin, checkout);
    if (nights > 0) {
      const sameYear = year(checkin) === year(checkout);
      const from = sameYear ? shortDate(checkin) : `${shortDate(checkin)} ${year(checkin)}`;
      return ` from ${from} to ${shortDate(checkout)} ${year(checkout)} (${plural(nights, "night")})`;
    }
  }
  if (hasIn) return ` from ${shortDate(checkin)} ${year(checkin)}`;
  return "";
}

/**
 * Opening line for the message when the visitor arrives from a held rate,
 * e.g. "I’d like to reserve the Presidential Suite from 28 Oct to 30 Oct 2026
 * (2 nights) for 2 Adults — direct rate €1,564." Parts that are missing are
 * left out; returns "" when there is nothing to say.
 */
export function prefillMessage({ room, checkin, checkout, guests, total }: ContactPrefill): string {
  const dates = stayDates(checkin, checkout);
  if (!room && !dates && !guests && !total) return "";

  const what = room ? ` the ${room.replace(/^the\s+/i, "")}` : " a stay";
  const who = guests ? ` for ${guests}` : "";
  const rate = total ? ` — direct rate ${total}` : "";
  return `I’d like to reserve${what}${dates}${who}${rate}.`;
}
