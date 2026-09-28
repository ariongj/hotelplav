/**
 * Copy and data for the dining page (design/Dining.dc.html).
 * Photography is placeholder — swap the URLs for the hotel's licensed images.
 */

import { contactHref } from "@/lib/contact-link";

/* ------------------------------------------------------ table reservation */

export const RESERVATION_TIMES = [
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
] as const;

export const DEFAULT_RESERVATION_TIME = "19:00";

export const PARTY_SIZES = ["1 Guest", "2 Guests", "3 Guests", "4 Guests", "5 Guests", "6+ Guests"] as const;

export const DEFAULT_PARTY_SIZE = "2 Guests";

export const ANY_RESTAURANT = "Any restaurant";

export const RESTAURANT_OPTIONS = [ANY_RESTAURANT, "Gjethja", "Opera Lounge", "Magnet Club"] as const;

/* ----------------------------------------------------------------- venues */

export type Venue = {
  kicker: string;
  name: string;
  description: string;
  facts: readonly { label: string; value: string }[];
  /** Secondary link beside "Reserve" — a same-page #hash or a route. */
  link: { label: string; href: string };
  image: { src: string; alt: string };
};

/** Rendered in order; every second venue puts its photo first. */
export const VENUES: readonly Venue[] = [
  {
    kicker: "Signature · Fine dining",
    name: "Gjethja",
    description:
      "Our flagship dining room, set against a breathtaking view of the Sharr Mountains. An à la carte menu of traditional and international cuisine at lunch and dinner — and the chef's seasonal tasting for the table.",
    facts: [
      { label: "Cuisine", value: "Traditional · International" },
      { label: "Dinner", value: "19:00 – 22:30" },
      { label: "Seats", value: "40 · Chef's table 8" },
    ],
    link: { label: "View the menu", href: "#tasting" },
    image: {
      src: "https://static.wixstatic.com/media/1de95c_7865ec1a5c49485daf024463179d5078~mv2.jpg/v1/fill/w_1200,h_900,al_c,q_85,enc_avif,quality_auto/1de95c_7865ec1a5c49485daf024463179d5078~mv2.jpg",
      alt: "Gjethja — plated tasting course, fine dining",
    },
  },
  {
    kicker: "Lounge bar · All day",
    name: "Opera Lounge",
    description:
      "Morning coffee to midnight champagne. Herbal teas, cocktails, local and imported beers, cakes and snacks — and bartenders who know how to make the little joys unforgettable, any hour of the day.",
    facts: [
      { label: "Open", value: "08:00 – 24:00" },
      { label: "Serving", value: "Coffee · Cocktails" },
      { label: "Seats", value: "Lounge seating" },
    ],
    link: { label: "Private events", href: "/events" },
    image: {
      src: "https://static.wixstatic.com/media/f9d3d7_0b2e8110e64b49ffbb15dc298cf193fb~mv2.jpg/v1/fill/w_1200,h_900,al_c,q_85,enc_avif,quality_auto/f9d3d7_0b2e8110e64b49ffbb15dc298cf193fb~mv2.jpg",
      alt: "Opera Lounge — the hotel's all-day lounge bar",
    },
  },
  {
    kicker: "Night club · Exclusive",
    name: "Magnet Night Club",
    description:
      "A private, fun-appointed club of our own. Billiards, darts and ping-pong, attractive cocktails and music — the extraordinary end to a long day of skiing or hiking.",
    facts: [
      { label: "Open", value: "21:00 – 01:00" },
      { label: "Games", value: "Billiards · Darts · Ping-pong" },
      { label: "Drinks", value: "Cocktails & snacks" },
    ],
    link: { label: "See all hours", href: "#hours" },
    image: {
      src: "https://static.wixstatic.com/media/f9d3d7_da33001184424bb386ce7742edf5e2a8~mv2.jpg/v1/fill/w_1200,h_900,al_c,q_85,enc_avif,quality_auto/f9d3d7_da33001184424bb386ce7742edf5e2a8~mv2.jpg",
      alt: "Magnet Night Club — billiards, cocktails, music",
    },
  },
];

/* ------------------------------------------------------ chef's tasting menu */

export const TASTING_MENU_KEYS = ["Seasonal", "Vegetarian", "Pescatarian"] as const;

export type TastingMenuKey = (typeof TASTING_MENU_KEYS)[number];

export const DEFAULT_TASTING_MENU: TastingMenuKey = "Seasonal";

/** Six courses per path, written each week. */
export const TASTING_MENUS: Record<TastingMenuKey, readonly string[]> = {
  Seasonal: [
    "Alpine crudités · cultured butter",
    "Cured lake trout · buttermilk · dill",
    "Smoked celeriac · hazelnut · aged Alpage",
    "Hand-rolled pasta · mountain mushroom · thyme",
    "Venison · juniper · blackberry",
    "Honey & pine · brown-butter ice cream",
  ],
  Vegetarian: [
    "Alpine crudités · cultured butter",
    "Heirloom beet · goat curd · walnut",
    "Smoked celeriac · hazelnut · aged Alpage",
    "Hand-rolled pasta · mountain mushroom · thyme",
    "Charred hispi · fermented chilli · yeast",
    "Honey & pine · brown-butter ice cream",
  ],
  Pescatarian: [
    "Alpine crudités · cultured butter",
    "Cured lake trout · buttermilk · dill",
    "Hand-dived scallop · apple · verbena",
    "Hand-rolled pasta · lake crayfish · thyme",
    "Alpine char · brown butter · capers",
    "Honey & pine · brown-butter ice cream",
  ],
};

export const TASTING_PRICES = [
  { label: "Six courses", value: "€165" },
  { label: "Wine pairing", value: "+ €95" },
] as const;

/* ------------------------------------------------------------------ hours */

export type VenueHours = {
  name: string;
  type: string;
  rows: readonly { label: string; value: string }[];
  /** Dark card (the night club). */
  dark?: boolean;
  link?: { label: string; href: string };
};

export const HOURS: readonly VenueHours[] = [
  {
    name: "Gjethja",
    type: "Restaurant · À la carte",
    rows: [
      { label: "Breakfast", value: "08 – 10:30" },
      { label: "Lunch", value: "12 – 19" },
      { label: "Dinner", value: "19 – 22:30" },
    ],
  },
  {
    name: "Opera Lounge",
    type: "Lounge bar",
    rows: [
      { label: "Open", value: "08 – 24" },
      { label: "Coffee & cakes", value: "All day" },
      { label: "Cocktails", value: "Until late" },
    ],
  },
  {
    name: "Magnet Night Club",
    type: "Night club",
    rows: [
      { label: "Open", value: "21:00 – 01:00" },
      { label: "Billiards & darts", value: "Included" },
    ],
    dark: true,
    // The contact form has no dining topic, so this opens it on "Something else".
    link: { label: "Enquire", href: contactHref({ topic: "other" }) },
  },
];
