"use client";

import { StickyBar } from "@/components/layout/StickyBar";
import { StickyAction, StickyLabel } from "@/components/layout/StickyParts";
import { getRoom } from "@/lib/booking/rooms";
import { euro, plural } from "@/lib/format";

import { useSelectedQuote } from "./HomeBooking";

const featured = getRoom("presidential-suite");

export function HomeStickyBar() {
  const selection = useSelectedQuote();

  return (
    <StickyBar>
      <StickyLabel>
        {selection ? (
          <>
            {selection.quote.name}{" "}
            <em>
              · {euro(selection.quote.direct)} for {plural(selection.search.nights, "night")}, direct
            </em>
          </>
        ) : (
          <>
            {featured.name} <em>· from {euro(featured.baseRate)} / night</em>
          </>
        )}
      </StickyLabel>
      <StickyAction href="#book">Check availability</StickyAction>
    </StickyBar>
  );
}
