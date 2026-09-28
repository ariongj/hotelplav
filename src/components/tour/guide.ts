import type { ViewId } from "@/components/resort3d/resortEngine";

import type { SceneId } from "./content";

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
    kicker: "The valley",
    title: "Welcome to Brezovica",
    text: "Welcome to Brezovica, 1,100 metres up in the Sharr Mountains. I’ll show you around the resort — press next whenever you like, or let the tour play.",
  },
  {
    kind: "map",
    view: "arrival",
    kicker: "Arrival",
    title: "The hotel",
    text: "The hotel faces south across the valley, so every arrival begins in the light — coats taken, keys presented, the mountains waiting behind.",
    link: { label: "Reserve your stay", href: "/#book" },
  },
  {
    kind: "space",
    scene: "hall",
    kicker: "Step inside · 360°",
    title: "The Grand Hall",
    text: "Marble, brass and nine-metre ceilings. Drag to look around — the plasterwork overhead dates from 1904.",
  },
  {
    kind: "map",
    view: "rooms",
    kicker: "The east wing",
    title: "Rooms & suites",
    text: "Forty-two rooms and suites, each framed around the peaks. The suites open onto balconies and terraces.",
    link: { label: "Rooms & rates", href: "/rooms" },
  },
  {
    kind: "space",
    scene: "room",
    kicker: "Step inside · 360°",
    title: "An Alpine Room",
    text: "Stand in the room before you sleep in it. Turn toward the window — that is the view you wake to.",
    link: { label: "Check availability", href: "/#book" },
  },
  {
    kind: "map",
    view: "spa",
    kicker: "Wellness",
    title: "Spa & thermal baths",
    text: "Glass-walled pools, a Finnish sauna and alpine steam — rituals built on mountain botanicals, open all year.",
    link: { label: "Explore the spa", href: "/spa" },
  },
  {
    kind: "map",
    view: "dining",
    kicker: "Three restaurants",
    title: "Dining & the terrace",
    text: "Ingredients gathered within sight of the peaks, and a terrace made for long evenings by lantern light.",
    link: { label: "Reserve a table", href: "/dining#reserve" },
  },
  {
    kind: "map",
    view: "chapel",
    kicker: "Weddings & events",
    title: "The chapel",
    text: "On its own quiet rise: stone arches and long light, with room for two hundred and twenty guests.",
    link: { label: "Plan an occasion", href: "/events" },
  },
  {
    kind: "space",
    scene: "chapel",
    kicker: "Step inside · 360°",
    title: "Inside the chapel",
    text: "Stand at the altar and look back down the aisle — twenty-two metres of limestone, laid in 1904.",
  },
  {
    kind: "map",
    view: "ski",
    kicker: "Winter",
    title: "Ski from the door",
    text: "In winter the lift climbs straight from the resort to the ridge. In summer the same slopes become walking trails.",
    link: { label: "Seasonal experiences", href: "/experiences" },
  },
  {
    kind: "map",
    view: "lake",
    kicker: "Summer",
    title: "The lake",
    text: "Down the valley road: rowing boats, breakfast by the water and cold, clear swims.",
    link: { label: "Plan your days", href: "/experiences" },
  },
  {
    kind: "map",
    view: "overview",
    kicker: "Thank you for visiting",
    title: "Your stay awaits",
    text: "That is the resort. Book direct for our best rate — no booking fees and free cancellation up to 48 hours before arrival.",
    link: { label: "Check availability", href: "/#book" },
  },
];

/** How long a stop stays up when the tour plays without voice. */
export function stopDuration(stop: GuideStop): number {
  const words = stop.text.split(/\s+/).length;
  return Math.min(13000, Math.max(8000, 5200 + words * 260));
}
