/**
 * Copy and data for the dining page.
 * Photography is placeholder — swap the URLs for the hotel's licensed images.
 */

import { contactHref } from "@/lib/contact-link";
import { euro } from "@/lib/format";

/* ------------------------------------------------------------------- hero */

export const HERO_IMAGE = {
  src: "https://static.wixstatic.com/media/1de95c_23d1c6f843b14ab7b1fbf724cd1ad230~mv2.jpg/v1/fill/w_1920,h_1080,al_c,q_85,enc_avif,quality_auto/1de95c_23d1c6f843b14ab7b1fbf724cd1ad230~mv2.jpg",
  alt: "A shrimp starter and two glasses of sparkling wine, snowy forested mountains beyond the window",
};

/* ---------------------------------------------------------- opening times */

/** The restaurant — the only venue that takes table requests. */
export const LAKE_ROOM = "The Lake Room";
const LOUNGE = "The Fireside Lounge";
const BAR = "The Boathouse Bar";

/**
 * Opening times, shared by the venue cards, the hours cards and the table
 * request's time slots. `lastTable` is the last slot offered in the form.
 */
const OPENING = {
  breakfast: { open: "07:30", close: "10:30" },
  lunch: { open: "12:00", close: "15:00", lastTable: "14:00" },
  dinner: { open: "18:30", close: "22:30", lastTable: "21:00" },
  lounge: { open: "08:00", close: "24:00" },
  bar: { open: "21:00", close: "01:00" },
} as const;

/** "18:30 – 22:30". */
function span({ open, close }: { open: string; close: string }): string {
  return `${open} – ${close}`;
}

/** The lake terrace: The Lake Room's tables outside, in the warm months. */
const TERRACE_SEASON = "May – Oct";

/** Months (1–12) the lake terrace is open. */
export const TERRACE_MONTHS: readonly number[] = [5, 6, 7, 8, 9, 10];

/* ------------------------------------------------------ table reservation */

function toMinutes(time: string): number {
  const [hours = 0, minutes = 0] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/** Every half hour from `from` to `to`, e.g. "12:00", "12:30" … "14:00". */
function halfHours(from: string, to: string): string[] {
  const times: string[] = [];
  for (let t = toMinutes(from); t <= toMinutes(to); t += 30) {
    times.push(`${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`);
  }
  return times;
}

/** Table-request slots, grouped by service — only inside The Lake Room's lunch and dinner hours. */
export const RESERVATION_SLOTS = [
  { service: "Lunch", times: halfHours(OPENING.lunch.open, OPENING.lunch.lastTable) },
  { service: "Dinner", times: halfHours(OPENING.dinner.open, OPENING.dinner.lastTable) },
] as const;

export const DEFAULT_RESERVATION_TIME = "19:00";

export const PARTY_SIZES = ["1 Guest", "2 Guests", "3 Guests", "4 Guests", "5 Guests", "6+ Guests"] as const;

export const DEFAULT_PARTY_SIZE = "2 Guests";

/** Where in The Lake Room a request asks to sit. Short enough to fit the half-width select on a phone. */
export const TABLE_OPTIONS = ["Any table", "Inside", "Terrace", "Chef's table"] as const;

export type TableOption = (typeof TABLE_OPTIONS)[number];

/** How each choice opens the confirmation: "A table on the lake terrace for 2 guests at The Lake Room, …". */
export const TABLE_PHRASES: Record<TableOption, string> = {
  "Any table": "A table",
  Inside: "A table inside",
  Terrace: "A table on the lake terrace",
  "Chef's table": "The chef's table",
};

/* -------------------------------------------------------------- the table */

/**
 * What the kitchen cooks from. The dishes and produce are those the Plav and
 * Gusinje area is known for (trout from the lake, kajmak, cicvara, mountain
 * honey, and the blueberries Plav celebrates each summer).
 */
export const PROVENANCE = [
  {
    kicker: "From the water",
    title: "Lake trout",
    text: "Lake Plav, fed by the Ljuča, is trout water — grayling and pike too. We grill it simply, or cure it with dill and buttermilk.",
  },
  {
    kicker: "From the pastures",
    title: "Kajmak, cheese & honey",
    text: "The dairy of the high meadows and honey from the slopes — in cicvara, on warm bread and in our desserts.",
  },
  {
    kicker: "From the slopes",
    title: "Wild blueberries",
    text: "The pride of the region, celebrated in Plav every summer. Expect them in desserts, cordials and the odd sauce.",
  },
] as const;

/* ----------------------------------------------------------------- venues */

export type Venue = {
  kicker: string;
  name: string;
  /** Takes table requests through the #reserve form. The others are walk-in. */
  bookable?: boolean;
  description: string;
  facts: readonly { label: string; value: string }[];
  /** Secondary link beside "Reserve" — a same-page #hash or a route. */
  link?: { label: string; href: string };
  image: { src: string; alt: string };
  /** Night-time venue: rendered as a dark card. */
  dark?: boolean;
};

/**
 * A restaurant, a lounge and a bar, plus the lake terrace. The first venue is
 * the wide feature card; the others sit side by side below it.
 */
export const VENUES: readonly Venue[] = [
  {
    kicker: "Restaurant · Chef's menu",
    name: LAKE_ROOM,
    bookable: true,
    description:
      "Our restaurant, with the lake and the mountains beyond the glass. Breakfast, then an à la carte menu of Montenegrin and international cooking at lunch and dinner — and the chef's six-course menu for the table. From May to October, lunch and dinner move out onto the lake terrace too.",
    facts: [
      { label: "Dinner", value: span(OPENING.dinner) },
      { label: "Seats", value: "40 · Chef's table 8" },
      { label: "Lake terrace", value: TERRACE_SEASON },
    ],
    link: { label: "See the chef's menu", href: "#tasting" },
    image: {
      src: "https://static.wixstatic.com/media/1de95c_7865ec1a5c49485daf024463179d5078~mv2.jpg/v1/fill/w_1200,h_900,al_c,q_85,enc_avif,quality_auto/1de95c_7865ec1a5c49485daf024463179d5078~mv2.jpg",
      alt: "The Lake Room — a bright dining room with chandeliers and a brick fireplace",
    },
  },
  {
    kicker: "Lounge & wine bar · All day",
    name: LOUNGE,
    description:
      "Morning coffee to a nightcap. Herbal teas and cakes, wine by the glass from the wall of bottles, cocktails and local beers — just walk in and find a chair.",
    facts: [
      { label: "Open", value: span(OPENING.lounge) },
      { label: "Serving", value: "Coffee · Wine · Cocktails" },
    ],
    image: {
      src: "https://static.wixstatic.com/media/f9d3d7_0b2e8110e64b49ffbb15dc298cf193fb~mv2.jpg/v1/fill/w_1200,h_900,al_c,q_85,enc_avif,quality_auto/f9d3d7_0b2e8110e64b49ffbb15dc298cf193fb~mv2.jpg",
      alt: "The Fireside Lounge — tables before a glass-fronted wine and spirits wall",
    },
  },
  {
    kicker: "Late bar · After dark",
    name: BAR,
    description:
      "Our late bar by the water: a billiards table, good cocktails and local beers — the easy end to a day on the trails or out on the lake.",
    facts: [
      { label: "Open", value: span(OPENING.bar) },
      { label: "Games", value: "Billiards" },
    ],
    image: {
      src: "https://static.wixstatic.com/media/f9d3d7_da33001184424bb386ce7742edf5e2a8~mv2.jpg/v1/fill/w_1200,h_900,al_c,q_85,enc_avif,quality_auto/f9d3d7_da33001184424bb386ce7742edf5e2a8~mv2.jpg",
      alt: "The Boathouse Bar — a billiards table under low lamps",
    },
    dark: true,
  },
];

/* ------------------------------------------------------ chef's tasting menu */

export const TASTING_MENU_KEYS = ["Seasonal", "Vegetarian", "Pescatarian"] as const;

export type TastingMenuKey = (typeof TASTING_MENU_KEYS)[number];

export const DEFAULT_TASTING_MENU: TastingMenuKey = "Seasonal";

/** One line under the tabs, describing each path. */
export const TASTING_NOTES: Record<TastingMenuKey, string> = {
  Seasonal: "The full journey — water, pasture and forest.",
  Vegetarian: "Garden, dairy and forest. No meat or fish.",
  Pescatarian: "From the lake, with no meat.",
};

/** Six courses per path, written each week. */
export const TASTING_MENUS: Record<TastingMenuKey, readonly string[]> = {
  Seasonal: [
    "Warm cornbread · kajmak · wild herbs",
    "Cured lake trout · buttermilk · dill",
    "Cicvara · mountain cheese · brown butter",
    "Hand-rolled pasta · forest mushroom · thyme",
    "Lamb · juniper · smoked onion",
    "Blueberry · mountain honey · buttermilk ice cream",
  ],
  Vegetarian: [
    "Warm cornbread · kajmak · wild herbs",
    "Heirloom beetroot · goat curd · walnut",
    "Cicvara · mountain cheese · brown butter",
    "Hand-rolled pasta · forest mushroom · thyme",
    "Charred cabbage · fermented chilli · kajmak",
    "Blueberry · mountain honey · buttermilk ice cream",
  ],
  Pescatarian: [
    "Warm cornbread · kajmak · wild herbs",
    "Cured lake trout · buttermilk · dill",
    "Cicvara · mountain cheese · brown butter",
    "Smoked trout · beetroot · horseradish",
    "Grilled trout · brown butter · capers",
    "Blueberry · mountain honey · buttermilk ice cream",
  ],
};

/** EUR per guest: the six courses, and the optional wine pairing. */
export const TASTING_PRICE = 165;
export const PAIRING_PRICE = 95;

export const TASTING_PRICES = [
  { label: "Six courses", value: euro(TASTING_PRICE) },
  { label: "Wine pairing", value: `+ ${euro(PAIRING_PRICE)}` },
] as const;

/* ------------------------------------------------------------------ hours */

export type VenueHours = {
  name: string;
  type: string;
  rows: readonly { label: string; value: string }[];
  /** Dark card (the late bar). */
  dark?: boolean;
  /** Takes table requests: the card links to the #reserve form. The others are walk-in. */
  bookable?: boolean;
  link?: { label: string; href: string };
};

export const HOURS: readonly VenueHours[] = [
  {
    name: LAKE_ROOM,
    type: "Restaurant · À la carte",
    rows: [
      { label: "Breakfast", value: span(OPENING.breakfast) },
      { label: "Lunch", value: span(OPENING.lunch) },
      { label: "Dinner", value: span(OPENING.dinner) },
      { label: "Lake terrace", value: TERRACE_SEASON },
    ],
    bookable: true,
  },
  {
    name: LOUNGE,
    type: "Lounge & wine bar",
    rows: [
      { label: "Open", value: span(OPENING.lounge) },
      { label: "Coffee & cakes", value: "All day" },
      { label: "Cocktails", value: "Until late" },
    ],
  },
  {
    name: BAR,
    type: "Late bar",
    rows: [
      { label: "Open", value: span(OPENING.bar) },
      { label: "Billiards", value: "Included" },
    ],
    dark: true,
    link: { label: "Enquire", href: contactHref({ topic: "dining" }) },
  },
];

/* ---------------------------------------------------------- private dining */

export const PRIVATE_OCCASIONS = [
  "In-suite dinners",
  "Birthdays & anniversaries",
  "Long family tables",
  "Wine pairings",
] as const;
