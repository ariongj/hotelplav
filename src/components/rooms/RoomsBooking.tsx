"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { fetchAvailability, useStayDates } from "@/lib/booking/client";
import { DEFAULT_GUESTS, paxFor } from "@/lib/booking/guests";
import type { FilterAmenity, RoomType } from "@/lib/booking/rooms";
import type { AvailabilityResult, RoomQuote } from "@/lib/booking/types";

import { DEFAULT_FILTERS, filterRooms, type RoomFilters } from "./filters";
import { scrollBehavior } from "./scroll";

type Availability = Extract<AvailabilityResult, { ok: true }>;

export type RateRow = { room: RoomType; quote: RoomQuote };

export type RatesSuccess = {
  /** Changes with every search, so the rates panel knows to bring itself into view. */
  id: number;
  ok: true;
  availability: Availability;
  /** Guest label the search ran with, e.g. "2 Adults". */
  guestLabel: string;
};

export type RatesOutcome = RatesSuccess | { id: number; ok: false; error: string };

/** Bookable rooms among those the filters show, cheapest direct total first. */
function bookableRows(availability: Availability, visibleRooms: readonly RoomType[]): RateRow[] {
  const quotes = new Map(availability.rooms.map((quote) => [quote.id, quote]));
  const rows: RateRow[] = [];
  for (const room of visibleRooms) {
    const quote = quotes.get(room.id);
    if (quote && quote.left > 0 && quote.fits) rows.push({ room, quote });
  }
  return rows.sort((a, b) => a.quote.direct - b.quote.direct);
}

type RoomsBookingValue = {
  checkin: string;
  checkout: string;
  /** Earliest selectable date — empty until hydrated. */
  today: string;
  setCheckin: (iso: string) => void;
  setCheckout: (iso: string) => void;
  guests: string;
  setGuests: (label: string) => void;
  filters: RoomFilters;
  updateFilters: (patch: Partial<RoomFilters>) => void;
  toggleAmenity: (amenity: FilterAmenity) => void;
  clearFilters: () => void;
  /** Rooms that pass the filters, in display order. */
  visibleRooms: RoomType[];
  loading: boolean;
  outcome: RatesOutcome | null;
  /**
   * Bookable room types from the last search that pass the filters as they
   * are now, cheapest first — the rates panel follows the filters live.
   */
  rateRows: RateRow[];
  search: () => void;
  /** Sticky bar: the first time, bring the availability bar into view and then search. */
  searchFromStickyBar: () => void;
};

const RoomsBookingContext = createContext<RoomsBookingValue | null>(null);

/**
 * State shared by the availability bar, rate results, filters, room grid and
 * sticky bar. Wraps the page's main content, footer and sticky bar.
 */
export function RoomsBookingProvider({ children }: { children: ReactNode }) {
  const { checkin, checkout, today, setCheckin, setCheckout } = useStayDates();
  const [guests, setGuests] = useState(DEFAULT_GUESTS);
  const [filters, setFilters] = useState<RoomFilters>(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(false);
  const [outcome, setOutcome] = useState<RatesOutcome | null>(null);
  const lastRequest = useRef(0);
  const stickyTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const timer = stickyTimer;
    return () => window.clearTimeout(timer.current);
  }, []);

  const visibleRooms = useMemo(() => filterRooms(filters), [filters]);

  const rateRows = useMemo(
    () => (outcome?.ok ? bookableRows(outcome.availability, visibleRooms) : []),
    [outcome, visibleRooms],
  );

  const search = useCallback(() => {
    const id = ++lastRequest.current;
    setLoading(true);
    // fetchAvailability never throws: failures come back as { ok: false }.
    void fetchAvailability({ checkin, checkout, guests: paxFor(guests) }).then((result) => {
      if (id !== lastRequest.current) return; // a newer search is on its way
      setLoading(false);
      setOutcome(
        result.ok
          ? { id, ok: true, availability: result, guestLabel: guests }
          : { id, ok: false, error: result.error },
      );
    });
  }, [checkin, checkout, guests]);

  const searchFromStickyBar = useCallback(() => {
    if (outcome || loading) {
      search();
      return;
    }
    document.getElementById("book")?.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
    window.clearTimeout(stickyTimer.current);
    stickyTimer.current = window.setTimeout(search, 500);
  }, [outcome, loading, search]);

  const updateFilters = useCallback((patch: Partial<RoomFilters>) => {
    setFilters((current) => ({ ...current, ...patch }));
  }, []);

  const toggleAmenity = useCallback((amenity: FilterAmenity) => {
    setFilters((current) => ({
      ...current,
      amenities: current.amenities.includes(amenity)
        ? current.amenities.filter((item) => item !== amenity)
        : [...current.amenities, amenity],
    }));
  }, []);

  const clearFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  const value = useMemo<RoomsBookingValue>(
    () => ({
      checkin,
      checkout,
      today,
      setCheckin,
      setCheckout,
      guests,
      setGuests,
      filters,
      updateFilters,
      toggleAmenity,
      clearFilters,
      visibleRooms,
      loading,
      outcome,
      rateRows,
      search,
      searchFromStickyBar,
    }),
    [
      checkin,
      checkout,
      today,
      setCheckin,
      setCheckout,
      guests,
      filters,
      updateFilters,
      toggleAmenity,
      clearFilters,
      visibleRooms,
      loading,
      outcome,
      rateRows,
      search,
      searchFromStickyBar,
    ],
  );

  return <RoomsBookingContext.Provider value={value}>{children}</RoomsBookingContext.Provider>;
}

export function useRoomsBooking(): RoomsBookingValue {
  const context = useContext(RoomsBookingContext);
  if (!context) throw new Error("useRoomsBooking must be used inside <RoomsBookingProvider>");
  return context;
}
