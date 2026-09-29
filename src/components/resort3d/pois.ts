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
    name: "The hotel",
    blurb: "The heart of the hotel: a grand hall looking out across Lake Plav to the mountains.",
    link: { label: "Book your stay", href: "/#book" },
    scene: "hall",
  },
  {
    id: "rooms",
    name: "Rooms & suites",
    blurb: "Forty-two rooms and suites facing the lake, the peaks or the garden — suites open onto balconies and terraces.",
    link: { label: "Rooms & rates", href: "/rooms" },
    scene: "room",
  },
  {
    id: "spa",
    name: "The Lake Spa",
    blurb: "Glass-walled pools among the pines, a few steps from the lake, with an outdoor pool in summer, a Finnish sauna and steam.",
    link: { label: "Explore the spa", href: "/spa" },
  },
  {
    id: "dining",
    name: "Dining & terrace",
    blurb: "The Lake Room, the Fireside Lounge and the Boathouse Bar, with a lake terrace for long mountain evenings.",
    link: { label: "Reserve a table", href: "/dining#reserve" },
  },
  {
    id: "chapel",
    name: "The chapel",
    blurb: "Stone arches a short, level walk from the hotel, with room for 220 guests.",
    link: { label: "Events & weddings", href: "/events" },
    scene: "chapel",
  },
  {
    // No 360° space: the tour's aerial panorama is a sample of another lake.
    id: "lake",
    name: "Lake Plav",
    blurb: "A glacial lake at 906 m, right at the door: kayaks and pedal boats, lakeside breakfasts and fresh, clear swims.",
    link: { label: "Plan your days", href: "/experiences" },
  },
  {
    id: "ski",
    name: "Mountain trails",
    blurb: "A path climbs from the hotel through the pines to a viewpoint high above the lake. In winter it is a snowshoe walk, and the ski slope at Paljevi is half an hour’s drive away.",
    link: { label: "Seasonal experiences", href: "/experiences#seasons" },
  },
];

export function getPoi(id: PoiId): Poi {
  const poi = pois.find((p) => p.id === id);
  if (!poi) throw new Error(`Unknown place: ${id}`);
  return poi;
}
