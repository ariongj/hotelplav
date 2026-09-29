/**
 * Copy and imagery for the home page. Lake and mountain photos are from
 * Wikimedia Commons and must keep their credit line; the hotel interiors are
 * placeholders until the hotel's own licensed photography.
 */

import { scenes, type Scene, type SceneId } from "@/components/tour/content";
import type { Credit } from "@/components/ui/PhotoCredit";

const wix = (id: string, w: number, h: number) =>
  `https://static.wixstatic.com/media/${id}/v1/fill/w_${w},h_${h},al_c,q_85,enc_avif,quality_auto/${id}`;

const commons = "https://upload.wikimedia.org/wikipedia/commons";
const romanenko = (file: string): Credit => ({
  author: "Андрей Романенко",
  license: "CC BY-SA 4.0",
  href: `https://commons.wikimedia.org/wiki/File:${file}`,
});

export type HomeImage = { src: string; alt: string; position?: string; credit?: Credit };

export const intro = {
  statement:
    "Plav Hotel sits on the shore of Lake Plav — a glacial lake at 906 metres, cradled between the Prokletije and the Visitor mountains. Wake to still water, walk out into the peaks, come back to the spa.",
  image: {
    src: `${commons}/thumb/c/c0/Plav_Lake_in_Montenegro_02.jpg/1280px-Plav_Lake_in_Montenegro_02.jpg`,
    alt: "Lake Plav perfectly still, the mountains and clouds mirrored in the water",
    position: "30% 50%",
    credit: romanenko("Plav_Lake_in_Montenegro_02.jpg"),
  } satisfies HomeImage,
  stats: [
    { value: "906 m", label: "Lake Plav above sea level" },
    { value: "42", label: "Rooms & suites" },
    { value: "3", label: "A restaurant, a lounge and a bar" },
    { value: "2½ h", label: "From Podgorica airport" },
  ],
};

export type SeasonKey = "summer" | "winter";

export type SeasonItem = { title: string; text: string; image: HomeImage };

export const seasons: Record<SeasonKey, { title: string; lead: string; items: SeasonItem[] }> = {
  summer: {
    title: "Long days on the water",
    lead: "Fresh, clear swims, kayaks and pedal boats at the jetty, and trails into the Prokletije and up Visitor.",
    items: [
      {
        title: "Swim & paddle Lake Plav",
        text: "Kayaks and pedal boats from the jetty, and a swim before breakfast.",
        image: {
          src: `${commons}/thumb/5/51/Plav_Lake_in_Montenegro_03.jpg/1280px-Plav_Lake_in_Montenegro_03.jpg`,
          alt: "Kayaks tied up at a wooden jetty on Lake Plav, a green mountain behind",
          credit: romanenko("Plav_Lake_in_Montenegro_03.jpg"),
        },
      },
      {
        title: "Hike the Prokletije",
        text: "Guided day walks to Lake Hrid, the Ropojana valley and the Peaks of the Balkans trail.",
        image: {
          src: `${commons}/thumb/8/8b/Peaks_of_the_Balkans_-_178_%2838175763354%29.jpg/1280px-Peaks_of_the_Balkans_-_178_%2838175763354%29.jpg`,
          alt: "Limestone peaks of the Prokletije above green summer pastures",
          credit: {
            author: "Bruno Rijsman",
            license: "CC BY 2.0",
            href: "https://commons.wikimedia.org/wiki/File:Peaks_of_the_Balkans_-_178_(38175763354).jpg",
          },
        },
      },
      {
        title: "Dinner at golden hour",
        text: "Lake trout, kajmak and mountain honey, and the last light on the peaks.",
        image: {
          src: wix("1de95c_06446d6ed68a4cf88589eb1783e8988d~mv2.jpg", 800, 800),
          alt: "Sauce poured over a steak with roast potatoes and vegetables",
        },
      },
      {
        title: "Spa after the summit",
        text: "Sauna, steam and a long, slow swim — the lake does the rest.",
        image: {
          src: wix("1de95c_fe69aecf6c0a4c3e89f1b8d5afc6d93b~mv2.jpg", 800, 800),
          alt: "Loungers lined up beside the indoor pool",
        },
      },
    ],
  },
  winter: {
    title: "Snow, fire and stillness",
    lead: "A frozen lake, snow-heavy pines and the quiet of the mountains in winter — then the warmth of the fire and the spa.",
    items: [
      {
        title: "Ski at Paljevi",
        text: "A friendly slope half an hour's drive away, with sledging for children. We arrange hire and the drive.",
        image: {
          src: wix("f9d3d7_b639006d90ee42128eea2062999299ee~mv2.jpg", 800, 800),
          alt: "Snow-covered mountains under a pink winter sky",
        },
      },
      {
        // As on the experiences page: the Paljevi snowshoe trail on Kofiljača.
        title: "Snowshoe the Paljevi trail",
        text: "A marked snowshoe trail on Kofiljača, above Plav — we arrange the snowshoes and a local guide.",
        image: {
          src: `${commons}/thumb/9/96/Plav_Lake_Winter_Aerial_View_2.jpg/1280px-Plav_Lake_Winter_Aerial_View_2.jpg`,
          alt: "Lake Plav from the air in winter, snow on the mountains around it",
          // CC0, credited anyway — as on the experiences page.
          credit: {
            author: "Albinfo",
            license: "CC0",
            href: "https://commons.wikimedia.org/wiki/File:Plav_Lake_Winter_Aerial_View_2.jpg",
          },
        },
      },
      {
        title: "Sauna & steam",
        text: "Finnish sauna, steam and a warm pool after a day in the snow.",
        image: {
          src: wix("1de95c_424350ad23d241d988255f926572dd10~mv2.jpg", 800, 800),
          alt: "The indoor pool in low evening light",
        },
      },
      {
        title: "Fireside evenings",
        text: "Mountain dishes, local wine and a fire in the restaurant.",
        image: {
          src: wix("1de95c_7865ec1a5c49485daf024463179d5078~mv2.jpg", 800, 800),
          alt: "The restaurant with chandeliers and a brick fireplace",
        },
      },
    ],
  },
};

export const duo = [
  {
    kicker: "The Lake Spa",
    title: "The art of letting go",
    text: "Glass-walled pools among the pines, a Finnish sauna and steam, a few steps from the lake — and treatments built on mountain botanicals.",
    href: "/spa",
    cta: "Explore the spa",
    image: {
      src: wix("1de95c_03adb94268124caf858cfba9e9710b7b~mv2.jpg", 1000, 1200),
      alt: "The indoor pool, with the forest beyond its glass walls",
    },
  },
  {
    kicker: "Dining",
    title: "A table set by the lake",
    text: "Lake trout, kajmak, mountain honey and Plav's blueberries — cooked with care, served by the fire or, May to October, out on the lake terrace.",
    href: "/dining",
    cta: "See where to eat",
    image: {
      src: wix("f9d3d7_0b2e8110e64b49ffbb15dc298cf193fb~mv2.jpg", 800, 1200),
      alt: "Tables laid in front of the Fireside Lounge's glass-fronted wine wall",
    },
  },
];

function tourScene(id: SceneId): Scene {
  const scene = scenes.find((s) => s.id === id);
  if (!scene) throw new Error(`Unknown tour scene: ${id}`);
  return scene;
}

/** The tour's Grand Hall panorama, read from the tour so the teaser follows it. */
const hall = tourScene("hall");

export const tourTeaser = {
  src: hall.src,
  yaw: hall.yaw,
  pitch: hall.pitch,
  fov: hall.fov,
  autorotate: 1.2,
  label: hall.name,
  credit: hall.credit,
};

export type GalleryCategory = "lake" | "rooms" | "dining" | "spa";

export const galleryFilters: ReadonlyArray<{ key: GalleryCategory | "all"; label: string }> = [
  { key: "all", label: "All" },
  { key: "lake", label: "The lake" },
  { key: "rooms", label: "Rooms" },
  { key: "dining", label: "Dining" },
  { key: "spa", label: "Spa" },
];

export const gallery: ReadonlyArray<{ category: GalleryCategory; ratio: string } & HomeImage> = [
  {
    category: "lake",
    ratio: "3 / 4",
    src: `${commons}/thumb/a/a3/Plav_Lake_in_Montenegro_01.jpg/1280px-Plav_Lake_in_Montenegro_01.jpg`,
    alt: "The town and hills of Plav reflected in the lake on a clear morning",
    position: "42% 50%",
    credit: romanenko("Plav_Lake_in_Montenegro_01.jpg"),
  },
  {
    category: "rooms",
    ratio: "1 / 1",
    src: wix("1de95c_caf15c194f104ecda6e934c4a9f280fa~mv2.jpg", 800, 800),
    alt: "A suite's sitting corner: an armchair, a side table and the fire",
  },
  {
    category: "spa",
    ratio: "3 / 4",
    src: wix("1de95c_fe69aecf6c0a4c3e89f1b8d5afc6d93b~mv2.jpg", 750, 1000),
    alt: "Loungers lined up beside the indoor pool",
  },
  {
    category: "dining",
    ratio: "4 / 5",
    src: wix("1de95c_9c4f733331a7445ca87f65e04807725a~mv2.jpg", 800, 1000),
    alt: "Croissants, raspberries and coffee at breakfast",
  },
  {
    category: "spa",
    ratio: "1 / 1",
    src: wix("1de95c_4a4d5d4db4cd4e75a9012191010d5218~mv2.jpg", 800, 800),
    alt: "A guest unwinding in the blue water of the pool",
  },
  {
    category: "dining",
    ratio: "3 / 4",
    src: wix("f9d3d7_da33001184424bb386ce7742edf5e2a8~mv2.jpg", 750, 1000),
    alt: "The bar, with a billiards table under low lamps",
  },
  {
    category: "lake",
    ratio: "4 / 5",
    src: `${commons}/thumb/e/eb/Liqeni_i_Plav%C3%ABs.jpg/1280px-Liqeni_i_Plav%C3%ABs.jpg`,
    alt: "Blue water of Lake Plav, with the town and green hills on the far shore",
    credit: {
      author: "Planeti",
      license: "CC BY-SA 4.0",
      href: "https://commons.wikimedia.org/wiki/File:Liqeni_i_Plav%C3%ABs.jpg",
    },
  },
  {
    category: "dining",
    ratio: "1 / 1",
    src: wix("1de95c_072bf1db81bd4227b40d79d328c61bcf~mv2.jpg", 800, 800),
    alt: "A window table looking out on the wooded hillside",
  },
];

/** Sample reviews — replace with real, verifiable ones before launch. */
export const reviews = {
  rating: "4.9",
  count: "1,240 reviews",
  featured: {
    quote: "We have stayed in the great hotels of the world. This is the only one that felt like it had been waiting for us.",
    author: "Eleanor & James H.",
  },
  cards: [
    { quote: "The most restorative week of our year. Morning swims in the lake, evenings in the spa.", author: "Sofia M. · Milan" },
    { quote: "Impeccable service, extraordinary food, and a view I still dream about.", author: "David R. · London" },
    { quote: "Our wedding by the lake was flawless. Every guest is still talking about it.", author: "Amara & Tom · Zürich" },
  ],
};

export const locationFacts = [
  { label: "Address", value: "Lake Plav, Plav, Montenegro" },
  { label: "Nearest airport", value: "Podgorica · about 2½ hours by car" },
  { label: "Transfers", value: "Private car from the airport on request" },
  { label: "Parking", value: "On site, with EV charging" },
];
