import { getRoom } from "@/lib/booking/rooms";
import type { ContactTopic } from "@/lib/contact-link";

/*
 * Scenes of the 360° tour and the hotspots inside them (design/Tour.dc.html).
 * Directions are degrees in panorama space, the viewer's own convention.
 *
 * TODO(content): the panoramas are Wikimedia Commons placeholders (CC BY-SA)
 * — replace them with the hotel's own captures (≥ 8K equirectangular, 2:1).
 */

export type SceneId = "valley" | "hall" | "room" | "chapel";

/** Something that can be held from inside the tour (the booking drawer). */
export type TourOffer = {
  name: string;
  /** One line under the name: size, bed, aspect… */
  meta: string;
  /** EUR before the season multiplier — per night, or the whole price when `flat`. */
  rate: number;
  flat: boolean;
  /** Contact-form topic for "Complete reservation". */
  topic: ContactTopic;
};

type HotspotBase = {
  yaw: number;
  pitch: number;
  /** Glyph in the gold disc. */
  icon: string;
  label: string;
};

export type Hotspot =
  | (HotspotBase & { kind: "nav"; target: SceneId })
  | (HotspotBase & { kind: "info"; note: string })
  | (HotspotBase & { kind: "book"; offer: TourOffer });

export type Scene = {
  id: SceneId;
  num: string;
  name: string;
  kicker: string;
  description: string;
  facts: readonly { label: string; value: string }[];
  cta: { label: string; href: string };
  /** Equirectangular panorama. */
  src: string;
  /** Opening view: direction and vertical field of view. */
  yaw: number;
  pitch: number;
  fov: number;
  /** Alt text of the thumbnail in "Four spaces, one visit". */
  thumbAlt: string;
  hotspots: readonly Hotspot[];
};

// The prototype sold an "Alpine Room" at 58 m²; the catalogue's Deluxe
// Alpine Room (42 m², €420) is the room this panorama stands for.
const alpineRoom = getRoom("deluxe-alpine-room");

export const scenes: readonly Scene[] = [
  {
    id: "valley",
    num: "01",
    name: "The Sharr Valley",
    kicker: "Scene 01 — Above the resort",
    description:
      "Begin a thousand metres up. A full-circle view over the valley, the lake and the ridgelines that cradle the hotel — the landscape every window frames.",
    facts: [
      { label: "Altitude", value: "1,100 m" },
      { label: "Best light", value: "Sunrise" },
      { label: "Capture", value: "Aerial, mid-summer" },
    ],
    cta: { label: "Plan your days", href: "/experiences" },
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Chiemsee_bei_Seebruck_Luftbild.jpg/3840px-Chiemsee_bei_Seebruck_Luftbild.jpg",
    yaw: 20,
    pitch: -6,
    fov: 62,
    thumbAlt: "The Sharr Valley 360 preview",
    hotspots: [
      { kind: "nav", yaw: 48, pitch: -14, icon: "→", label: "Enter the hotel", target: "hall" },
      {
        kind: "info",
        yaw: -22,
        pitch: -4,
        icon: "i",
        label: "The lake",
        note: "Lake Brezovica, twenty minutes down the valley road. Rowing boats and a lakeside breakfast can be arranged at reception.",
      },
    ],
  },
  {
    id: "hall",
    num: "02",
    name: "The Grand Hall",
    kicker: "Scene 02 — Arrival & reception",
    description:
      "Marble, brass and nine-metre ceilings. The hall where every stay begins — coats taken, keys presented, the mountains waiting just beyond the doors.",
    facts: [
      { label: "Ceiling height", value: "9 m" },
      { label: "Style", value: "Belle Époque" },
      { label: "Concierge", value: "24 hours" },
    ],
    cta: { label: "Reserve your stay", href: "/#book" },
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Paris,_mairie_du_10e_arrdt,_hall_04.jpg/3840px-Paris,_mairie_du_10e_arrdt,_hall_04.jpg",
    yaw: 0,
    pitch: 4,
    fov: 58,
    thumbAlt: "The Grand Hall 360 preview",
    hotspots: [
      { kind: "nav", yaw: 30, pitch: 2, icon: "→", label: "To the rooms", target: "room" },
      { kind: "nav", yaw: -34, pitch: -2, icon: "→", label: "To the chapel", target: "chapel" },
      {
        kind: "info",
        yaw: 4,
        pitch: 22,
        icon: "i",
        label: "The ceiling",
        note: "The original 1904 plasterwork, restored over eleven months by a workshop in Prizren.",
      },
    ],
  },
  {
    id: "room",
    num: "03",
    name: "The Alpine Room",
    kicker: "Scene 03 — Rooms & suites",
    description:
      "Stand in the middle of the room before you sleep in it. Turn toward the window — that is the view you wake to.",
    facts: [
      { label: "Size", value: "42–110 m²" },
      { label: "Sleeps", value: "2–4 guests" },
      { label: "Aspect", value: "South ridge" },
    ],
    cta: { label: "Explore rooms & suites", href: "/rooms" },
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Cerro_Tololo_Hotel_Interior_360_Panorama_(2022_04_08_Pano360_Tololo_Hotel_Room-CC).jpg/3840px-Cerro_Tololo_Hotel_Interior_360_Panorama_(2022_04_08_Pano360_Tololo_Hotel_Room-CC).jpg",
    yaw: 180,
    pitch: 0,
    fov: 60,
    thumbAlt: "Alpine Room 360 preview",
    hotspots: [
      {
        kind: "book",
        yaw: 196,
        pitch: -6,
        icon: "€",
        label: "Reserve this room",
        offer: {
          name: alpineRoom.name,
          meta: `${alpineRoom.size} m² · ${alpineRoom.bedLabel} · south ridge · sleeps ${alpineRoom.sleeps}`,
          rate: alpineRoom.baseRate,
          flat: false,
          topic: "reservation",
        },
      },
      {
        kind: "info",
        yaw: 152,
        pitch: 4,
        icon: "i",
        label: "The window",
        note: "Triple-glazed and floor to ceiling. In winter the ridge opposite holds snow until May.",
      },
      { kind: "nav", yaw: 236, pitch: -2, icon: "←", label: "Back to the hall", target: "hall" },
    ],
  },
  {
    id: "chapel",
    num: "04",
    name: "The Chapel",
    kicker: "Scene 04 — Events & weddings",
    description:
      "Stone arches and long light — the ceremony space couples cross mountains for. Stand at the altar and look back down the aisle.",
    facts: [
      { label: "Capacity", value: "220 seated" },
      { label: "Ceremonies", value: "Civil & religious" },
      { label: "Season", value: "Year-round" },
    ],
    cta: { label: "Plan an occasion", href: "/events" },
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Soissons_Cathedral_Interior_360x180,_Picardy,_France_-_Diliff.jpg/3840px-Soissons_Cathedral_Interior_360x180,_Picardy,_France_-_Diliff.jpg",
    yaw: 0,
    pitch: 8,
    fov: 56,
    thumbAlt: "The Chapel 360 preview",
    hotspots: [
      {
        kind: "book",
        yaw: 26,
        pitch: 4,
        icon: "€",
        label: "Hold a ceremony date",
        offer: {
          name: "Chapel ceremony",
          meta: "220 seated · civil & religious · exclusive use",
          rate: 2400,
          flat: true,
          topic: "events",
        },
      },
      {
        kind: "info",
        yaw: -28,
        pitch: 0,
        icon: "i",
        label: "The aisle",
        note: "Twenty-two metres of limestone, laid in 1904. Ceremonies run to forty minutes.",
      },
    ],
  },
];

/** Viewer label, e.g. "01 — The Sharr Valley". */
export function sceneLabel(scene: Scene): string {
  return `${scene.num} — ${scene.name}`;
}

export function sceneIndex(id: SceneId): number {
  return scenes.findIndex((scene) => scene.id === id);
}

/** Scene for a deep link such as "#room" or "#scene-3"; -1 when there is none. */
export function sceneIndexFromHash(hash: string): number {
  const match = /^#(?:scene-(\d+)|([a-z]+))$/.exec(hash.toLowerCase());
  if (!match) return -1;
  if (match[1]) {
    const index = Number(match[1]) - 1;
    return index >= 0 && index < scenes.length ? index : -1;
  }
  return scenes.findIndex((scene) => scene.id === match[2]);
}
