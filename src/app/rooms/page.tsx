import type { Metadata } from "next";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";
import { AvailabilityBar } from "@/components/rooms/AvailabilityBar";
import { ConciergeStrip } from "@/components/rooms/ConciergeStrip";
import { FilterToolbar } from "@/components/rooms/FilterToolbar";
import { RateResults } from "@/components/rooms/RateResults";
import { RoomCard } from "@/components/rooms/RoomCard";
import { RoomGrid } from "@/components/rooms/RoomGrid";
import { RoomsBookingProvider } from "@/components/rooms/RoomsBooking";
import { RoomsHeader } from "@/components/rooms/RoomsHeader";
import { RoomsStickyBar } from "@/components/rooms/RoomsStickyBar";
import { rooms } from "@/lib/booking/rooms";

export const metadata: Metadata = {
  title: "Rooms & Suites",
  description:
    "Rooms, suites and a private chalet beneath the Sharr Mountains. Compare every room, check live availability and book direct — breakfast, thermal spa and taxes included.",
};

export default function RoomsPage() {
  // Cards render on the server; the client grid only filters and orders them.
  const cards = Object.fromEntries(rooms.map((room) => [room.id, <RoomCard key={room.id} room={room} />]));

  return (
    <>
      <SiteNav cta={{ label: "Book", href: "#book" }} menuCta={{ label: "Reserve your stay", href: "#book" }} />
      <RoomsBookingProvider>
        <main>
          <RoomsHeader />
          <AvailabilityBar />
          <RateResults />
          <FilterToolbar />
          <RoomGrid cards={cards} />
          <ConciergeStrip />
        </main>
        <SiteFooter email="stay" aside={{ kind: "newsletter" }} social divider />
        <RoomsStickyBar />
      </RoomsBookingProvider>
    </>
  );
}
