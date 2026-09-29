/**
 * Guest options offered by the booking bars. `pax` is the head count used
 * for capacity checks and the booking-site breakfast comparison. The list
 * runs to 6 so the Chalet Residence (sleeps 6) can be quoted.
 */
export type GuestOption = { label: string; pax: number };

export const GUEST_OPTIONS: readonly GuestOption[] = [
  { label: "1 Guest", pax: 1 },
  { label: "2 Adults", pax: 2 },
  { label: "2 Adults, 1 Child", pax: 3 },
  { label: "2 Adults, 2 Children", pax: 4 },
  { label: "3 Adults", pax: 3 },
  { label: "4 Adults", pax: 4 },
  { label: "5 Guests", pax: 5 },
  { label: "6 Guests", pax: 6 },
];

export const DEFAULT_GUESTS = "2 Adults";

export function paxFor(label: string): number {
  return GUEST_OPTIONS.find((option) => option.label === label)?.pax ?? 2;
}
