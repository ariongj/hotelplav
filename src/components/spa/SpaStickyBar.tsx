import { StickyBar } from "@/components/layout/StickyBar";
import { StickyAction, StickyLabel } from "@/components/layout/StickyParts";

export function SpaStickyBar() {
  return (
    <StickyBar layout="center">
      <StickyLabel>
        Treatments <em>from €90</em>
      </StickyLabel>
      <StickyAction href="#book">Book a treatment</StickyAction>
    </StickyBar>
  );
}
