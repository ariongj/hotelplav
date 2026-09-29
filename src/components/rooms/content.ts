import type { BedType, FilterAmenity, RoomCategory, RoomView } from "@/lib/booking/rooms";

/** Hero photograph — the page's LCP image. */
export const HEADER_IMAGE = {
  src: "https://static.wixstatic.com/media/1de95c_4e2e9d02251244f4b5809e52393e1e0b~mv2.jpg/v1/fill/w_1920,h_1080,al_c,q_85,enc_avif,quality_auto/1de95c_4e2e9d02251244f4b5809e52393e1e0b~mv2.jpg",
  alt: "Armchair, side table and fireplace in the corner of a suite, in low evening light",
} as const;

/**
 * Included with every direct booking — listed on the booking card. (Spa
 * access isn't here: the spa is open to every hotel guest, however they book.)
 */
export const DIRECT_PERKS = ["Breakfast included", "Free cancellation to 48 h", "No booking fees"] as const;

/** id of the "Find your room" heading, which labels the browse section. */
export const BROWSE_HEADING_ID = "find-your-room";

/* Filter toolbar options. */

export const TYPE_FILTERS = ["All", "Rooms", "Suites", "Residences"] as const satisfies readonly (
  | "All"
  | RoomCategory
)[];

/** Rooms that sleep at least this many (a room for 4 also fits a party of 3). */
export const GUEST_FILTERS = ["Any", "3+", "4+"] as const;

export const BED_FILTERS = ["Any", "King", "Queen", "Twin"] as const satisfies readonly ("Any" | BedType)[];

export const VIEW_FILTERS = ["Any", "Lake", "Panorama", "Mountain", "Garden"] as const satisfies readonly (
  | "Any"
  | RoomView
)[];

export const SORT_OPTIONS = ["Recommended", "Price ↑", "Price ↓", "Size"] as const;

/** How each sort option reads in the menu. */
export const SORT_LABELS: Record<(typeof SORT_OPTIONS)[number], string> = {
  Recommended: "Recommended",
  "Price ↑": "Price: low to high",
  "Price ↓": "Price: high to low",
  Size: "Largest first",
};

/** Nightly-rate slider (EUR), matched against each card's "from" price. */
export const PRICE_FILTER = { min: 300, max: 1300, step: 20 } as const;

export const AMENITY_FILTERS: readonly { value: FilterAmenity; label: string }[] = [
  { value: "Balcony", label: "Balcony" },
  { value: "Fireplace", label: "Fireplace" },
  { value: "Terrace", label: "Terrace" },
  { value: "Sauna", label: "Private sauna" },
  { value: "Kitchen", label: "Kitchen" },
];
