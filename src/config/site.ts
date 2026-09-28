/**
 * Brand, contact details and navigation shared by every page.
 * Change hotel-wide details here rather than in individual components.
 */

export const site = {
  name: "Brezovica Hotel & SPA",
  wordmark: "BREZOVICA",
  description:
    "A five-star alpine resort in Brezovica, beneath the Sharr Mountains — suites with a view, three restaurants, a thermal spa and direct-booking rates with no fees.",
  tagline:
    "An alpine sanctuary in the Sharr Mountains — where mountain grandeur meets a warmth that feels like your own.",
  /** Public origin, used for canonical URLs, sitemap and structured data. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://brezovicahotel.com",
  address: {
    line1: "Brezovica Ski Resort",
    locality: "Štrpce",
    country: "Kosovo",
    countryCode: "XK",
  },
  /** "Get directions" — opens Google Maps routing to the resort. */
  directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Brezovica%20Ski%20Resort%2C%20%C5%A0trpce%2C%20Kosovo",
  phone: { display: "+383 49 30 10 30", href: "tel:+38349301030" },
  email: {
    stay: "stay@brezovicahotel.com",
    dine: "dine@brezovicahotel.com",
    spa: "spa@brezovicahotel.com",
    events: "events@brezovicahotel.com",
  },
  // TODO(content): real profile URLs.
  social: [
    { short: "in", label: "LinkedIn", href: "#" },
    { short: "ig", label: "Instagram", href: "#" },
    { short: "fb", label: "Facebook", href: "#" },
  ],
  // TODO(content): these pages don't exist in the design yet.
  legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Cancellation", href: "#" },
    { label: "FAQ", href: "#" },
  ],
  copyrightYear: 2026,
} as const;

export type NavKey = "rooms" | "dining" | "spa" | "experiences" | "tour" | "events" | "contact";

export type NavItem = {
  key: NavKey;
  /** Label in the desktop bar. */
  label: string;
  /** Label in the mobile menu and footer. */
  longLabel: string;
  href: string;
};

export const mainNav: readonly NavItem[] = [
  { key: "rooms", label: "Rooms", longLabel: "Rooms & Suites", href: "/rooms" },
  { key: "dining", label: "Dining", longLabel: "Dining", href: "/dining" },
  { key: "spa", label: "Spa", longLabel: "Spa & Wellness", href: "/spa" },
  { key: "experiences", label: "Experiences", longLabel: "Experiences", href: "/experiences" },
  { key: "tour", label: "Virtual Tour", longLabel: "Virtual Tour · 3D & 360°", href: "/tour" },
  { key: "events", label: "Events", longLabel: "Events & Weddings", href: "/events" },
  { key: "contact", label: "Contact", longLabel: "Contact", href: "/contact" },
];

/** Mobile menu and footer "Explore" list: main nav plus the home gallery. */
export const exploreNav: readonly { label: string; href: string }[] = [
  ...mainNav.slice(0, 6).map((item) => ({ label: item.longLabel, href: item.href })),
  { label: "Gallery", href: "/#gallery" },
  { label: "Contact", href: "/contact" },
];

export type Cta = { label: string; href: string };
