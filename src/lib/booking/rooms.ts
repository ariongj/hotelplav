/**
 * Room catalogue — the single source of truth for room types, capacity and
 * base rates. Base rates are shoulder-season EUR per night, including
 * breakfast, thermal spa and taxes (design/README.md › Booking engine).
 *
 * When the PMS is connected, rates and inventory come from it; this file
 * keeps the marketing content (copy, photos, amenities).
 */

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
export type RoomView = "Valley" | "Lake" | "Garden" | "Panorama" | "Mountain";
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
  /** m² */
  size: number;
  bed: BedType;
  /** "King bed", "King + bunks" … */
  bedLabel: string;
  view: RoomView;
  amenities: readonly FilterAmenity[];
  /** Chips shown on the room card. */
  highlights: readonly string[];
  description: string;
  /** One-line summary used in booking results: "42 m² · 2 guests · valley view · king bed". */
  summary: string;
  /** Default order on the rooms page ("Recommended"). */
  rank: number;
  badge?: { label: string; tone: "gold" | "dark" };
  /** Number of photos in the room's gallery (card counter). */
  photoCount: number;
  image: { src: string; alt: string };
};

const wix = (id: string, w: number, h: number) =>
  `https://static.wixstatic.com/media/${id}/v1/fill/w_${w},h_${h},al_c,q_85,enc_avif,quality_auto/${id}`;

export const rooms: readonly RoomType[] = [
  {
    id: "presidential-suite",
    name: "Presidential Suite",
    category: "Suites",
    baseRate: 680,
    sleeps: 3,
    size: 76,
    bed: "King",
    bedLabel: "King bed",
    view: "Panorama",
    amenities: ["Balcony", "Fireplace"],
    highlights: ["Balcony", "Fireplace", "Nespresso", "Smart controls"],
    description:
      "A corner suite with a private balcony over the valley, a fireplace, and light that turns gold at dusk.",
    summary: "76 m² · 3 guests · panorama · balcony",
    rank: 1,
    badge: { label: "Signature", tone: "gold" },
    photoCount: 6,
    image: { src: wix("1de95c_caf15c194f104ecda6e934c4a9f280fa~mv2.jpg", 800, 550), alt: "Presidential Suite" },
  },
  {
    id: "panorama-suite",
    name: "Panorama Suite",
    category: "Suites",
    baseRate: 980,
    sleeps: 4,
    size: 110,
    bed: "King",
    bedLabel: "King bed",
    view: "Panorama",
    amenities: ["Terrace", "Fireplace"],
    highlights: ["Terrace", "Fireplace", "Soaking tub"],
    description: "Our grandest suite: a wraparound terrace, fireplace and a soaking tub set beneath the peaks.",
    summary: "110 m² · 4 guests · terrace · fireplace",
    rank: 2,
    photoCount: 8,
    image: { src: wix("1de95c_072bf1db81bd4227b40d79d328c61bcf~mv2.jpg", 800, 550), alt: "Panorama Suite" },
  },
  {
    id: "junior-suite",
    name: "Junior Suite",
    category: "Suites",
    baseRate: 560,
    sleeps: 2,
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
    image: { src: wix("f9d3d7_b639006d90ee42128eea2062999299ee~mv2.jpg", 800, 550), alt: "Junior Suite" },
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
    size: 180,
    bed: "King",
    bedLabel: "King + bunks",
    view: "Mountain",
    amenities: ["Terrace", "Sauna", "Kitchen", "Fireplace"],
    highlights: ["Private sauna", "Kitchen", "Terrace", "Fireplace"],
    description:
      "A standalone chalet with private sauna, full kitchen and a terrace of its own. The whole mountain, to yourselves.",
    summary: "180 m² · 6 guests · private entrance · sauna",
    rank: 4,
    badge: { label: "Residence", tone: "dark" },
    photoCount: 12,
    image: { src: wix("f9d3d7_54128e2300634fb9b8020ce4a8f8103d~mv2.jpg", 800, 550), alt: "Chalet Residence" },
  },
  {
    id: "family-suite",
    name: "Family Suite",
    category: "Suites",
    baseRate: 740,
    sleeps: 4,
    size: 84,
    bed: "King",
    bedLabel: "King + twin",
    view: "Garden",
    amenities: ["Balcony"],
    highlights: ["Balcony", "Two bathrooms", "Connecting"],
    description: "Two bedrooms, two bathrooms and a connecting lounge — designed for families who travel close.",
    summary: "84 m² · 4 guests · garden view · two bedrooms",
    rank: 5,
    photoCount: 7,
    image: { src: wix("1de95c_da6dacf180bd433788972c2d0b719bcf~mv2.jpg", 800, 550), alt: "Family Suite" },
  },
  {
    id: "deluxe-alpine-room",
    name: "Deluxe Alpine Room",
    category: "Rooms",
    baseRate: 420,
    sleeps: 2,
    size: 42,
    bed: "King",
    bedLabel: "King bed",
    view: "Valley",
    amenities: [],
    highlights: ["Nespresso", "Rainfall shower", "Minibar"],
    description: "A warm, generous room with a picture window framing the valley and the peaks beyond.",
    summary: "42 m² · 2 guests · valley view · king bed",
    rank: 6,
    photoCount: 5,
    image: { src: wix("1de95c_4e2e9d02251244f4b5809e52393e1e0b~mv2.jpg", 800, 550), alt: "Deluxe Alpine Room" },
  },
  {
    id: "deluxe-twin",
    name: "Deluxe Twin",
    category: "Rooms",
    baseRate: 400,
    sleeps: 2,
    size: 44,
    bed: "Twin",
    bedLabel: "Twin beds",
    view: "Garden",
    amenities: [],
    highlights: ["Nespresso", "Rainfall shower", "Garden access"],
    description: "The same warmth in a twin layout, opening onto the quiet of the walled garden.",
    summary: "44 m² · 2 guests · garden view · twin beds",
    rank: 7,
    photoCount: 4,
    image: { src: wix("1de95c_0a26973775ff4331865112ee0b1b6ff7~mv2.jpg", 800, 550), alt: "Deluxe Twin" },
  },
  {
    id: "garden-studio",
    name: "Garden Studio",
    category: "Rooms",
    baseRate: 360,
    sleeps: 2,
    size: 36,
    bed: "Queen",
    bedLabel: "Queen bed",
    view: "Garden",
    amenities: [],
    highlights: ["Nespresso", "Rainfall shower"],
    description: "An intimate studio at garden level — our most understated way to wake in the mountains.",
    summary: "36 m² · 2 guests · garden view · queen bed",
    rank: 8,
    photoCount: 4,
    image: { src: wix("1de95c_90f60c968da246dd9b5fdba3210919d7~mv2.jpg", 800, 550), alt: "Garden Studio" },
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
