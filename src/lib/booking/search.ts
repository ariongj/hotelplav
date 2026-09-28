import "server-only";

import { getAvailabilityProvider } from "./availability";
import { isIsoDate } from "./pricing";
import { searchWithProvider } from "./search-core";
import type { AvailabilityQuery, AvailabilityResult } from "./types";

/** Price every room type for a stay with live (server-side) availability. */
export function searchAvailability(query: AvailabilityQuery): Promise<AvailabilityResult> {
  return searchWithProvider(query, getAvailabilityProvider());
}

export function parseAvailabilityQuery(params: URLSearchParams): AvailabilityQuery | null {
  const checkin = params.get("checkin") ?? "";
  const checkout = params.get("checkout") ?? "";
  const guests = Number(params.get("guests") ?? "2");
  if (!isIsoDate(checkin) || !isIsoDate(checkout) || !Number.isFinite(guests)) return null;
  return { checkin, checkout, guests, promo: params.get("promo") };
}
