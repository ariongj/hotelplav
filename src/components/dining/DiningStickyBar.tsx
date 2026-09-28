import { StickyBar } from "@/components/layout/StickyBar";
import { StickyAction, StickyLabel } from "@/components/layout/StickyParts";

export function DiningStickyBar() {
  return (
    <StickyBar layout="center">
      <StickyLabel>
        Gjethja · Chef&apos;s menu <em>from €165</em>
      </StickyLabel>
      <StickyAction href="#reserve">Reserve a table</StickyAction>
    </StickyBar>
  );
}
