/**
 * Copy and imagery for the Events & weddings page.
 * Commons photos must keep their credit line; the Wix interiors are
 * placeholders — swap in the hotel's licensed images.
 */

import type { Credit as PhotoCredit } from "@/components/ui/PhotoCredit";
import { getRoom } from "@/lib/booking/rooms";
import { contactHref } from "@/lib/contact-link";

/** Every "enquire" link on the page opens the contact form on the events topic. */
export const eventsEnquiryHref = contactHref({ topic: "events" });

export const chapelTourHref = "/tour#chapel";

export type EventImage = { src: string; alt: string; position?: string; credit?: PhotoCredit };

const commons = "https://upload.wikimedia.org/wikipedia/commons";
const romanenko = (file: string): PhotoCredit => ({
  author: "Андрей Романенко",
  license: "CC BY-SA 4.0",
  href: `https://commons.wikimedia.org/wiki/File:${file}`,
});

export const images = {
  hero: {
    src: `${commons}/thumb/c/c0/Plav_Lake_in_Montenegro_02.jpg/1920px-Plav_Lake_in_Montenegro_02.jpg`,
    alt: "Lake Plav perfectly still under a wide sky, the mountains mirrored in the water",
    credit: romanenko("Plav_Lake_in_Montenegro_02.jpg"),
  },
  wedding: {
    src: `${commons}/thumb/a/a3/Plav_Lake_in_Montenegro_01.jpg/1920px-Plav_Lake_in_Montenegro_01.jpg`,
    alt: "The town and hills of Plav reflected in the lake on a clear morning",
    position: "42% 50%",
    credit: romanenko("Plav_Lake_in_Montenegro_01.jpg"),
  },
  // "Time outside" — the lake and mountains the team comes for.
  corporate: {
    src: `${commons}/d/d6/Visitor_mountain.jpg`,
    alt: "Visitor mountain rising from the calm water of Lake Plav",
    credit: {
      author: "DrVanDerDoom",
      license: "CC0",
      href: "https://commons.wikimedia.org/wiki/File:Visitor_mountain.jpg",
    },
  },
} satisfies Record<string, EventImage>;

/** The suite in the wedding offer — named from the room catalogue. */
const weddingSuite = getRoom("presidential-suite").name;

/** Big-number cards beside the wedding story. */
export const weddingStats = [
  { value: "20–300", label: "guests, from intimate to grand" },
  { value: "3", label: "venues, a short, level walk apart" },
  { value: "1", label: "planner, first call to last dance" },
  { value: "1 night", label: `in the ${weddingSuite}, on us` },
] as const;

export type Venue = {
  name: string;
  text: string;
  /** Headline capacity, shown on the photo. */
  capacity: string;
  /** Small tags under the text. */
  tags: readonly string[];
  image: EventImage;
  /** Link into the 360° tour. */
  tour?: { label: string; href: string };
};

export const venues: readonly Venue[] = [
  {
    name: "The Chapel",
    text: "Stone arches and long, soft light, a short, level walk from the hotel — civil and religious ceremonies, year-round.",
    capacity: "220 seated",
    tags: ["Ceremonies", "Year-round"],
    // A flat placeholder; the 360° tour keeps its own chapel panorama.
    image: {
      src: `${commons}/thumb/6/63/Ely_Cathedral_Lady_Chapel%2C_Cambridgeshire%2C_UK_-_Diliff.jpg/1280px-Ely_Cathedral_Lady_Chapel%2C_Cambridgeshire%2C_UK_-_Diliff.jpg`,
      alt: "A pale stone chapel under a vaulted ceiling, filled with light from tall windows",
      credit: {
        author: "Diliff",
        license: "CC BY-SA 3.0",
        href: "https://commons.wikimedia.org/wiki/File:Ely_Cathedral_Lady_Chapel,_Cambridgeshire,_UK_-_Diliff.jpg",
      },
    },
    tour: { label: "Step inside in 360°", href: chapelTourHref },
  },
  {
    name: "The Grand Ballroom",
    text: "Nine-metre ceilings, a private entrance and a dance floor that has seen sunrise more than once.",
    capacity: "300 banquet",
    tags: ["Dinners", "Live music"],
    image: {
      src: "https://static.wixstatic.com/media/1de95c_90f60c968da246dd9b5fdba3210919d7~mv2.jpg/v1/fill/w_900,h_675,al_c,q_85,enc_avif,quality_auto/1de95c_90f60c968da246dd9b5fdba3210919d7~mv2.jpg",
      alt: "Tables dressed in white cloths in a low-lit hall, a bar along one side",
    },
  },
  {
    name: "The Lake Terrace",
    text: "Open-air vows with the water at your feet, then aperitifs under the sky — blankets and braziers after dark.",
    capacity: "150 guests",
    tags: ["Ceremonies", "Receptions", "May–Oct"],
    image: {
      src: `${commons}/thumb/e/eb/Liqeni_i_Plav%C3%ABs.jpg/1280px-Liqeni_i_Plav%C3%ABs.jpg`,
      alt: "Blue water of Lake Plav with the town and green hills on the far shore",
      credit: {
        author: "Planeti",
        license: "CC BY-SA 4.0",
        href: "https://commons.wikimedia.org/wiki/File:Liqeni_i_Plav%C3%ABs.jpg",
      },
    },
  },
];

export const corporatePoints = [
  { title: "Room to think", text: "A boardroom for twenty and two breakout salons, with full AV and fibre." },
  { title: "One invoice", text: "Group rates across our rooms and suites, billed together." },
  { title: "Time outside", text: "Lake mornings, guided hikes and snowshoe outings for the team." },
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

/** Reveal delays for three-up rows. */
export const staggerDelays = [undefined, "80", "160"] as const;

/** "01", "02" … */
export function stepNumber(index: number): string {
  return String(index + 1).padStart(2, "0");
}
