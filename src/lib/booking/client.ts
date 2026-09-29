"use client";

import { useCallback, useState, useSyncExternalStore } from "react";

import { addDays, isIsoDate, localTodayIso } from "./pricing";
import type { AvailabilityQuery, AvailabilityResult } from "./types";

/** True for the static export (GitHub Pages preview), which has no server API. */
const STATIC_EXPORT = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";

const UNREACHABLE =
  "We couldn't reach our reservations system just now — please try again, or call us and we'll price your stay.";

/**
 * Rates and availability for a stay: /api/availability on a server
 * deployment, or the same pricing and mock inventory computed in the browser
 * on the static preview. Never throws — failures come back as { ok: false }.
 */
export async function fetchAvailability(query: AvailabilityQuery): Promise<AvailabilityResult> {
  if (STATIC_EXPORT) {
    // The search code loads on demand; the chunk can fail (offline, or a redeploy while the page is open).
    try {
      const [{ searchWithProvider }, { mockAvailability }] = await Promise.all([
        import("./search-core"),
        import("./mock-availability"),
      ]);
      return await searchWithProvider(query, mockAvailability);
    } catch {
      return { ok: false, error: UNREACHABLE };
    }
  }
  const params = new URLSearchParams({
    checkin: query.checkin,
    checkout: query.checkout,
    guests: String(query.guests),
  });
  if (query.promo?.trim()) params.set("promo", query.promo.trim());
  try {
    const res = await fetch(`/api/availability?${params}`, { cache: "no-store" });
    return (await res.json()) as AvailabilityResult;
  } catch {
    return { ok: false, error: UNREACHABLE };
  }
}

const subscribeNoop = () => () => {};

/** False during SSR and hydration, true afterwards. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
}

/**
 * Check-in / check-out state for the booking bars. Defaults (today + 30,
 * two nights) are computed in the browser after hydration so a statically
 * built page never shows stale dates.
 */
export function useStayDates(leadDays = 30, defaultNights = 2) {
  const hydrated = useHydrated();
  const [checkinInput, setCheckin] = useState<string | null>(null);
  const [checkoutInput, setCheckout] = useState<string | null>(null);

  const today = hydrated ? localTodayIso() : "";
  const defaultCheckin = hydrated ? addDays(today, leadDays) : "";
  const checkin = checkinInput ?? defaultCheckin;
  const checkout = checkoutInput ?? (isIsoDate(checkin) ? addDays(checkin, defaultNights) : "");

  const reset = useCallback(() => {
    setCheckin(null);
    setCheckout(null);
  }, []);

  return { checkin, checkout, setCheckin, setCheckout, reset, today };
}
