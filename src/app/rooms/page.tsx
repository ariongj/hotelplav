import type { Metadata } from "next";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";
import { AvailabilityBar } from "@/components/rooms/AvailabilityBar";
import { ConciergeStrip } from "@/components/rooms/ConciergeStrip";
import { HEADER_IMAGE } from "@/components/rooms/content";
import { FilterToolbar } from "@/components/rooms/FilterToolbar";
import { RateResults } from "@/components/rooms/RateResults";
import { RoomCard } from "@/components/rooms/RoomCard";
import { RoomGrid } from "@/components/rooms/RoomGrid";
import { RoomsBookingProvider } from "@/components/rooms/RoomsBooking";
import { RoomsBrowse } from "@/components/rooms/RoomsBrowse";
import { RoomsStickyBar } from "@/components/rooms/RoomsStickyBar";
import { tourRoom } from "@/components/tour/content";
import { PageHero } from "@/components/ui/PageHero";
import { rooms } from "@/lib/booking/rooms";

export const metadata: Metadata = {
  title: "Rooms & Suites",
  description:
    "Rooms, suites and a chalet residence on the shore of Lake Plav, Montenegro. Compare every room, check live availability and book direct — breakfast, spa access and taxes included.",
  alternates: { canonical: "/rooms" },
};

export default function RoomsPage() {
  // Cards render on the server; the client grid only filters and orders them.
  // Only the tour's room has a 360° panorama of its own (tourRoom).
  const cards = Object.fromEntries(
    rooms.map((room) => [room.id, <RoomCard key={room.id} room={room} inTour={room.id === tourRoom.id} />]),
  );

  return (
    <>
      <SiteNav cta={{ label: "Book", href: "#book" }} menuCta={{ label: "Book your stay", href: "#book" }} />
      <RoomsBookingProvider>
        <main>
          <PageHero
            kicker="Rooms & suites"
            title={
              <>
                Wake up <em>by the lake</em>
              </>
            }
            intro="Rooms, suites and a chalet of our own on the shore of Lake Plav — the glacial lake at the door, Visitor across the water and the Prokletije to the south. Book direct and breakfast and every tax are included; the spa is open to every guest."
            image={HEADER_IMAGE}
            overlap
          />
          <AvailabilityBar />
          <RateResults tourRoomId={tourRoom.id} />
          <RoomsBrowse>
            <FilterToolbar />
            <RoomGrid cards={cards} />
          </RoomsBrowse>
          <ConciergeStrip />
        </main>
        <SiteFooter email="stay" aside={{ kind: "newsletter" }} social divider />
        <RoomsStickyBar />
      </RoomsBookingProvider>
    </>
  );
}
