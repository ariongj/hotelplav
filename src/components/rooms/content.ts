import type { BedType, FilterAmenity, RoomCategory, RoomView } from "@/lib/booking/rooms";

/** Header photograph — the page's LCP image. */
export const HEADER_IMAGE = {
  src: "https://static.wixstatic.com/media/1de95c_4e2e9d02251244f4b5809e52393e1e0b~mv2.jpg/v1/fill/w_1920,h_1080,al_c,q_85,enc_avif,quality_auto/1de95c_4e2e9d02251244f4b5809e52393e1e0b~mv2.jpg",
  alt: "A suite interior in warm light",
} as const;

/* Filter toolbar options, in the order the prototype shows them. */

export const TYPE_FILTERS = ["All", "Rooms", "Suites", "Residences"] as const satisfies readonly (
  | "All"
  | RoomCategory
)[];

export const GUEST_FILTERS = ["Any", "1–2", "3", "4+"] as const;

export const BED_FILTERS = ["Any", "King", "Queen", "Twin"] as const satisfies readonly ("Any" | BedType)[];

export const VIEW_FILTERS = ["Any", "Valley", "Lake", "Garden", "Panorama", "Mountain"] as const satisfies readonly (
  | "Any"
  | RoomView
)[];

export const SORT_OPTIONS = ["Recommended", "Price ↑", "Price ↓", "Size"] as const;

/** Nightly-rate slider (EUR, shoulder-season base rate). */
export const PRICE_FILTER = { min: 300, max: 1500, step: 20 } as const;

export const AMENITY_FILTERS: readonly { value: FilterAmenity; label: string }[] = [
  { value: "Balcony", label: "Balcony" },
  { value: "Fireplace", label: "Fireplace" },
  { value: "Terrace", label: "Terrace" },
  { value: "Sauna", label: "Private sauna" },
  { value: "Kitchen", label: "Kitchen" },
];
