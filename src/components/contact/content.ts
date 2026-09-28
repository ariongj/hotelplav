/** Copy for the Contact page (design/Contact.dc.html). Contact details come from site config. */

import { site } from "@/config/site";

export type ContactDetail =
  | { label: string; value: string; href?: string }
  | { label: string; lines: readonly string[] };

export const contactDetails: readonly ContactDetail[] = [
  { label: "Reservations", value: site.phone.display, href: site.phone.href },
  { label: "Email", value: site.email.stay, href: `mailto:${site.email.stay}` },
  { label: "Events & weddings", value: site.email.events, href: `mailto:${site.email.events}` },
  { label: "Address", lines: [site.address.line1, `${site.address.locality}, ${site.address.country}`] },
  { label: "Front desk", value: "24 hours, daily" },
];

export const travelFacts = [
  { label: "By air", lines: ["Pristina 90 min", "Skopje 70 min"] },
  { label: "By road", lines: ["E65 to Štrpce,", "mountain road to resort"] },
  { label: "Transfers", lines: ["Chauffeur & helicopter,", "on request"] },
  { label: "Parking", lines: ["Valet & EV charging,", "complimentary"] },
] as const;
