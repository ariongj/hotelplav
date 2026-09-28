import type { SceneId } from "@/components/tour/content";

/** Places marked on the 3D resort map. */
export type PoiId = "arrival" | "rooms" | "spa" | "dining" | "chapel" | "lake" | "ski";

export type Poi = {
  id: PoiId;
  name: string;
  blurb: string;
  link: { label: string; href: string };
  /** 360° space to step into from this place, if there is one. */
  scene?: SceneId;
};

export const pois: readonly Poi[] = [
  {
    id: "arrival",
    name: "The Hotel",
    blurb: "A Belle Époque grand hall at the heart of the resort, facing south across the valley.",
    link: { label: "Reserve your stay", href: "/#book" },
    scene: "hall",
  },
  {
    id: "rooms",
    name: "Rooms & Suites",
    blurb: "Forty-two rooms and suites framed around the peaks — suites open onto balconies and terraces.",
    link: { label: "Rooms & rates", href: "/rooms" },
    scene: "room",
  },
  {
    id: "spa",
    name: "Spa & Thermal Baths",
    blurb: "Glass-walled pools, a Finnish sauna and alpine steam, open year-round.",
    link: { label: "Explore the spa", href: "/spa" },
  },
  {
    id: "dining",
    name: "Restaurants & Terrace",
    blurb: "Three restaurants, one philosophy — and a terrace made for long mountain evenings.",
    link: { label: "Reserve a table", href: "/dining#reserve" },
  },
  {
    id: "chapel",
    name: "The Chapel",
    blurb: "Stone arches on a quiet knoll, with room for 220 guests.",
    link: { label: "Weddings & events", href: "/events" },
    scene: "chapel",
  },
  {
    id: "lake",
    name: "The Lake",
    blurb: "Down the valley road: rowing boats, lakeside breakfasts and cold, clear swims.",
    link: { label: "Plan your days", href: "/experiences" },
    scene: "valley",
  },
  {
    id: "ski",
    name: "Ski Lift",
    blurb: "In winter the lift climbs from the resort to the ridge; in summer the slopes become walking trails.",
    link: { label: "Seasonal experiences", href: "/experiences" },
  },
];

export function getPoi(id: PoiId): Poi {
  const poi = pois.find((p) => p.id === id);
  if (!poi) throw new Error(`Unknown place: ${id}`);
  return poi;
}
