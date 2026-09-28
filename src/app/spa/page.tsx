import type { Metadata } from "next";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";
import { BathingRitual } from "@/components/spa/BathingRitual";
import { SpaConcierge } from "@/components/spa/SpaConcierge";
import { SpaHero } from "@/components/spa/SpaHero";
import { SpaStickyBar } from "@/components/spa/SpaStickyBar";
import { ThermalBaths } from "@/components/spa/ThermalBaths";
import { TourStrip } from "@/components/spa/TourStrip";
import { TreatmentBooking } from "@/components/spa/TreatmentBooking";
import { Treatments } from "@/components/spa/Treatments";

export const metadata: Metadata = {
  title: "Spa",
  description:
    "Pools, Finnish sauna, alpine steam and quiet hands at 1,100 metres — massages, facials, thermal rituals and wellness retreats at the Aquarius Spa Center. Book a treatment online.",
};

export default function SpaPage() {
  return (
    <>
      <SiteNav cta={{ label: "Book", href: "#book" }} menuCta={{ label: "Book a treatment", href: "#book" }} />
      <main>
        <SpaHero />
        <TreatmentBooking />
        <ThermalBaths />
        <Treatments />
        <BathingRitual />
        <SpaConcierge />
        <TourStrip />
      </main>
      <SiteFooter email="spa" social divider />
      <SpaStickyBar />
    </>
  );
}
