"use client";

import { StickyBar } from "@/components/layout/StickyBar";
import { StickyAction, StickyLabel } from "@/components/layout/StickyParts";
import { lowestFromRate } from "@/lib/booking/rooms";
import { euro, plural } from "@/lib/format";

import { useHomeBooking } from "./HomeBooking";

export function HomeStickyBar() {
  const { selection, held } = useHomeBooking();

  return (
    <StickyBar>
      <StickyLabel>
        {selection ? (
          <>
            {selection.quote.name}{" "}
            <em>
              · {euro(selection.quote.direct)} for {plural(selection.search.nights, "night")}
            </em>
          </>
        ) : (
          <>
            Lakeside rooms <em>· from {euro(lowestFromRate)} / night, booked direct</em>
          </>
        )}
      </StickyLabel>
      <StickyAction href={selection ? "#results" : "#book"}>
        {!selection ? "Check dates" : held ? "Complete reservation" : "Review your stay"}
      </StickyAction>
    </StickyBar>
  );
}
