import "server-only";

import { getAvailabilityProvider } from "./availability";
import { checkStay, isIsoDate, normalisePromo, quoteStay, seasonFor, STAY_ERRORS } from "./pricing";
import { rooms } from "./rooms";
import type { AvailabilityQuery, AvailabilityResult, RoomQuote } from "./types";

/** Price every room type for a stay and attach live availability. */
export async function searchAvailability(query: AvailabilityQuery): Promise<AvailabilityResult> {
  const stay = checkStay(query.checkin, query.checkout);
  if (!stay.ok) return stay;

  // Allow a day of slack for visitors in time zones behind the server.
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  if (query.checkin < yesterday) return { ok: false, error: STAY_ERRORS.past };

  const guests = Math.min(12, Math.max(1, Math.round(query.guests) || 1));
  const season = seasonFor(query.checkin);
  const promo = normalisePromo(query.promo);
  const left = await getAvailabilityProvider().roomsLeft(
    { checkin: query.checkin, checkout: query.checkout, guests },
    rooms,
  );

  const quotes: RoomQuote[] = rooms.map((room) => ({
    id: room.id,
    name: room.name,
    summary: room.summary,
    sleeps: room.sleeps,
    left: left.get(room.id) ?? 0,
    fits: room.sleeps >= guests,
    ...quoteStay({ baseRate: room.baseRate, nights: stay.nights, guests, season, promo }),
  }));

  return {
    ok: true,
    checkin: query.checkin,
    checkout: query.checkout,
    nights: stay.nights,
    guests,
    season,
    promo,
    rooms: quotes,
  };
}

export function parseAvailabilityQuery(params: URLSearchParams): AvailabilityQuery | null {
  const checkin = params.get("checkin") ?? "";
  const checkout = params.get("checkout") ?? "";
  const guests = Number(params.get("guests") ?? "2");
  if (!isIsoDate(checkin) || !isIsoDate(checkout) || !Number.isFinite(guests)) return null;
  return { checkin, checkout, guests, promo: params.get("promo") };
}
