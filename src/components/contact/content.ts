/** Copy for the Contact page. Phone, email and address come from site config. */

import { site } from "@/config/site";

/** Mailboxes on the email card — every address the other pages advertise. */
export const emailContacts = [
  { label: "Stays & questions", address: site.email.stay },
  { label: "Dining & tables", address: site.email.dine },
  { label: "Spa & treatments", address: site.email.spa },
  { label: "Events & weddings", address: site.email.events },
] as const;

/**
 * Lake Plav in numbers, beside the map. Sources: Wikipedia "Lake Plav"
 * (906 m, ~2.2 km north–south, glacial, the largest glacial lake in
 * Montenegro).
 */
export const lakeFacts = [
  { value: "906 m", label: "the lake’s height above sea level" },
  { value: "2.2 km", label: "Lake Plav from end to end, north to south" },
  { value: "10,000", label: "years or so since the last ice age shaped it" },
  { value: "No. 1", label: "the largest glacial lake in Montenegro" },
] as const;
