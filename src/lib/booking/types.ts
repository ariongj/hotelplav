import type { RoomId } from "./rooms";
import type { Season } from "./pricing";

/** One room type priced for the requested stay. Amounts are unrounded EUR. */
export type RoomQuote = {
  id: RoomId;
  name: string;
  summary: string;
  sleeps: number;
  /** Rooms left at this rate — 0 means sold out for these dates. */
  left: number;
  /** False when the room sleeps fewer than the requested guests. */
  fits: boolean;
  nightly: number;
  direct: number;
  ota: number;
};

export type AvailabilityQuery = {
  checkin: string;
  checkout: string;
  guests: number;
  promo?: string | null;
};

export type AvailabilityResult =
  | {
      ok: true;
      checkin: string;
      checkout: string;
      nights: number;
      guests: number;
      season: Season;
      /** Normalised promo code when one was accepted. */
      promo: string | null;
      rooms: RoomQuote[];
    }
  | { ok: false; error: string };
