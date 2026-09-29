import type { ViewId } from "@/components/resort3d/resortEngine";

import { tourRoom, type SceneId } from "./content";

/** One stop of the guided tour: a place on the 3D map or a 360° space. */
export type GuideStop = {
  kicker: string;
  title: string;
  /** Narration, shown on the guide card and read aloud when voice is on. */
  text: string;
  link?: { label: string; href: string };
} & ({ kind: "map"; view: ViewId } | { kind: "space"; scene: SceneId });

export const guideStops: readonly GuideStop[] = [
  {
    kind: "map",
    view: "overview",
    kicker: "Lake Plav, Montenegro",
    title: "Welcome to Plav Hotel",
    text: "Welcome to Plav Hotel, on the shore of Lake Plav beneath the Prokletije. I’ll show you around — press next whenever you like, or just let the tour play.",
  },
  {
    kind: "map",
    view: "arrival",
    kicker: "Arrival",
    title: "The hotel",
    text: "Every stay begins at the water’s edge — coats taken, keys presented, and the lake waiting just beyond the doors.",
    link: { label: "Book your stay", href: "/#book" },
  },
  {
    kind: "space",
    scene: "hall",
    kicker: "Step inside · 360°",
    title: "The Grand Hall",
    text: "Marble, brass and nine-metre ceilings. Drag to look around, then look up.",
  },
  {
    kind: "map",
    view: "rooms",
    kicker: "Stay",
    title: "Rooms & suites",
    text: "Forty-two rooms and suites facing the lake, the peaks or the garden. The suites open onto balconies and terraces.",
    link: { label: "Rooms & rates", href: "/rooms" },
  },
  {
    kind: "space",
    scene: "room",
    kicker: "Step inside · 360°",
    title: `The ${tourRoom.name}`,
    text: "Stand in the room before you sleep in it. Turn toward the window — that is the light you wake to.",
    link: { label: "Check availability", href: "/#book" },
  },
  {
    kind: "map",
    view: "spa",
    kicker: "Wellness",
    title: "The Lake Spa",
    text: "Glass-walled pools among the pines, a few steps from the lake, an outdoor pool in summer, and a Finnish sauna and steam room — open to every hotel guest.",
    link: { label: "Explore the spa", href: "/spa" },
  },
  {
    kind: "map",
    view: "dining",
    kicker: "Dining",
    title: "Dining & the lake terrace",
    text: "A restaurant, a lounge and a bar: The Lake Room, the Fireside Lounge and the Boathouse Bar. From May to October, dinner moves out onto the lake terrace.",
    link: { label: "Reserve a table", href: "/dining#reserve" },
  },
  {
    kind: "map",
    view: "chapel",
    kicker: "Events & weddings",
    title: "The chapel",
    text: "A short, level walk from the hotel: stone arches and long light, with room for two hundred and twenty guests.",
    link: { label: "Plan an occasion", href: "/events" },
  },
  {
    kind: "space",
    scene: "chapel",
    kicker: "Step inside · 360°",
    title: "Inside the chapel",
    text: "Stand at the altar and look back down the aisle: twenty-two metres of pale stone.",
  },
  {
    kind: "map",
    view: "ski",
    kicker: "On foot",
    title: "Trails above the lake",
    text: "A path climbs from the hotel through the pines to a viewpoint high over the lake — a snowshoe walk in winter. For skiing, the slope at Paljevi is half an hour’s drive away.",
    link: { label: "Seasonal experiences", href: "/experiences#seasons" },
  },
  {
    kind: "map",
    view: "lake",
    kicker: "Summer",
    title: "Lake Plav",
    text: "A glacial lake some ten thousand years old, right in front of the hotel. Kayaks and pedal boats, breakfast by the water and fresh, clear swims — reception can arrange them all.",
    link: { label: "Plan your days", href: "/experiences" },
  },
  {
    kind: "map",
    view: "overview",
    kicker: "Thank you for visiting",
    title: "Your stay awaits",
    text: "That is Plav Hotel. Book direct for our best rate — no booking fees and free cancellation up to 48 hours before arrival.",
    link: { label: "Check availability", href: "/#book" },
  },
];

/** How long a stop stays up when the tour plays without voice. */
export function stopDuration(stop: GuideStop): number {
  const words = stop.text.split(/\s+/).length;
  return Math.min(13000, Math.max(8000, 5200 + words * 260));
}

/** Whole guided tour without voice, rounded to the minute (at least one). */
export const guideMinutes = Math.max(1, Math.round(guideStops.reduce((ms, stop) => ms + stopDuration(stop), 0) / 60000));
