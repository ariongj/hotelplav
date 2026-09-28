import type { RoomId } from "./rooms";
import type { AvailabilityProvider } from "./types";

/**
 * Prototype inventory: a hash of room name + check-in date → 0–4 rooms, so
 * the same dates always show the same availability. Safe to run in the
 * browser (the static GitHub Pages preview uses it directly).
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
