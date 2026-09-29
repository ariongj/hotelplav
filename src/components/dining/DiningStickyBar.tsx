import { StickyBar } from "@/components/layout/StickyBar";
import { StickyAction, StickyLabel } from "@/components/layout/StickyParts";
import { euro } from "@/lib/format";

import { LAKE_ROOM, TASTING_PRICE } from "./content";

export function DiningStickyBar() {
  return (
    <StickyBar layout="center">
      <StickyLabel>
        {LAKE_ROOM} · Chef&apos;s menu <em>from {euro(TASTING_PRICE)}</em>
      </StickyLabel>
      <StickyAction href="#reserve">Reserve a table</StickyAction>
    </StickyBar>
  );
}
