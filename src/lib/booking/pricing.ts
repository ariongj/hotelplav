/**
 * Direct-booking pricing rules (design/README.md › Booking engine).
 * Pure functions — safe to use on the server and in the browser.
 */

export type SeasonKey = "peak" | "shoulder" | "quiet";

export type Season = {
  key: SeasonKey;
  name: string;
  multiplier: number;
  /** Short note shown next to the season on the rooms page. */
  note: string;
};

const SEASONS: Record<SeasonKey, Season> = {
  peak: { key: "peak", name: "Peak season", multiplier: 1.15, note: "peak rates apply" },
  shoulder: { key: "shoulder", name: "Shoulder season", multiplier: 1, note: "13% below peak" },
  quiet: { key: "quiet", name: "Quiet season", multiplier: 0.86, note: "25% below peak" },
};

/** Lowest seasonal multiplier: "from €X" labels use it, so a real quote never undercuts them. */
export const LOWEST_SEASON_MULTIPLIER = Math.min(...Object.values(SEASONS).map((season) => season.multiplier));

/** The lowest nightly rate a room is ever quoted at (quiet season, no promo), for "from €X" labels. */
export function fromRate(baseRate: number): number {
  return Math.round(baseRate * LOWEST_SEASON_MULTIPLIER);
}

const PEAK_MONTHS = [7, 8, 12, 1];
const QUIET_MONTHS = [4, 11];

/** Season for a calendar month (1–12). */
export function seasonForMonth(month: number): Season {
  if (PEAK_MONTHS.includes(month)) return SEASONS.peak;
  if (QUIET_MONTHS.includes(month)) return SEASONS.quiet;
  return SEASONS.shoulder;
}

/** Season by check-in month; falls back to the current month. */
export function seasonFor(checkinIso?: string): Season {
  const month = checkinIso ? Number(checkinIso.slice(5, 7)) : new Date().getMonth() + 1;
  return seasonForMonth(month || new Date().getMonth() + 1);
}

/** Promo codes (case-insensitive) and the multiplier they apply. */
const PROMO_CODES: Record<string, number> = {
  DIRECT5: 0.95,
};

export function normalisePromo(code: string | null | undefined): string | null {
  const key = (code ?? "").trim().toUpperCase();
  return key in PROMO_CODES ? key : null;
}

export function promoMultiplier(code: string | null | undefined): number {
  const key = normalisePromo(code);
  return key ? PROMO_CODES[key] : 1;
}

/** Booking sites keep ~18% commission, so their public rate is nightly / 0.82. */
export const OTA_RATE_FACTOR = 0.82;
/** Booking-site rates exclude breakfast, charged per guest per night. */
export const OTA_BREAKFAST_PER_GUEST = 28;

export type StayQuote = {
  /** Direct nightly rate after season and promo. */
  nightly: number;
  /** Direct total for the stay. */
  direct: number;
  /** What the same stay costs through a booking site. */
  ota: number;
};

export function quoteStay(input: {
  baseRate: number;
  nights: number;
  guests: number;
  season: Season;
  promo?: string | null;
}): StayQuote {
  const nightly = input.baseRate * input.season.multiplier * promoMultiplier(input.promo);
  const direct = nightly * input.nights;
  const ota = (nightly / OTA_RATE_FACTOR) * input.nights + OTA_BREAKFAST_PER_GUEST * input.guests * input.nights;
  return { nightly, direct, ota };
}

/* ------------------------------------------------------------------ dates */

export const MAX_ONLINE_NIGHTS = 21;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function isIsoDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const date = new Date(value + "T00:00:00Z");
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

/** Whole nights between two ISO dates (negative if checkout is first). */
export function nightsBetween(checkin: string, checkout: string): number {
  const a = Date.parse(checkin + "T00:00:00Z");
  const b = Date.parse(checkout + "T00:00:00Z");
  if (Number.isNaN(a) || Number.isNaN(b)) return 0;
  return Math.round((b - a) / 86_400_000);
}

/** ISO date `days` after `iso`. */
export function addDays(iso: string, days: number): string {
  const date = new Date(iso + "T00:00:00Z");
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** Today's date in the visitor's time zone, as ISO. */
export function localTodayIso(now = new Date()): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
}

export const STAY_ERRORS = {
  order: "Choose a check-out date after your check-in and we will price the stay directly — always at or below any booking site.",
  tooLong: `Stays beyond ${MAX_ONLINE_NIGHTS} nights are arranged personally — our reservations team will build the rate with you.`,
  past: "Choose a check-in date from today onwards and we will price the stay directly.",
} as const;

export type StayCheck = { ok: true; nights: number } | { ok: false; error: string };

export function checkStay(checkin: string, checkout: string): StayCheck {
  if (!isIsoDate(checkin) || !isIsoDate(checkout)) return { ok: false, error: STAY_ERRORS.order };
  const nights = nightsBetween(checkin, checkout);
  if (!(nights > 0)) return { ok: false, error: STAY_ERRORS.order };
  if (nights > MAX_ONLINE_NIGHTS) return { ok: false, error: STAY_ERRORS.tooLong };
  return { ok: true, nights };
}
