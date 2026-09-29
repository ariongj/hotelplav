import type { Credit } from "@/components/ui/PhotoCredit";
import { getRoom, rooms } from "@/lib/booking/rooms";
import type { ContactTopic } from "@/lib/contact-link";

/*
 * Scenes of the 360° tour and the hotspots inside them.
 * Directions are degrees in panorama space, the viewer's own convention.
 *
 * TODO(content): the panoramas are Wikimedia Commons placeholders, each
 * credited with its own author and licence — replace them with Plav Hotel's
 * own captures (≥ 8K equirectangular, 2:1) and drop the credits.
 */

const COMMONS = "https://upload.wikimedia.org/wikipedia/commons/thumb";

/** A Commons panorama at full viewer size, plus a card-sized thumbnail of the same file. */
function commonsPano(path: string, file: string): { src: string; thumb: string } {
  return {
    src: `${COMMONS}/${path}/${file}/3840px-${file}`,
    thumb: `${COMMONS}/${path}/${file}/960px-${file}`,
  };
}

export type SceneId = "valley" | "hall" | "room" | "chapel";

/** Something that can be priced and requested from inside the tour (the booking drawer). */
export type TourOffer = {
  name: string;
  /** One line under the name: size, bed, view… */
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
  /** Glyph in the brass disc. */
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
  /** Short line naming what the space is for, e.g. "Rooms & suites". */
  kicker: string;
  description: string;
  facts: readonly { label: string; value: string }[];
  cta: { label: string; href: string };
  /** Equirectangular panorama. */
  src: string;
  /** Small image of the same panorama for the "Four spaces" cards, so they never pull the full file. */
  thumb: string;
  /** Author and licence of the panorama (Wikimedia Commons). */
  credit: Credit;
  /** Opening view: direction and vertical field of view. */
  yaw: number;
  pitch: number;
  fov: number;
  /** Alt text of the thumbnail in "Four spaces, one visit". */
  thumbAlt: string;
  hotspots: readonly Hotspot[];
};

/** The room the room panorama stands for — named and priced from the catalogue. */
export const tourRoom = getRoom("deluxe-alpine-room");

function range(values: readonly number[]): string {
  const min = Math.min(...values);
  const max = Math.max(...values);
  return min === max ? String(min) : `${min}–${max}`;
}

export const scenes: readonly Scene[] = [
  {
    id: "valley",
    num: "01",
    // A sample aerial of another lake (the Chiemsee) until Lake Plav is captured:
    // named and described so it is never passed off as Lake Plav itself.
    name: "The lake from above",
    kicker: "The lake",
    description:
      "A sample aerial panorama, standing in for our own. Lake Plav itself is a glacial lake some ten thousand years old, with Visitor across the water to the west and the Prokletije rising to the south.",
    facts: [
      { label: "Lake level", value: "906 m" },
      { label: "Length", value: "About 2.2 km" },
      { label: "Age", value: "~10,000 years" },
    ],
    cta: { label: "Plan your days", href: "/experiences" },
    ...commonsPano("5/5d", "Chiemsee_bei_Seebruck_Luftbild.jpg"),
    credit: {
      author: "SimonWaldherr",
      license: "CC BY-SA 4.0",
      href: "https://commons.wikimedia.org/wiki/File:Chiemsee_bei_Seebruck_Luftbild.jpg",
    },
    yaw: 20,
    pitch: -6,
    fov: 62,
    thumbAlt: "Aerial 360° view over a wide lake (sample panorama)",
    hotspots: [
      { kind: "nav", yaw: 48, pitch: -14, icon: "→", label: "Step into the Grand Hall", target: "hall" },
      {
        kind: "info",
        yaw: -22,
        pitch: -4,
        icon: "i",
        label: "About Lake Plav",
        note: "This sample view shows another lake. Lake Plav is right outside the hotel: kayaks and pedal boats, and breakfast by the water, can be arranged at reception.",
      },
      {
        kind: "info",
        yaw: 150,
        pitch: 6,
        icon: "i",
        label: "Around Lake Plav",
        note: "Lake Plav lies between two ranges: Visitor to the west and the Prokletije — the “Accursed Mountains” — to the south. Reception can suggest walks for every pace.",
      },
    ],
  },
  {
    id: "hall",
    num: "02",
    name: "The Grand Hall",
    kicker: "Arrival & reception",
    description:
      "Marble, brass and nine-metre ceilings. The hall where every stay begins — coats taken, keys presented, and the lake waiting just beyond the doors.",
    facts: [
      { label: "Ceiling height", value: "9 m" },
      { label: "Style", value: "Stone & brass" },
      { label: "Concierge", value: "24 hours" },
    ],
    cta: { label: "Book your stay", href: "/#book" },
    ...commonsPano("3/32", "Paris,_mairie_du_10e_arrdt,_hall_04.jpg"),
    credit: {
      author: "Coyau",
      license: "CC BY-SA 4.0",
      href: "https://commons.wikimedia.org/wiki/File:Paris,_mairie_du_10e_arrdt,_hall_04.jpg",
    },
    yaw: 0,
    pitch: 4,
    fov: 58,
    thumbAlt: "The Grand Hall 360° preview",
    hotspots: [
      { kind: "nav", yaw: 30, pitch: 2, icon: "→", label: "To the rooms", target: "room" },
      { kind: "nav", yaw: -34, pitch: -2, icon: "→", label: "To the chapel", target: "chapel" },
      {
        kind: "info",
        yaw: 4,
        pitch: 22,
        icon: "i",
        label: "The ceiling",
        note: "Nine metres of hand-finished plaster, lit to glow at dusk.",
      },
    ],
  },
  {
    id: "room",
    num: "03",
    name: tourRoom.name,
    kicker: "Rooms & suites",
    description:
      "Stand in the middle of the room before you sleep in it. Turn toward the window — that is the light you wake to.",
    facts: [
      { label: "Rooms & suites", value: `${range(rooms.map((r) => r.size))} m²` },
      { label: "Sleeps", value: `${range(rooms.map((r) => r.sleeps))} guests` },
      { label: "Breakfast", value: "Included" },
    ],
    cta: { label: "Explore rooms & suites", href: "/rooms" },
    ...commonsPano("d/d4", "Cerro_Tololo_Hotel_Interior_360_Panorama_(2022_04_08_Pano360_Tololo_Hotel_Room-CC).jpg"),
    credit: {
      author: "NOIRLab/NSF/AURA/P. Horálek",
      license: "CC BY 4.0",
      href: "https://commons.wikimedia.org/wiki/File:Cerro_Tololo_Hotel_Interior_360_Panorama_(2022_04_08_Pano360_Tololo_Hotel_Room-CC).jpg",
    },
    yaw: 180,
    pitch: 0,
    fov: 60,
    thumbAlt: `${tourRoom.name} 360° preview`,
    hotspots: [
      {
        kind: "book",
        yaw: 196,
        pitch: -6,
        icon: "€",
        label: "Book this room",
        offer: {
          name: tourRoom.name,
          meta: tourRoom.summary,
          rate: tourRoom.baseRate,
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
        note: "Floor to ceiling and triple-glazed — warm in winter, and wide enough to watch the weather roll over the mountains.",
      },
      { kind: "nav", yaw: 236, pitch: -2, icon: "←", label: "Back to the hall", target: "hall" },
    ],
  },
  {
    id: "chapel",
    num: "04",
    name: "The Chapel",
    kicker: "Events & weddings",
    description:
      "Stone arches and long light, a short, level walk from the hotel — the ceremony space couples cross mountains for. Stand at the altar and look back down the aisle.",
    facts: [
      { label: "Capacity", value: "220 seated" },
      { label: "Ceremonies", value: "Civil & religious" },
      { label: "Season", value: "Year-round" },
    ],
    cta: { label: "Plan an occasion", href: "/events" },
    ...commonsPano("a/ab", "Soissons_Cathedral_Interior_360x180,_Picardy,_France_-_Diliff.jpg"),
    credit: {
      author: "Diliff",
      license: "CC BY-SA 3.0",
      href: "https://commons.wikimedia.org/wiki/File:Soissons_Cathedral_Interior_360x180,_Picardy,_France_-_Diliff.jpg",
    },
    yaw: 0,
    pitch: 8,
    fov: 56,
    thumbAlt: "The Chapel 360° preview",
    hotspots: [
      {
        kind: "book",
        yaw: 26,
        pitch: 4,
        icon: "€",
        label: "Price a ceremony",
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
        note: "Twenty-two metres of pale stone. Ceremonies run to forty minutes.",
      },
    ],
  },
];

/** Viewer label, e.g. "01 · The lake from above". */
export function sceneLabel(scene: Scene): string {
  return `${scene.num} · ${scene.name}`;
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
