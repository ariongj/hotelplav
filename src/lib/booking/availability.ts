import "server-only";

import type { RoomId, RoomType } from "./rooms";

/**
 * Where live inventory comes from. The site ships with a deterministic mock;
 * connect the hotel's PMS / channel manager (Cloudbeds, SiteMinder,
 * HotelRunner, Opera or Mews) by implementing this interface and returning
 * it from getAvailabilityProvider(). Keep API credentials in server-side
 * environment variables — this module never runs in the browser.
 */
export interface AvailabilityProvider {
  /** Rooms still bookable per room type for the stay (0 = sold out). */
  roomsLeft(
    stay: { checkin: string; checkout: string; guests: number },
    roomTypes: readonly RoomType[],
  ): Promise<Map<RoomId, number>>;
}

/**
 * Prototype inventory: a hash of room name + check-in date → 0–4 rooms, so
 * the same dates always show the same availability.
 */
export const mockAvailability: AvailabilityProvider = {
  async roomsLeft(stay, roomTypes) {
    const left = new Map<RoomId, number>();
    for (const room of roomTypes) {
      const key = `${room.name}|${stay.checkin}`;
      let hash = 0;
      for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) % 100003;
      const r = hash % 7;
      left.set(room.id, r === 0 ? 0 : Math.min(4, r));
    }
    return left;
  },
};

export function getAvailabilityProvider(): AvailabilityProvider {
  // e.g. if (process.env.MEWS_ACCESS_TOKEN) return createMewsProvider(...)
  return mockAvailability;
}
