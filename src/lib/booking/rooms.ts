/**
 * Room catalogue — the single source of truth for room types, capacity and
 * base rates. Base rates are shoulder-season EUR per night, including
 * breakfast for everyone in the room, spa access (pools, sauna, steam room)
 * and taxes (design/README.md › Booking engine).
 *
 * When the PMS is connected, rates and inventory come from it; this file
 * keeps the marketing content (copy, photos, amenities).
 *
 * TODO(content): the room photos are Wikimedia Commons placeholders (credited
 * on the cards and at /credits) — replace them with the hotel's own.
 */

import type { Credit } from "@/components/ui/PhotoCredit";

import { fromRate } from "./pricing";

export type RoomId =
  | "presidential-suite"
  | "panorama-suite"
  | "junior-suite"
  | "chalet-residence"
  | "family-suite"
  | "deluxe-alpine-room"
  | "deluxe-twin"
  | "garden-studio";

export type RoomCategory = "Rooms" | "Suites" | "Residences";
export type BedType = "King" | "Queen" | "Twin";
/** "Panorama" = the lake and the peaks together. */
export type RoomView = "Lake" | "Panorama" | "Mountain" | "Garden";
/** Amenities the rooms page can filter by. */
export type FilterAmenity = "Balcony" | "Fireplace" | "Terrace" | "Sauna" | "Kitchen";

export type RoomType = {
  id: RoomId;
  name: string;
  category: RoomCategory;
  /** Shoulder-season nightly rate in EUR. */
  baseRate: number;
  /** Maximum guests. */
  sleeps: number;
  /** How many rooms of this type the hotel has (42 in all). */
  count: number;
  /** m² */
  size: number;
  bed: BedType;
  /** Beds for every guest it sleeps: "King bed", "King + sofa bed" … */
  bedLabel: string;
  view: RoomView;
  amenities: readonly FilterAmenity[];
  /** Chips shown on the room card. */
  highlights: readonly string[];
  description: string;
  /** One-line summary used in booking results: "42 m² · 2 guests · mountain view · king bed". */
  summary: string;
  /** Default order on the rooms page ("Recommended"). */
  rank: number;
  badge?: { label: string; tone: "gold" | "dark" };
  /** Number of photos in the room's gallery (card counter). */
  photoCount: number;
  /** The alt describes the photo — the room's name is always shown beside it. */
  image: { src: string; alt: string; position?: string; credit?: Credit };
};

const wix = (id: string, w: number, h: number) =>
  `https://static.wixstatic.com/media/${id}/v1/fill/w_${w},h_${h},al_c,q_85,enc_avif,quality_auto/${id}`;

const commons = "https://upload.wikimedia.org/wikipedia/commons";

export const rooms: readonly RoomType[] = [
  {
    id: "presidential-suite",
    name: "Presidential Suite",
    category: "Suites",
    baseRate: 1080,
    sleeps: 3,
    count: 1,
    size: 120,
    bed: "King",
    bedLabel: "King + sofa bed",
    view: "Lake",
    amenities: ["Balcony", "Fireplace"],
    highlights: ["Balcony", "Fireplace", "Nespresso", "Smart controls"],
    description:
      "Our finest suite: a corner of the house with a private balcony over the lake, a fireplace, and light that turns gold at dusk.",
    summary: "120 m² · 3 guests · lake view · balcony",
    rank: 1,
    badge: { label: "Signature", tone: "gold" },
    photoCount: 6,
    // Placeholder from the design handoff (no credit needed).
    image: {
      src: wix("1de95c_caf15c194f104ecda6e934c4a9f280fa~mv2.jpg", 800, 550),
      alt: "A suite's sitting corner: an armchair, a side table and the fire",
    },
  },
  {
    id: "panorama-suite",
    name: "Panorama Suite",
    category: "Suites",
    baseRate: 980,
    sleeps: 4,
    count: 1,
    size: 110,
    bed: "King",
    bedLabel: "King + double sofa bed",
    view: "Panorama",
    amenities: ["Terrace", "Fireplace"],
    highlights: ["Terrace", "Fireplace", "Soaking tub"],
    description:
      "A wraparound terrace, a fireplace and a soaking tub — with the lake on one side and the peaks on the other.",
    summary: "110 m² · 4 guests · lake & peaks · terrace",
    rank: 2,
    photoCount: 8,
    image: {
      src: `${commons}/thumb/c/cf/Le_Mirador_Junior_Suite.jpg/1280px-Le_Mirador_Junior_Suite.jpg`,
      alt: "A suite at dusk: a king bed, a reading corner and glass doors onto a terrace above a lake and mountains",
      credit: {
        author: "Marketing.mirador",
        license: "CC BY-SA 4.0",
        href: "https://commons.wikimedia.org/wiki/File:Le_Mirador_Junior_Suite.jpg",
      },
    },
  },
  {
    id: "junior-suite",
    name: "Junior Suite",
    category: "Suites",
    baseRate: 560,
    sleeps: 2,
    count: 6,
    size: 58,
    bed: "King",
    bedLabel: "King bed",
    view: "Lake",
    amenities: ["Balcony"],
    highlights: ["Balcony", "Nespresso", "Rainfall shower"],
    description: "An open-plan suite with a reading nook and a balcony that opens onto the still water below.",
    summary: "58 m² · 2 guests · lake view · sitting area",
    rank: 3,
    photoCount: 5,
    image: {
      src: `${commons}/thumb/3/31/Junior_Suite_Bedroom_-_Westin_Ottawa_%2840586472474%29.jpg/1280px-Junior_Suite_Bedroom_-_Westin_Ottawa_%2840586472474%29.jpg`,
      alt: "A king bed under warm wall lights, with an armchair by the curtains",
      credit: {
        author: "TravelingOtter",
        license: "CC BY 2.0",
        href: "https://commons.wikimedia.org/wiki/File:Junior_Suite_Bedroom_-_Westin_Ottawa_(40586472474).jpg",
      },
    },
  },
  {
    // The prototypes disagree on this residence (home: 180 m² / 6 guests,
    // rooms page: 140 m² / 5 guests). The README's booking spec says it
    // sleeps 6, so that wins — confirm with the hotel.
    id: "chalet-residence",
    name: "Chalet Residence",
    category: "Residences",
    baseRate: 1480,
    sleeps: 6,
    count: 1,
    size: 180,
    bed: "King",
    bedLabel: "Two kings + bunks",
    view: "Mountain",
    amenities: ["Terrace", "Sauna", "Kitchen", "Fireplace"],
    highlights: ["Private sauna", "Kitchen", "Terrace", "Fireplace"],
    description:
      "A standalone chalet among the pines, with a private sauna, a full kitchen and a terrace facing the peaks — a house of your own by the lake.",
    summary: "180 m² · 6 guests · private entrance · sauna",
    rank: 4,
    badge: { label: "Residence", tone: "dark" },
    photoCount: 12,
    image: {
      src: `${commons}/thumb/e/e7/La_Cord%C3%A9e_des_Alpes_Prestige_Suite.jpg/1280px-La_Cord%C3%A9e_des_Alpes_Prestige_Suite.jpg`,
      alt: "A chalet living room: sofas round a log fire in a stone fireplace, snow at the windows",
      credit: {
        author: "Moutonnoir2200",
        license: "CC BY-SA 4.0",
        href: "https://commons.wikimedia.org/wiki/File:La_Cord%C3%A9e_des_Alpes_Prestige_Suite.jpg",
      },
    },
  },
  {
    id: "family-suite",
    name: "Family Suite",
    category: "Suites",
    baseRate: 740,
    sleeps: 4,
    count: 3,
    size: 84,
    bed: "King",
    bedLabel: "King + bunks",
    view: "Garden",
    amenities: ["Balcony"],
    highlights: ["Balcony", "Two bathrooms", "Connecting"],
    description:
      "Two bedrooms (bunk beds in the children's), two bathrooms and a connecting lounge — made for families who travel close.",
    summary: "84 m² · 4 guests · garden view · two bedrooms",
    rank: 5,
    photoCount: 7,
    image: {
      src: `${commons}/thumb/f/fb/Efteling_Loonsche_Land_Hotel_themed_room_water_-_bunk_beds.jpg/1280px-Efteling_Loonsche_Land_Hotel_themed_room_water_-_bunk_beds.jpg`,
      alt: "The children's corner: a wooden bunk bed against an olive-green wall",
      credit: {
        author: "Eliedion",
        license: "CC BY-SA 4.0",
        href: "https://commons.wikimedia.org/wiki/File:Efteling_Loonsche_Land_Hotel_themed_room_water_-_bunk_beds.jpg",
      },
    },
  },
  {
    id: "deluxe-alpine-room",
    name: "Deluxe Alpine Room",
    category: "Rooms",
    baseRate: 420,
    sleeps: 2,
    count: 14,
    size: 42,
    bed: "King",
    bedLabel: "King bed",
    view: "Mountain",
    amenities: [],
    highlights: ["Nespresso", "Rainfall shower", "Minibar"],
    description: "A warm, timber-lined room with a wall of glass framing the peaks beyond.",
    summary: "42 m² · 2 guests · mountain view · king bed",
    rank: 6,
    photoCount: 5,
    image: {
      src: `${commons}/thumb/3/39/Room_with_a_view_at_Giardino_Mountain_hotel_Saint_Moritz_-_panoramio.jpg/1280px-Room_with_a_view_at_Giardino_Mountain_hotel_Saint_Moritz_-_panoramio.jpg`,
      alt: "A bed with a quilted headboard against a timber wall, glass doors onto a snowy peak",
      credit: {
        author: "Walter Schärer",
        license: "CC BY-SA 3.0",
        href: "https://commons.wikimedia.org/wiki/File:Room_with_a_view_at_Giardino_Mountain_hotel_Saint_Moritz_-_panoramio.jpg",
      },
    },
  },
  {
    id: "deluxe-twin",
    name: "Deluxe Twin",
    category: "Rooms",
    baseRate: 400,
    sleeps: 2,
    count: 10,
    size: 44,
    bed: "Twin",
    bedLabel: "Twin beds",
    view: "Garden",
    amenities: [],
    highlights: ["Nespresso", "Rainfall shower", "Garden access"],
    description: "The same warmth in a twin layout, looking out over the garden to the wooded hillside.",
    summary: "44 m² · 2 guests · garden view · twin beds",
    rank: 7,
    photoCount: 4,
    image: {
      src: `${commons}/thumb/9/9f/Relaxia_Mineyama_Kogen_Hotel_Kamikawa_Hyogo_pref23n4272.jpg/1280px-Relaxia_Mineyama_Kogen_Hotel_Kamikawa_Hyogo_pref23n4272.jpg`,
      alt: "A twin room with rattan armchairs and a window onto a wooded hillside",
      credit: {
        author: "663highland",
        license: "CC BY 2.5",
        href: "https://commons.wikimedia.org/wiki/File:Relaxia_Mineyama_Kogen_Hotel_Kamikawa_Hyogo_pref23n4272.jpg",
      },
    },
  },
  {
    id: "garden-studio",
    name: "Garden Studio",
    category: "Rooms",
    baseRate: 360,
    sleeps: 2,
    count: 6,
    size: 36,
    bed: "Queen",
    bedLabel: "Queen bed",
    view: "Garden",
    amenities: [],
    highlights: ["Nespresso", "Rainfall shower"],
    description:
      "An intimate studio at garden level, its door open onto the meadow — our simplest way to wake by the lake.",
    summary: "36 m² · 2 guests · garden view · queen bed",
    rank: 8,
    photoCount: 4,
    image: {
      src: `${commons}/thumb/0/0e/ITA_Brunico%2C_Hotel_Falkensteiner_028.jpg/1280px-ITA_Brunico%2C_Hotel_Falkensteiner_028.jpg`,
      alt: "A compact room in golden light, the balcony door open onto a meadow garden and a wooded ridge",
      position: "20% 50%",
      credit: {
        author: "-wuppertaler",
        license: "CC BY-SA 4.0",
        href: "https://commons.wikimedia.org/wiki/File:ITA_Brunico,_Hotel_Falkensteiner_028.jpg",
      },
    },
  },
];

const byId = new Map(rooms.map((room) => [room.id, room]));

export function getRoom(id: RoomId): RoomType {
  const room = byId.get(id);
  if (!room) throw new Error(`Unknown room type: ${id}`);
  return room;
}

export function isRoomId(value: string): value is RoomId {
  return byId.has(value as RoomId);
}

/** Lowest shoulder-season rate across the catalogue. */
export const lowestBaseRate = Math.min(...rooms.map((room) => room.baseRate));

/** Lowest nightly rate any room is ever quoted at: the site-wide "from €X". */
export const lowestFromRate = fromRate(lowestBaseRate);

/** Rooms and suites in the hotel, all types together — the "42" quoted across the site. */
export const totalRooms = rooms.reduce((sum, room) => sum + room.count, 0);
