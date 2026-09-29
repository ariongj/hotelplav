"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";

import { fetchAvailability, useStayDates } from "@/lib/booking/client";
import { DEFAULT_GUESTS, paxFor } from "@/lib/booking/guests";
import { addDays, checkStay, nightsBetween } from "@/lib/booking/pricing";
import type { RoomId } from "@/lib/booking/rooms";
import type { AvailabilityResult, RoomQuote } from "@/lib/booking/types";
import { submitEnquiry } from "@/lib/enquiry-client";
import { euro } from "@/lib/format";

export type Search = Extract<AvailabilityResult, { ok: true }>;

const SEARCH_FAILED =
  "We couldn't reach our reservations system just now — please try again, or call us and we'll price your stay.";

type HomeBookingState = Omit<ReturnType<typeof useStayDates>, "setCheckin"> & {
  setCheckin: (checkin: string) => void;
  guests: string;
  setGuests: (guests: string) => void;
  promo: string;
  setPromo: (promo: string) => void;
  search: Search | null;
  /** The promo code as typed for the current results ("" when none) — to flag one that wasn't recognised. */
  searchedPromo: string;
  error: string;
  loading: boolean;
  /** Guest label the current results were priced for. */
  pricedFor: string;
  selectedId: RoomId | null;
  held: boolean;
  /** Why the last hold couldn't be sent ("" when it went through). */
  holdError: string;
  /** Price the stay; resolves true when there are results to show. */
  runSearch: () => Promise<boolean>;
  select: (room: RoomQuote) => void;
  hold: () => Promise<void>;
  selection: { quote: RoomQuote; search: Search } | null;
};

const HomeBookingContext = createContext<HomeBookingState | null>(null);

/** Booking state shared by the hero's search bar, the results and the sticky bar. */
export function HomeBookingProvider({ children }: { children: ReactNode }) {
  const dates = useStayDates();
  const [guests, setGuests] = useState(DEFAULT_GUESTS);
  const [promo, setPromo] = useState("");
  const [search, setSearch] = useState<Search | null>(null);
  const [searchedPromo, setSearchedPromo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pricedFor, setPricedFor] = useState(DEFAULT_GUESTS);
  const [selectedId, setSelectedId] = useState<RoomId | null>(null);
  const [held, setHeld] = useState(false);
  const [holdError, setHoldError] = useState("");
  /** Bumped by every hold, search and selection, so a late reply can't undo a newer choice. */
  const holdVersion = useRef(0);

  const { checkin, checkout, setCheckin: setCheckinInput, setCheckout } = dates;

  // Moving check-in onto or past check-out carries check-out along, keeping the stay's length.
  const setCheckin = useCallback(
    (next: string) => {
      setCheckinInput(next);
      if (next && checkout && checkout <= next) {
        const nights = checkin ? Math.max(1, nightsBetween(checkin, checkout)) : 1;
        setCheckout(addDays(next, nights));
      }
    },
    [checkin, checkout, setCheckinInput, setCheckout],
  );

  const runSearch = useCallback(async () => {
    const stay = checkStay(checkin, checkout);
    if (!stay.ok) {
      setError(stay.error);
      return false;
    }
    setLoading(true);
    let result: AvailabilityResult;
    try {
      result = await fetchAvailability({ checkin, checkout, guests: paxFor(guests), promo });
    } catch {
      // e.g. a chunk that no longer exists after a redeploy of the static site.
      result = { ok: false, error: SEARCH_FAILED };
    } finally {
      setLoading(false);
    }
    if (!result.ok) {
      setError(result.error);
      return false;
    }
    const bookable = result.rooms.filter((room) => room.left > 0 && room.fits);
    setError("");
    setPricedFor(guests);
    setSearch(result);
    setSearchedPromo(promo.trim());
    setSelectedId((current) => (bookable.some((room) => room.id === current) ? current : (bookable[0]?.id ?? null)));
    holdVersion.current += 1;
    setHeld(false);
    setHoldError("");
    return true;
  }, [checkin, checkout, guests, promo]);

  const select = useCallback((room: RoomQuote) => {
    if (room.left === 0 || !room.fits) return;
    holdVersion.current += 1;
    setSelectedId(room.id);
    setHeld(false);
    setHoldError("");
  }, []);

  const selection = useMemo(() => {
    if (!search || !selectedId) return null;
    const quote = search.rooms.find((room) => room.id === selectedId);
    return quote && quote.left > 0 && quote.fits ? { quote, search } : null;
  }, [search, selectedId]);

  const hold = useCallback(async () => {
    if (!selection) return;
    const { quote, search: s } = selection;
    // Show the hold straight away; take it back if reservations never hear about it.
    const version = ++holdVersion.current;
    setHeld(true);
    setHoldError("");
    const res = await submitEnquiry("stay-hold", {
      room: quote.name,
      checkin: s.checkin,
      checkout: s.checkout,
      nights: s.nights,
      guests: pricedFor,
      total: euro(quote.direct),
      promo: s.promo,
    });
    if (!res.ok && version === holdVersion.current) {
      setHeld(false);
      setHoldError(res.error);
    }
  }, [selection, pricedFor]);

  const value: HomeBookingState = {
    ...dates,
    setCheckin,
    guests,
    setGuests,
    promo,
    setPromo,
    search,
    searchedPromo,
    error,
    loading,
    pricedFor,
    selectedId,
    held,
    holdError,
    runSearch,
    select,
    hold,
    selection,
  };

  return <HomeBookingContext.Provider value={value}>{children}</HomeBookingContext.Provider>;
}

export function useHomeBooking(): HomeBookingState {
  const context = useContext(HomeBookingContext);
  if (!context) throw new Error("useHomeBooking must be used inside <HomeBookingProvider>");
  return context;
}
