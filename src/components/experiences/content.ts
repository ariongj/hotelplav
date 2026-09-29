/**
 * Copy and imagery for the Experiences page.
 *
 * Local facts are kept deliberately light and come from the Tourist
 * Organisation Plav (plavto.me/en/tourist-offer), Wikipedia and Montenegro's
 * national tourism site — see the notes beside each item. Landscape photos
 * are from Wikimedia Commons and must keep their credit line; the hotel
 * interiors are placeholders — swap in the hotel's licensed images.
 */

import type { Credit as PhotoCredit } from "@/components/ui/PhotoCredit";
import { contactHref } from "@/lib/contact-link";

export type { PhotoCredit };

/** Every "plan it" link opens the contact form on the general topic. */
export const conciergeHref = contactHref({ topic: "other" });

export type ExperienceImage = {
  src: string;
  alt: string;
  /** CSS object-position for the crop. */
  position?: string;
  credit?: PhotoCredit;
};

export type Experience = {
  title: string;
  /** One line — what you do there. */
  text: string;
  /** Chip: when, and roughly how long. */
  season: string;
  duration: string;
  image: ExperienceImage;
  link?: { label: string; href: string };
};

export type SeasonKey = "summer" | "winter";

export type Season = {
  key: SeasonKey;
  label: string;
  /** Line under the switcher while this season is selected. */
  intro: string;
  /** Concierge tile at the end of the grid. */
  plan: { title: string; text: string };
  /** The first experience is the large feature card. */
  experiences: readonly Experience[];
};

const commons = "https://upload.wikimedia.org/wikipedia/commons";

// Андрей Романенко, "Plav Lake in Montenegro 01", CC BY-SA 4.0.
export const heroImage: ExperienceImage = {
  src: `${commons}/thumb/a/a3/Plav_Lake_in_Montenegro_01.jpg/1920px-Plav_Lake_in_Montenegro_01.jpg`,
  alt: "Lake Plav on a still morning, the town and its hills mirrored in the water",
  position: "50% 60%",
  credit: {
    author: "Андрей Романенко",
    license: "CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Plav_Lake_in_Montenegro_01.jpg",
  },
};

/** Big numbers in the lake introduction (verified — see the report). */
export const lakeStats = [
  { value: "906 m", label: "above sea level", accent: true },
  { value: "2.2 km", label: "long, north to south" },
  // The age is approximate — "or so" keeps the tile honest without widening the number.
  { value: "10,000", label: "years or so since the ice made it" },
  { value: "2½ h", label: "by car from Podgorica airport" },
] as const;

export const summer: Season = {
  key: "summer",
  label: "Summer",
  intro: "Fresh, clear swims, long light and high trails — the lake and the Prokletije at their most open.",
  plan: {
    title: "Plan a summer day",
    text: "Tell us your pace — we’ll line up guides, gear, picnics and early breakfasts.",
  },
  experiences: [
    {
      // Kayaks and pedal boats; trout, grayling and pike (verified).
      title: "Paddle Lake Plav",
      text: "Kayaks, pedal boats and summer swimming on Montenegro’s largest glacial lake — home to trout, grayling and pike.",
      season: "Summer",
      duration: "An hour or all day",
      image: {
        src: `${commons}/thumb/5/51/Plav_Lake_in_Montenegro_03.jpg/1280px-Plav_Lake_in_Montenegro_03.jpg`,
        alt: "Kayaks resting on a wooden jetty on Lake Plav, a green mountain rising behind",
        position: "50% 55%",
        credit: {
          author: "Андрей Романенко",
          license: "CC BY-SA 4.0",
          href: "https://commons.wikimedia.org/wiki/File:Plav_Lake_in_Montenegro_03.jpg",
        },
      },
    },
    {
      // plavto.me: in Prokletije National Park.
      title: "Hike to Lake Hrid",
      text: "A high mountain lake in Prokletije National Park — a full day’s hike from Plav.",
      season: "Summer",
      duration: "Full day",
      image: {
        src: `${commons}/thumb/4/47/Peaks_of_the_Balkans_-_Hridsko_Lake%2C_Montenegro.jpg/1280px-Peaks_of_the_Balkans_-_Hridsko_Lake%2C_Montenegro.jpg`,
        alt: "Clear water of Lake Hrid over red stones, with pine forest on the far shore",
        credit: {
          author: "Bruno Rijsman",
          license: "CC BY 2.0",
          href: "https://commons.wikimedia.org/wiki/File:Peaks_of_the_Balkans_-_Hridsko_Lake,_Montenegro.jpg",
        },
      },
    },
    {
      // plavto.me: 192 km, three countries, Plav is a starting point.
      title: "Walk the Peaks of the Balkans",
      text: "Plav is a starting point of this 192 km trail through three countries — walk one stage or the lot.",
      season: "Summer",
      duration: "One stage or more",
      image: {
        src: `${commons}/thumb/8/8b/Peaks_of_the_Balkans_-_178_%2838175763354%29.jpg/1280px-Peaks_of_the_Balkans_-_178_%2838175763354%29.jpg`,
        alt: "Limestone peaks above green summer pastures",
        credit: {
          author: "Bruno Rijsman",
          license: "CC BY 2.0",
          href: "https://commons.wikimedia.org/wiki/File:Peaks_of_the_Balkans_-_178_(38175763354).jpg",
        },
      },
    },
    {
      // Wikipedia (Gusinje, Ropojana Valley), visit-montenegro.com: the
      // springs by Gusinje; the glacial valley with Grlja and Oko Skakavice.
      title: "Springs & waterfalls beyond Gusinje",
      text: "Ali Pasha’s Springs, then the glacial Ropojana valley — past the Grlja waterfall to the Oko Skakavice spring.",
      season: "Summer",
      duration: "Half day",
      image: {
        src: `${commons}/thumb/5/5d/Heading_West_%2810470602095%29.jpg/1280px-Heading_West_%2810470602095%29.jpg`,
        alt: "Walkers on a country lane into the Ropojana valley, sheer peaks on either side",
        credit: {
          author: "amir appel",
          license: "CC BY 2.0",
          href: "https://commons.wikimedia.org/wiki/File:Heading_West_(10470602095).jpg",
        },
      },
    },
    {
      // plavto.me: flights from Visitor over the lake; tandem flights through
      // clubs in Berane or Bijelo Polje.
      title: "Paraglide over the lake",
      text: "Tandem flights launch from Visitor and glide out over the water — we book the pilot for you.",
      season: "Summer",
      duration: "Weather permitting",
      image: {
        src: `${commons}/d/d6/Visitor_mountain.jpg`,
        alt: "Visitor mountain rising straight from the calm water of Lake Plav",
        credit: {
          author: "DrVanDerDoom",
          license: "CC0",
          href: "https://commons.wikimedia.org/wiki/File:Visitor_mountain.jpg",
        },
      },
    },
  ],
};

export const winter: Season = {
  key: "winter",
  label: "Winter",
  intro: "Snow on the peaks, ice on the lake — then a warm spa and a long dinner.",
  plan: {
    title: "Plan a snow day",
    text: "Snowshoes, a local guide and a transfer to the trailhead — arranged the evening before.",
  },
  experiences: [
    {
      // plavto.me: the marked "Paljevi" trail on Kofiljača, above Plav.
      title: "Snowshoe the Paljevi trail",
      text: "A marked snowshoe trail on Kofiljača, above Plav — we arrange the snowshoes and a local guide.",
      season: "Winter",
      duration: "Half or full day",
      image: {
        src: `${commons}/3/3d/Trekufiri.jpg`,
        alt: "Snow-covered ridges of the Prokletije in bright winter sun",
        credit: {
          author: "Albinfo",
          license: "CC BY-SA 4.0",
          href: "https://commons.wikimedia.org/wiki/File:Trekufiri.jpg",
        },
      },
    },
    {
      // The lake freezes in winter (verified).
      title: "Walk on the frozen lake",
      text: "In winter the lake freezes over. We check conditions before you step out.",
      season: "Deep winter",
      duration: "When the ice holds",
      image: {
        src: `${commons}/thumb/9/96/Plav_Lake_Winter_Aerial_View_2.jpg/1280px-Plav_Lake_Winter_Aerial_View_2.jpg`,
        alt: "Lake Plav from the air in winter, snow on the mountains around it",
        position: "55% 50%",
        credit: {
          author: "Albinfo",
          license: "CC0",
          href: "https://commons.wikimedia.org/wiki/File:Plav_Lake_Winter_Aerial_View_2.jpg",
        },
      },
    },
    {
      // The Paljevi ski slope, about half an hour's drive (verified). The same
      // winter-peaks placeholder as the home page's "Ski at Paljevi".
      title: "Sledge & ski at Paljevi",
      text: "A small ski slope with sledging for children, half an hour’s drive away — we arrange hire and the transfer.",
      season: "Winter",
      duration: "30 min away",
      image: {
        src: "https://static.wixstatic.com/media/f9d3d7_b639006d90ee42128eea2062999299ee~mv2.jpg/v1/fill/w_900,h_675,al_c,q_85,enc_avif,quality_auto/f9d3d7_b639006d90ee42128eea2062999299ee~mv2.jpg",
        alt: "Snow-covered mountains under a pink winter sky",
      },
    },
    {
      title: "Thaw out in the spa",
      text: "Come in from the cold to the indoor pools, sauna and steam — then dinner by the fire.",
      season: "Year-round",
      duration: "Evenings",
      // The evening pool, as on the home page's winter "Sauna & steam" (the
      // bright pool photo is the spa page's own).
      image: {
        src: "https://static.wixstatic.com/media/1de95c_424350ad23d241d988255f926572dd10~mv2.jpg/v1/fill/w_900,h_675,al_c,q_85,enc_avif,quality_auto/1de95c_424350ad23d241d988255f926572dd10~mv2.jpg",
        alt: "The indoor pool in low evening light",
      },
      link: { label: "See the spa", href: "/spa" },
    },
  ],
};

export const seasons: readonly Season[] = [summer, winter];

/** Footer "Seasons" column. */
export const seasonNotes = [
  "Summer · lake days & high trails",
  "Winter · snowshoes & a frozen lake",
  "Spa & dining · year-round",
] as const;

/** What the concierge sorts out — the closing call to action. */
export const conciergeHelps = [
  { title: "Guides & gear", text: "Mountain guides, kayaks, snowshoes — booked and waiting." },
  { title: "Getting there", text: "Podgorica airport is about 2½ hours by car; we can arrange a private transfer." },
  { title: "The small things", text: "Packed lunches, early breakfasts, a sauna warm for your return." },
] as const;
