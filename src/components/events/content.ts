/**
 * Copy and imagery for the Events & Weddings page (design/Events.dc.html).
 * Photography is placeholder — swap in the hotel's licensed images.
 */

import { contactHref } from "@/lib/contact-link";

/** Every "enquire" link on the page opens the contact form on the events topic. */
export const eventsEnquiryHref = contactHref({ topic: "events" });

export const chapelTourHref = "/tour#chapel";

export type EventImage = { src: string; alt: string };

export const images = {
  hero: {
    src: "https://static.wixstatic.com/media/1de95c_491862344bf74e00b37b650f8249e6a8~mv2.jpg/v1/fill/w_1920,h_1080,al_c,q_85,enc_avif,quality_auto/1de95c_491862344bf74e00b37b650f8249e6a8~mv2.jpg",
    alt: "A celebration table set by candlelight beneath a mountain window",
  },
  // The prototype leaves this slot empty; this is the home page's
  // "Wedding / banquet — mountain terrace at dusk" photo.
  wedding: {
    src: "https://static.wixstatic.com/media/1de95c_aa8eaafdd55b4978a19a78a2cd03506d~mv2.jpg/v1/fill/w_900,h_675,al_c,q_85,enc_avif,quality_auto/1de95c_aa8eaafdd55b4978a19a78a2cd03506d~mv2.jpg",
    alt: "A wedding celebration on the mountain terrace at dusk",
  },
  corporate: {
    src: "https://static.wixstatic.com/media/1de95c_23d1c6f843b14ab7b1fbf724cd1ad230~mv2.jpg/v1/fill/w_1200,h_900,al_c,q_85,enc_avif,quality_auto/1de95c_23d1c6f843b14ab7b1fbf724cd1ad230~mv2.jpg",
    alt: "The boardroom — a long table beside a mountain window",
  },
} satisfies Record<string, EventImage>;

export const weddingFacts = [
  { label: "Ceremony", value: "Chapel or open-air" },
  { label: "Guests", value: "20 – 300" },
  { label: "Wedding suite", value: "Complimentary night" },
] as const;

export type Venue = {
  name: string;
  text: string;
  meta: string;
  image: EventImage;
  /** Link into the 360° tour, shown beside the capacity line. */
  tour?: { label: string; href: string };
};

export const venues: readonly Venue[] = [
  {
    name: "The Chapel",
    text: "Stone arches and long mountain light — civil and religious ceremonies, year-round.",
    meta: "220 seated · Ceremonies",
    // Empty slot in the prototype; this is the chapel scene of the 360° tour.
    image: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Soissons_Cathedral_Interior_360x180,_Picardy,_France_-_Diliff.jpg/3840px-Soissons_Cathedral_Interior_360x180,_Picardy,_France_-_Diliff.jpg",
      alt: "The chapel — stone arches above a long aisle",
    },
    tour: { label: "Step inside in 360° →", href: chapelTourHref },
  },
  {
    name: "The Grand Ballroom",
    text: "Nine-metre ceilings, a private entrance and a dance floor that has seen sunrise more than once.",
    meta: "300 banquet · Live music",
    image: {
      src: "https://static.wixstatic.com/media/f9d3d7_54128e2300634fb9b8020ce4a8f8103d~mv2.jpg/v1/fill/w_900,h_675,al_c,q_85,enc_avif,quality_auto/f9d3d7_54128e2300634fb9b8020ce4a8f8103d~mv2.jpg",
      alt: "The Grand Ballroom — long tables beneath chandeliers",
    },
  },
  {
    name: "The Panorama Terrace",
    text: "Open sky, the full ridgeline, blankets and braziers after dark — aperitifs to fireworks.",
    meta: "150 cocktail · May — Oct",
    image: {
      src: "https://static.wixstatic.com/media/1de95c_90f60c968da246dd9b5fdba3210919d7~mv2.jpg/v1/fill/w_900,h_675,al_c,q_85,enc_avif,quality_auto/1de95c_90f60c968da246dd9b5fdba3210919d7~mv2.jpg",
      alt: "The Panorama Terrace at dusk, lanterns lit against the ridgeline",
    },
  },
];

export const corporatePoints = [
  "Boardroom & two breakout salons, full AV and fibre",
  "Group rates across 48 rooms & suites, one invoice",
  "Guided hikes, ski days and shepherd’s-table dinners for teams",
] as const;

export const planningSteps = [
  {
    title: "The conversation",
    text: "Date, guest count, the feeling you’re after. A held date and outline proposal within 48 hours.",
  },
  {
    title: "Tasting & walkthrough",
    text: "A night at the hotel: menus tasted, venues walked, timings agreed — or start from the 360° tour.",
  },
  {
    title: "The day itself",
    text: "Your planner on the floor from first delivery to last car — you are a guest at your own event.",
  },
] as const;

/** Reveal delays for the three-up grids, as in the prototype. */
export const staggerDelays = [undefined, "80", "160"] as const;

/** "01", "02" … */
export function stepNumber(index: number): string {
  return String(index + 1).padStart(2, "0");
}
