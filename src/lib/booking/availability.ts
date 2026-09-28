import "server-only";

import { mockAvailability } from "./mock-availability";
import type { AvailabilityProvider } from "./types";

export type { AvailabilityProvider } from "./types";

/**
 * The inventory source used by /api/availability. Swap the mock for the
 * hotel's PMS or channel manager (Cloudbeds, SiteMinder, HotelRunner, Opera
 * or Mews) here — keep its API credentials in server-side environment
 * variables; this module never runs in the browser.
 */
export function getAvailabilityProvider(): AvailabilityProvider {
  // e.g. if (process.env.MEWS_ACCESS_TOKEN) return createMewsProvider(...)
  return mockAvailability;
}
