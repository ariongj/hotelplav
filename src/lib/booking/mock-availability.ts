import type { RoomId } from "./rooms";
import type { AvailabilityProvider } from "./types";

/** Most rooms of one type the mock ever offers at a rate. */
const MAX_LEFT = 4;

/**
 * Prototype inventory: a hash of room name + check-in date → 0–4 rooms, never
 * more than the hotel has of that type (the single chalet or Presidential
 * Suite is 0 or 1), so the same dates always show the same availability.
 * Safe to run in the browser (the static GitHub Pages preview uses it
 * directly).
 */
export const mockAvailability: AvailabilityProvider = {
  async roomsLeft(stay, roomTypes) {
    const left = new Map<RoomId, number>();
    for (const room of roomTypes) {
      const key = `${room.name}|${stay.checkin}`;
      let hash = 0;
      for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) % 100003;
      const r = hash % 7;
      left.set(room.id, r === 0 ? 0 : Math.min(MAX_LEFT, room.count, r));
    }
    return left;
  },
};
