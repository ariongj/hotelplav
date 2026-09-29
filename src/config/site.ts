/**
 * Brand, contact details and navigation shared by every page.
 * Change hotel-wide details here rather than in individual components.
 */

export const site = {
  name: "Plav Hotel",
  wordmark: "PLAV HOTEL",
  description:
    "A lakeside hotel and spa on Lake Plav in eastern Montenegro, beneath the Prokletije mountains — rooms and suites with a view, a restaurant, a lounge and a bar, pools and a Finnish sauna, and direct-booking rates with no fees.",
  tagline:
    "A lakeside retreat in Plav, Montenegro — where a glacial lake meets the Accursed Mountains, and every stay is shaped around you.",
  /** Public URL (no trailing slash), used for canonical URLs, sitemap and structured data. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://plavhotel.com").replace(/\/+$/, ""),
  address: {
    line1: "Lake Plav",
    locality: "Plav",
    country: "Montenegro",
    countryCode: "ME",
  },
  /** "Get directions" — opens Google Maps routing to Plav. */
  directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Lake%20Plav%2C%20Plav%2C%20Montenegro",
  // TODO(content): placeholders until the hotel's real number and mailboxes are set up.
  phone: { display: "+382 00 000 000", href: "tel:+38200000000" },
  email: {
    stay: "stay@plavhotel.com",
    dine: "dine@plavhotel.com",
    spa: "spa@plavhotel.com",
    events: "events@plavhotel.com",
  },
  // TODO(content): real profile URLs. The footer hides links left at "#".
  social: [
    { short: "in", label: "LinkedIn", href: "#" },
    { short: "ig", label: "Instagram", href: "#" },
    { short: "fb", label: "Facebook", href: "#" },
  ],
  // TODO(content): Privacy, Terms, Cancellation and FAQ pages don't exist yet;
  // the footer hides links left at "#" until they do.
  legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Cancellation", href: "#" },
    { label: "FAQ", href: "#" },
    { label: "Photo credits", href: "/credits" },
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
  { key: "rooms", label: "Stay", longLabel: "Rooms & Suites", href: "/rooms" },
  { key: "dining", label: "Dine", longLabel: "Dining", href: "/dining" },
  { key: "spa", label: "Spa", longLabel: "Spa & Wellness", href: "/spa" },
  { key: "experiences", label: "Experiences", longLabel: "Experiences", href: "/experiences" },
  { key: "tour", label: "Virtual tour", longLabel: "Virtual Tour · 3D & 360°", href: "/tour" },
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
