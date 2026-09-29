import type { Metadata } from "next";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";
import { BathingRitual } from "@/components/spa/BathingRitual";
import { HERO_IMAGE } from "@/components/spa/content";
import { SpaPlanning } from "@/components/spa/SpaPlanning";
import { SpaPools } from "@/components/spa/SpaPools";
import { SpaStickyBar } from "@/components/spa/SpaStickyBar";
import { TreatmentBooking } from "@/components/spa/TreatmentBooking";
import { Treatments } from "@/components/spa/Treatments";
import { PageHero } from "@/components/ui/PageHero";
import ui from "@/styles/ui.module.css";

export const metadata: Metadata = {
  title: "Spa",
  description:
    "Pools, Finnish sauna, steam and a cold plunge beside Lake Plav in eastern Montenegro — massages, facials, sauna rituals and wellness retreats at The Lake Spa. Book a treatment online.",
  alternates: { canonical: "/spa" },
};

export default function SpaPage() {
  return (
    <>
      <SiteNav cta={{ label: "Book", href: "#book" }} menuCta={{ label: "Book a treatment", href: "#book" }} />
      <main>
        <PageHero
          kicker="Spa & wellness"
          title={
            <>
              Warm water, <em>glacial calm</em>
            </>
          }
          intro="Pools, a Finnish sauna, steam and a cold plunge beside a glacial lake — with quiet hands, mountain botanicals and nowhere else to be."
          image={HERO_IMAGE}
          actions={
            <>
              <a href="#book" className={ui.btnGold}>
                Book a treatment
              </a>
              <a href="#treatments" className={ui.btnOutlineLight}>
                Browse the menu
              </a>
            </>
          }
          overlap
        />
        <TreatmentBooking />
        <SpaPools />
        <Treatments />
        <BathingRitual />
        <SpaPlanning />
      </main>
      <SiteFooter email="spa" social />
      <SpaStickyBar />
    </>
  );
}
