import type { Season } from "./pricing";
import type { RoomId, RoomType } from "./rooms";

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

/**
 * Where live inventory comes from. The site ships with a deterministic mock
 * (mock-availability.ts); connect the hotel's PMS / channel manager by
 * implementing this and returning it from getAvailabilityProvider().
 */
export interface AvailabilityProvider {
  /** Rooms still bookable per room type for the stay (0 = sold out). */
  roomsLeft(
    stay: { checkin: string; checkout: string; guests: number },
    roomTypes: readonly RoomType[],
  ): Promise<Map<RoomId, number>>;
}
