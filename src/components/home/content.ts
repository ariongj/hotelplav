/** Copy and imagery for the home page (design/Aurelia.dc.html). */

import type { RoomId } from "@/lib/booking/rooms";

const wix = (id: string, w: number, h: number) =>
  `https://static.wixstatic.com/media/${id}/v1/fill/w_${w},h_${h},al_c,q_85,enc_avif,quality_auto/${id}`;

export const heroImages = {
  exterior: {
    src: wix("1de95c_da6dacf180bd433788972c2d0b719bcf~mv2.jpg", 1920, 1080),
    alt: "The hotel facade at dusk, snow on the ground and warm light in the windows",
  },
  lobby: {
    src: wix("f9d3d7_54128e2300634fb9b8020ce4a8f8103d~mv2.jpg", 1920, 1080),
    alt: "The lobby — marble floor, chandelier and reception in warm light",
  },
  suite: {
    src: wix("1de95c_caf15c194f104ecda6e934c4a9f280fa~mv2.jpg", 1920, 1080),
    alt: "A suite with a made bed, lamps, curtains and a writing desk",
  },
  view: {
    src: wix("1de95c_0a26973775ff4331865112ee0b1b6ff7~mv2.jpg", 1920, 1080),
    alt: "Snow-covered peaks of the Sharr Mountains at sunrise",
  },
};

/** Opening-sequence chapters: scroll progress where each act starts. */
export const heroActs = [
  { at: 0, name: "Arrival" },
  { at: 0.26, name: "The Lobby" },
  { at: 0.55, name: "Your Suite" },
  { at: 0.8, name: "The View" },
] as const;

/** Snowfall: left %, size px, opacity, blur px, fall s, fall delay s, sway s, sway delay s. */
export const snowflakes: ReadonlyArray<readonly [number, number, number, number, number, number, number, number]> = [
  [4, 4, 0.7, 0.5, 13, 0, 3.6, 0],
  [11, 3, 0.55, 0.5, 17, 2.4, 4.2, 0.4],
  [19, 5, 0.75, 1, 11, 5, 3, 0.6],
  [27, 3, 0.5, 0.5, 15, 1.2, 3.9, 0],
  [35, 4, 0.6, 0.5, 18, 7, 4.6, 0.9],
  [43, 3, 0.5, 0.5, 12.5, 3.6, 3.2, 0],
  [51, 5, 0.7, 1, 16, 8.4, 4, 0.4],
  [59, 4, 0.6, 0.5, 10.5, 0.8, 2.9, 0],
  [67, 3, 0.5, 0.5, 17.5, 5.8, 4.4, 1.1],
  [75, 4, 0.62, 0.5, 13.5, 2, 3.5, 0],
  [83, 3, 0.5, 0.5, 14.5, 6.6, 3.3, 0.7],
  [91, 5, 0.7, 1, 11.5, 4.4, 3.1, 0],
  [96, 3, 0.5, 0.5, 15.5, 9, 3.8, 0.3],
];

export const trust = [
  { label: "Guest rating", value: "4.9 out of 5 · 1,240 verified reviews" },
  { label: "Awarded", value: "World Luxury Hotel Awards — Alpine Retreat, 2025" },
  { label: "Recognised", value: "Condé Nast Traveller Readers’ Choice" },
  { label: "Booking direct", value: "Price matched, no fees, free cancellation to 48h" },
];

export const stats = [
  { value: "42", label: "Rooms & Suites" },
  { value: "1,100m", label: "Above Sea Level" },
  { value: "3", label: "Restaurants" },
  { value: "8.7", label: "Guest Rating" },
];

export const roomTeasers: ReadonlyArray<{ id: RoomId; meta: string; image: string; badge?: string }> = [
  { id: "deluxe-alpine-room", meta: "42 m² · 2 guests · Valley view", image: wix("1de95c_072bf1db81bd4227b40d79d328c61bcf~mv2.jpg", 800, 1000) },
  { id: "junior-suite", meta: "58 m² · 2 guests · Lake view", image: wix("f9d3d7_b639006d90ee42128eea2062999299ee~mv2.jpg", 800, 1000) },
  {
    id: "presidential-suite",
    meta: "76 m² · 3 guests · Panorama · Balcony",
    image: wix("1de95c_caf15c194f104ecda6e934c4a9f280fa~mv2.jpg", 800, 1000),
    badge: "Signature",
  },
  { id: "panorama-suite", meta: "110 m² · 4 guests · Terrace · Fireplace", image: wix("1de95c_4e2e9d02251244f4b5809e52393e1e0b~mv2.jpg", 800, 1000) },
];

export const dining = {
  hours: [
    { label: "Breakfast", value: "8 – 10:30 · À la carte & buffet" },
    { label: "Dinner", value: "19 – 22:30 · À la carte & tasting" },
    { label: "Lounge", value: "Opera Bar · Coffee & cocktails" },
  ],
  images: [
    { src: wix("1de95c_06446d6ed68a4cf88589eb1783e8988d~mv2.jpg", 800, 1200), alt: "A signature dish by candlelight" },
    { src: wix("1de95c_7865ec1a5c49485daf024463179d5078~mv2.jpg", 800, 600), alt: "The restaurant interior" },
    { src: wix("f9d3d7_0b2e8110e64b49ffbb15dc298cf193fb~mv2.jpg", 800, 600), alt: "The wine cellar" },
  ],
};

export const spa = {
  image: {
    src: wix("1de95c_03adb94268124caf858cfba9e9710b7b~mv2.jpg", 1000, 1200),
    alt: "The spa — thermal pool, sauna glow and steam",
  },
  treatments: [
    { name: "Signature Alpine Massage · 80 min", price: "€185" },
    { name: "Thermal Sauna Ritual", price: "€90" },
    { name: "Glacial Botanical Facial", price: "€150" },
    { name: "Two-Day Wellness Retreat", price: "€620" },
  ],
};

export const tourTeaser = {
  src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Paris,_mairie_du_10e_arrdt,_hall_04.jpg/3840px-Paris,_mairie_du_10e_arrdt,_hall_04.jpg",
  yaw: 0,
  pitch: 4,
  fov: 58,
  autorotate: 1.2,
  label: "The Grand Hall",
};

export const events = {
  image: {
    src: wix("1de95c_aa8eaafdd55b4978a19a78a2cd03506d~mv2.jpg", 1746, 764),
    alt: "A wedding banquet on the mountain terrace at dusk",
  },
  cards: [
    { title: "Weddings", text: "Ceremonies for up to 220, with a dedicated planner and suites for the party." },
    { title: "Corporate", text: "Three conference rooms, full AV and retreat programmes for teams." },
  ],
  capacities: [
    { label: "Banquet", value: "220" },
    { label: "Theatre", value: "300" },
    { label: "Boardroom", value: "40" },
  ],
};

export type GalleryCategory = "rooms" | "dining" | "spa" | "pool" | "events" | "exterior";

export const galleryFilters: ReadonlyArray<{ key: GalleryCategory | "all"; label: string }> = [
  { key: "all", label: "All" },
  { key: "rooms", label: "Rooms" },
  { key: "dining", label: "Dining" },
  { key: "spa", label: "Spa" },
  { key: "pool", label: "Pool" },
  { key: "events", label: "Events" },
  { key: "exterior", label: "Exterior" },
];

export const gallery: ReadonlyArray<{ category: GalleryCategory; ratio: string; src: string; alt: string }> = [
  { category: "exterior", ratio: "3 / 4", src: wix("1de95c_da6dacf180bd433788972c2d0b719bcf~mv2.jpg", 750, 1000), alt: "The hotel exterior" },
  { category: "rooms", ratio: "1 / 1", src: wix("1de95c_072bf1db81bd4227b40d79d328c61bcf~mv2.jpg", 800, 800), alt: "A suite" },
  { category: "spa", ratio: "3 / 4", src: wix("1de95c_fe69aecf6c0a4c3e89f1b8d5afc6d93b~mv2.jpg", 750, 1000), alt: "The spa" },
  { category: "dining", ratio: "4 / 5", src: wix("1de95c_9c4f733331a7445ca87f65e04807725a~mv2.jpg", 800, 1000), alt: "Dining" },
  { category: "pool", ratio: "1 / 1", src: wix("f9d3d7_d9f5264f63fb46e8b4fa9c093c43dd22~mv2.jpg", 800, 800), alt: "The pool" },
  { category: "events", ratio: "3 / 4", src: wix("f9d3d7_da33001184424bb386ce7742edf5e2a8~mv2.jpg", 750, 1000), alt: "An event set for dinner" },
  { category: "rooms", ratio: "4 / 5", src: wix("f9d3d7_b639006d90ee42128eea2062999299ee~mv2.jpg", 800, 1000), alt: "Bathroom detail" },
  { category: "exterior", ratio: "1 / 1", src: wix("1de95c_90f60c968da246dd9b5fdba3210919d7~mv2.jpg", 800, 800), alt: "The terrace at dusk" },
];

export const offers = [
  {
    title: "Winter Escape",
    dates: "1 Dec – 28 Feb",
    text: "3 nights, daily breakfast, one spa ritual and a private ski transfer.",
    priceLead: "from",
    price: "€1,290",
    image: wix("1de95c_0a26973775ff4331865112ee0b1b6ff7~mv2.jpg", 800, 500),
  },
  {
    title: "Romance in the Alps",
    dates: "Year-round",
    text: "Suite upgrade, champagne on arrival, couples' massage and a candlelit dinner.",
    priceLead: "from",
    price: "€890",
    image: wix("1de95c_491862344bf74e00b37b650f8249e6a8~mv2.jpg", 800, 500),
  },
  {
    title: "Stay Longer",
    dates: "5+ nights",
    text: "Stay five nights, pay for four — with daily breakfast and late checkout.",
    priceLead: "save",
    price: "20%",
    image: wix("f9d3d7_24310a781a3f49e1a8dfa46cfbb3d9e9~mv2.jpg", 800, 500),
  },
];

export const reviews = {
  featured: {
    quote: "We have stayed in the great hotels of the world. Brezovica is the only one that felt like it had been waiting for us.",
    author: "Eleanor & James H. · Condé Nast Traveller",
  },
  cards: [
    { quote: "The most restorative week of our year. The spa alone is worth the journey.", author: "Sofia M. · Milan" },
    { quote: "Impeccable service, extraordinary food, and a view I still dream about.", author: "David R. · London" },
    { quote: "Our wedding was flawless. Every guest is still talking about it.", author: "Amara & Tom · Zürich" },
  ],
};

export const locationFacts = [
  { label: "Address", lines: ["Brezovica Ski Resort", "Štrpce, Kosovo"] },
  { label: "Nearest Airport", lines: ["Pristina · 90 min by car"] },
  { label: "Transfers", lines: ["Chauffeur, helicopter & rail"] },
  { label: "Parking", lines: ["Valet & EV charging"] },
];
