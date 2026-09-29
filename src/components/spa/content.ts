/**
 * Copy and data for the spa page.
 * Photography is placeholder — swap the URLs for the hotel's licensed images.
 */

import type { SceneId } from "@/components/tour/content";

/* ------------------------------------------------------------------- hero */

export const HERO_IMAGE = {
  src: "https://static.wixstatic.com/media/1de95c_424350ad23d241d988255f926572dd10~mv2.jpg/v1/fill/w_1920,h_1080,al_c,q_85,enc_avif,quality_auto/1de95c_424350ad23d241d988255f926572dd10~mv2.jpg",
  alt: "The indoor pool in the evening, loungers along the glass and the forest outside",
};

/* ------------------------------------------------------ treatment booking */

export const SPA_TIMES = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"] as const;

export const DEFAULT_SPA_TIME = "15:00";

export const SPA_GUESTS = ["1 Guest", "2 Guests"] as const;

/** Window event (detail: a treatment name) that pre-selects the treatment in the #book form. */
export const CHOOSE_TREATMENT_EVENT = "plav:choose-treatment";

/* ----------------------------------------------------------- pools & sauna */

export const BATHS_IMAGE = {
  src: "https://static.wixstatic.com/media/1de95c_03adb94268124caf858cfba9e9710b7b~mv2.jpg/v1/fill/w_1000,h_1200,al_c,q_85,enc_avif,quality_auto/1de95c_03adb94268124caf858cfba9e9710b7b~mv2.jpg",
  alt: "The indoor pool, with the forest beyond the glass walls",
};

export const BATH_FEATURES = [
  "Indoor pools for adults & children",
  "Outdoor pool in summer",
  "Finnish sauna",
  "Steam room",
  "Cold plunge pool",
  "Massage rooms",
  "Fitness studio",
] as const;

export const BATH_STATS = [
  { value: "906", unit: "m", label: "Lake Plav above sea level" },
  { value: "3", label: "Pools, indoors and out" },
  { value: "90°", label: "Finnish sauna" },
  { value: "08–22", label: "Open daily to every hotel guest" },
] as const;

/* ------------------------------------------------------------- treatments */

export const TREATMENT_CATEGORIES = ["Massage", "Facial", "Body", "Sauna", "Retreats"] as const;

export type TreatmentCategory = (typeof TREATMENT_CATEGORIES)[number];

export const TREATMENT_SORTS = ["Recommended", "Lowest price", "Highest price", "Longest first"] as const;

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
  /** Placeholder mood photo, shown decoratively — the card's heading names the treatment. */
  image: string;
  /** Dark card, brass button (the retreat). */
  dark?: boolean;
};

/** The guided bathing circuit, offered again under the ritual's steps (see BathingRitual). */
export const GUIDED_RITUAL_ID = "guided-sauna-ritual";

export const TREATMENTS: readonly Treatment[] = [
  {
    id: "signature-lakeside-massage",
    name: "Signature Lakeside Massage",
    category: "Massage",
    price: 185,
    minutes: 80,
    duration: "80 min",
    rank: 1,
    badge: "Signature",
    description: "Warm oils and long, grounding strokes that lift a day on the trails right off your shoulders.",
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
    description: "Focused, firm work for tired legs and backs — made for the day after a long mountain walk.",
    image:
      "https://static.wixstatic.com/media/1de95c_4e2e9d02251244f4b5809e52393e1e0b~mv2.jpg/v1/fill/w_800,h_500,al_c,q_85,enc_avif,quality_auto/1de95c_4e2e9d02251244f4b5809e52393e1e0b~mv2.jpg",
  },
  {
    id: "hot-stone-ritual",
    name: "Hot Stone Ritual",
    category: "Massage",
    price: 210,
    minutes: 90,
    duration: "90 min",
    rank: 5,
    description: "Warmed river stones and slow, even pressure — the deepest kind of stillness.",
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
    description: "Cool compresses and mountain botanicals to wake the skin and quiet the mind.",
    image:
      "https://static.wixstatic.com/media/f9d3d7_b639006d90ee42128eea2062999299ee~mv2.jpg/v1/fill/w_800,h_500,al_c,q_85,enc_avif,quality_auto/f9d3d7_b639006d90ee42128eea2062999299ee~mv2.jpg",
  },
  {
    id: "wild-herb-radiance-facial",
    name: "Wild Herb Radiance Facial",
    category: "Facial",
    price: 175,
    minutes: 75,
    duration: "75 min",
    rank: 6,
    description: "A lifting, brightening ritual with herbal serums and a gentle lymphatic massage.",
    image:
      "https://static.wixstatic.com/media/1de95c_caf15c194f104ecda6e934c4a9f280fa~mv2.jpg/v1/fill/w_800,h_500,al_c,q_85,enc_avif,quality_auto/1de95c_caf15c194f104ecda6e934c4a9f280fa~mv2.jpg",
  },
  {
    id: "forest-body-wrap",
    name: "Forest Body Wrap",
    category: "Body",
    price: 165,
    minutes: 70,
    duration: "70 min",
    rank: 7,
    description: "A warm cocoon of pine, honey and wild blueberry that softens the skin and slows everything down.",
    image:
      "https://static.wixstatic.com/media/1de95c_4a4d5d4db4cd4e75a9012191010d5218~mv2.jpg/v1/fill/w_800,h_500,al_c,q_85,enc_avif,quality_auto/1de95c_4a4d5d4db4cd4e75a9012191010d5218~mv2.jpg",
  },
  {
    id: GUIDED_RITUAL_ID,
    name: "Guided Sauna Ritual",
    category: "Sauna",
    price: 90,
    minutes: 45,
    duration: "45 min",
    rank: 2,
    description: "A guided circuit — sauna, herbal steam and a cold plunge — led by our bath master.",
    image:
      "https://static.wixstatic.com/media/1de95c_fe69aecf6c0a4c3e89f1b8d5afc6d93b~mv2.jpg/v1/fill/w_800,h_500,al_c,q_85,enc_avif,quality_auto/1de95c_fe69aecf6c0a4c3e89f1b8d5afc6d93b~mv2.jpg",
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
    description:
      "Two massages, a facial, daily time in the pools and sauna and a slow morning walk by the lake — reset, completely.",
    image:
      "https://static.wixstatic.com/media/f9d3d7_8e43ab231f06460bb4c777f660a4ef54~mv2.jpg/v1/fill/w_800,h_500,al_c,q_85,enc_avif,quality_auto/f9d3d7_8e43ab231f06460bb4c777f660a4ef54~mv2.jpg",
    dark: true,
  },
];

/** Every treatment on the menu, in recommended order, for the booking card's select. */
export const BOOKABLE_TREATMENTS: readonly string[] = [...TREATMENTS]
  .sort((a, b) => a.rank - b.rank)
  .map((treatment) => treatment.name);

/** EUR — the cheapest treatment, for "Treatments from …". */
export const LOWEST_TREATMENT_PRICE = Math.min(...TREATMENTS.map((treatment) => treatment.price));

/* --------------------------------------------------------- bathing ritual */

/** About 45 minutes in all — the length of the Guided Sauna Ritual. */
export const RITUAL_STEPS = [
  { title: "Warm", time: "15 min", text: "Fifteen minutes in the Finnish sauna to open up and soften." },
  { title: "Steam", time: "10 min", text: "Move to the herbal steam room and slow your breathing right down." },
  { title: "Plunge", time: "Under a minute", text: "A brief, bright dip in the cold plunge pool — lake-cold and wide awake." },
  { title: "Rest", time: "20 min", text: "Wrap up with a mountain-herb tea and let the warmth come back. Then begin again." },
] as const;

/* -------------------------------------------------------------- concierge */

export const CONCIERGE_HELP = [
  "A spa day for one, or for two",
  "Treatments paired with time in the pools",
  "A retreat planned around your stay",
] as const;

/* --------------------------------------------------------------- 360 tour */

/** Scenes of the virtual tour to deep-link to, in order; names and links come from the tour itself. */
export const TOUR_SCENE_IDS: readonly SceneId[] = ["hall", "room", "valley"];
