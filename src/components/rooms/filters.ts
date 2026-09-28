import { rooms, type FilterAmenity, type RoomType } from "@/lib/booking/rooms";

import { BED_FILTERS, GUEST_FILTERS, PRICE_FILTER, SORT_OPTIONS, TYPE_FILTERS, VIEW_FILTERS } from "./content";

export type TypeFilter = (typeof TYPE_FILTERS)[number];
export type GuestFilter = (typeof GUEST_FILTERS)[number];
export type BedFilter = (typeof BED_FILTERS)[number];
export type ViewFilter = (typeof VIEW_FILTERS)[number];
export type SortOption = (typeof SORT_OPTIONS)[number];

export type RoomFilters = {
  type: TypeFilter;
  guests: GuestFilter;
  bed: BedFilter;
  view: ViewFilter;
  /** Highest base rate shown. */
  maxPrice: number;
  /** A room must offer every selected amenity. */
  amenities: readonly FilterAmenity[];
  sort: SortOption;
};

export const DEFAULT_FILTERS: RoomFilters = {
  type: "All",
  guests: "Any",
  bed: "Any",
  view: "Any",
  maxPrice: PRICE_FILTER.max,
  amenities: [],
  sort: "Recommended",
};

export function matchesFilters(room: RoomType, filters: RoomFilters): boolean {
  if (filters.type !== "All" && room.category !== filters.type) return false;
  if (filters.guests === "1–2" && room.sleeps > 2) return false;
  if (filters.guests === "3" && room.sleeps !== 3) return false;
  if (filters.guests === "4+" && room.sleeps < 4) return false;
  if (filters.bed !== "Any" && room.bed !== filters.bed) return false;
  if (filters.view !== "Any" && room.view !== filters.view) return false;
  if (room.baseRate > filters.maxPrice) return false;
  return filters.amenities.every((amenity) => room.amenities.includes(amenity));
}

const SORTERS: Record<SortOption, (a: RoomType, b: RoomType) => number> = {
  Recommended: (a, b) => a.rank - b.rank,
  "Price ↑": (a, b) => a.baseRate - b.baseRate,
  "Price ↓": (a, b) => b.baseRate - a.baseRate,
  Size: (a, b) => b.size - a.size,
};

/** Rooms that pass the filters, in the chosen order. */
export function filterRooms(filters: RoomFilters): RoomType[] {
  return rooms.filter((room) => matchesFilters(room, filters)).sort(SORTERS[filters.sort]);
}

/** Narrow a <select> value back to one of its options. */
export function pickOption<T extends string>(options: readonly T[], value: string, fallback: T): T {
  return options.find((option) => option === value) ?? fallback;
}
