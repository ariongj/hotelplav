import { StickyBar } from "@/components/layout/StickyBar";
import { StickyAction, StickyLabel } from "@/components/layout/StickyParts";
import { euro } from "@/lib/format";

import { LOWEST_TREATMENT_PRICE } from "./content";

export function SpaStickyBar() {
  return (
    <StickyBar layout="center">
      <StickyLabel>
        Treatments <em>from {euro(LOWEST_TREATMENT_PRICE)}</em>
      </StickyLabel>
      <StickyAction href="#book">Book a treatment</StickyAction>
    </StickyBar>
  );
}
