"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

import type { RoomId } from "@/lib/booking/rooms";
import type { AvailabilityResult } from "@/lib/booking/types";

type Search = Extract<AvailabilityResult, { ok: true }>;

type HomeBookingState = {
  search: Search | null;
  setSearch: (search: Search | null) => void;
  selectedId: RoomId | null;
  setSelectedId: (id: RoomId | null) => void;
};

const HomeBookingContext = createContext<HomeBookingState | null>(null);

/** Shares the booking panel's search result and selection with the sticky bar. */
export function HomeBookingProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState<Search | null>(null);
  const [selectedId, setSelectedId] = useState<RoomId | null>(null);
  const value = useMemo(() => ({ search, setSearch, selectedId, setSelectedId }), [search, selectedId]);
  return <HomeBookingContext.Provider value={value}>{children}</HomeBookingContext.Provider>;
}

export function useHomeBooking(): HomeBookingState {
  const context = useContext(HomeBookingContext);
  if (!context) throw new Error("useHomeBooking must be used inside <HomeBookingProvider>");
  return context;
}

/** The selected quote, if it is still bookable. */
export function useSelectedQuote() {
  const { search, selectedId } = useHomeBooking();
  if (!search || !selectedId) return null;
  const quote = search.rooms.find((room) => room.id === selectedId);
  return quote && quote.left > 0 && quote.fits ? { quote, search } : null;
}
