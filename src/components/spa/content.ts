/**
 * Copy and data for the spa page (design/Spa.dc.html).
 * Photography is placeholder — swap the URLs for the hotel's licensed images.
 */

/* ------------------------------------------------------ treatment booking */

export const SPA_TIMES = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"] as const;

export const DEFAULT_SPA_TIME = "15:00";

/** Treatments offered in the booking bar (as in the design — a subset of the menu). */
export const BOOKABLE_TREATMENTS = [
  "Signature Alpine Massage",
  "Hot Stone Ritual",
  "Glacial Botanical Facial",
  "Thermal Sauna Ritual",
  "Forest Body Wrap",
  "Two-Day Wellness Retreat",
] as const;

export const SPA_GUESTS = ["1 Guest", "2 Guests"] as const;

/* ---------------------------------------------------------- thermal baths */

export const BATH_FEATURES = [
  "Pools · Adults & children",
  "Finnish sauna · 90°",
  "Steam room",
  "Cold-water pool",
  "Massage center",
  "Fitness studio",
] as const;

export const BATH_STATS = [
  { value: "1,100", label: "m altitude" },
  { value: "3", label: "Pools" },
  { value: "08–22", label: "Open daily" },
] as const;

/* ------------------------------------------------------------- treatments */

export const TREATMENT_CATEGORIES = ["Massage", "Facial", "Body", "Thermal", "Retreats"] as const;

export type TreatmentCategory = (typeof TREATMENT_CATEGORIES)[number];

export const TREATMENT_SORTS = ["Recommended", "Price ↑", "Price ↓", "Duration"] as const;

export type TreatmentSort = (typeof TREATMENT_SORTS)[number];

export type Treatment = {
  id: string;
  name: string;
  category: TreatmentCategory;
  /** Kicker above the name, when it differs from the category. */
  kicker?: string;
  /** EUR. */
  price: number;
  /** Length in minutes, for sorting by duration. */
  minutes: number;
  /** Label on the photo. */
  duration: string;
  /** Position in the "Recommended" order. */
  rank: number;
  badge?: string;
  description: string;
  image: string;
  /** Dark card, gold button (the retreat). */
  dark?: boolean;
};

export const TREATMENTS: readonly Treatment[] = [
  {
    id: "signature-alpine-massage",
    name: "Signature Alpine Massage",
    category: "Massage",
    price: 185,
    minutes: 80,
    duration: "80 min",
    rank: 1,
    badge: "Signature",
    description: "Warm alpine oils and long, grounding strokes to release the mountains from your shoulders.",
    image:
      "https://static.wixstatic.com/media/1de95c_4a4d5d4db4cd4e75a9012191010d5218~mv2.jpg/v1/fill/w_800,h_500,al_c,q_85,enc_avif,quality_auto/1de95c_4a4d5d4db4cd4e75a9012191010d5218~mv2.jpg",
  },
  {
    id: "deep-tissue-recovery",
    name: "Deep Tissue Recovery",
    category: "Massage",
    price: 150,
    minutes: 60,
    duration: "60 min",
    rank: 4,
    description: "Focused, firm work for tired legs and backs — made for the day after the slopes.",
    image:
      "https://static.wixstatic.com/media/f9d3d7_7313371891564ee0acd22c9eecf0e2fc~mv2.jpg/v1/fill/w_800,h_500,al_c,q_85,enc_avif,quality_auto/f9d3d7_7313371891564ee0acd22c9eecf0e2fc~mv2.jpg",
  },
  {
    id: "hot-stone-ritual",
    name: "Hot Stone Ritual",
    category: "Massage",
    price: 210,
    minutes: 90,
    duration: "90 min",
    rank: 5,
    description: "Warmed river stones and slow pressure — the deepest kind of stillness.",
    image:
      "https://static.wixstatic.com/media/1de95c_fe69aecf6c0a4c3e89f1b8d5afc6d93b~mv2.jpg/v1/fill/w_800,h_500,al_c,q_85,enc_avif,quality_auto/1de95c_fe69aecf6c0a4c3e89f1b8d5afc6d93b~mv2.jpg",
  },
  {
    id: "glacial-botanical-facial",
    name: "Glacial Botanical Facial",
    category: "Facial",
    price: 150,
    minutes: 60,
    duration: "60 min",
    rank: 3,
    description: "Cool mountain botanicals and glacial water to wake the skin and calm the mind.",
    image:
      "https://static.wixstatic.com/media/1de95c_424350ad23d241d988255f926572dd10~mv2.jpg/v1/fill/w_800,h_500,al_c,q_85,enc_avif,quality_auto/1de95c_424350ad23d241d988255f926572dd10~mv2.jpg",
  },
  {
    id: "radiance-alpine-facial",
    name: "Radiance Alpine Facial",
    category: "Facial",
    price: 175,
    minutes: 75,
    duration: "75 min",
    rank: 6,
    description: "A lifting, brightening ritual with mountain-herb serums and a lymphatic massage.",
    image:
      "https://static.wixstatic.com/media/f9d3d7_d9f5264f63fb46e8b4fa9c093c43dd22~mv2.jpg/v1/fill/w_800,h_500,al_c,q_85,enc_avif,quality_auto/f9d3d7_d9f5264f63fb46e8b4fa9c093c43dd22~mv2.jpg",
  },
  {
    id: "forest-body-wrap",
    name: "Forest Body Wrap",
    category: "Body",
    price: 165,
    minutes: 70,
    duration: "70 min",
    rank: 7,
    description: "A warm pine-and-spruce cocoon that softens the skin and quiets the whole body.",
    image:
      "https://static.wixstatic.com/media/1de95c_4a4d5d4db4cd4e75a9012191010d5218~mv2.jpg/v1/fill/w_800,h_500,al_c,q_85,enc_avif,quality_auto/1de95c_4a4d5d4db4cd4e75a9012191010d5218~mv2.jpg",
  },
  {
    id: "thermal-sauna-ritual",
    name: "Thermal Sauna Ritual",
    category: "Thermal",
    price: 90,
    minutes: 45,
    duration: "45 min",
    rank: 2,
    description: "A guided löyly circuit — sauna, herbal steam and cold plunge, led by our bath master.",
    image:
      "https://static.wixstatic.com/media/1de95c_03adb94268124caf858cfba9e9710b7b~mv2.jpg/v1/fill/w_800,h_500,al_c,q_85,enc_avif,quality_auto/1de95c_03adb94268124caf858cfba9e9710b7b~mv2.jpg",
  },
  {
    id: "two-day-wellness-retreat",
    name: "Two-Day Wellness Retreat",
    category: "Retreats",
    kicker: "Retreat",
    price: 620,
    minutes: 2880,
    duration: "2 days",
    rank: 8,
    badge: "Retreat",
    description: "Two massages, a facial, daily thermal access and a private movement session — reset, completely.",
    image:
      "https://static.wixstatic.com/media/f9d3d7_8e43ab231f06460bb4c777f660a4ef54~mv2.jpg/v1/fill/w_800,h_500,al_c,q_85,enc_avif,quality_auto/f9d3d7_8e43ab231f06460bb4c777f660a4ef54~mv2.jpg",
    dark: true,
  },
];

/* --------------------------------------------------------- bathing ritual */

export const RITUAL_STEPS = [
  { title: "Warm", text: "Ten minutes in the Finnish sauna to open and soften." },
  { title: "Steam", text: "Move to the herbal steam room and breathe the mountain in." },
  { title: "Plunge", text: "A brief, bright dip in the cold-water pool to wake the blood." },
  { title: "Rest", text: "Wrap up in the relaxation loft with alpine tea. Then begin again." },
] as const;

/* --------------------------------------------------------------- 360 tour */

/** Deep links into scenes of the virtual tour. */
export const TOUR_SCENES = [
  { name: "The Grand Hall", href: "/tour#hall" },
  { name: "The Alpine Room", href: "/tour#room" },
  { name: "The Sharr Valley", href: "/tour#valley" },
] as const;
