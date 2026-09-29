import type { Metadata } from "next";

import { ChefsTasting } from "@/components/dining/ChefsTasting";
import { HERO_IMAGE } from "@/components/dining/content";
import { DiningHours } from "@/components/dining/DiningHours";
import { DiningStatement } from "@/components/dining/DiningStatement";
import { DiningStickyBar } from "@/components/dining/DiningStickyBar";
import { PrivateDining } from "@/components/dining/PrivateDining";
import { TableReservation } from "@/components/dining/TableReservation";
import { Venues } from "@/components/dining/Venues";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";
import { PageHero } from "@/components/ui/PageHero";
import ui from "@/styles/ui.module.css";

export const metadata: Metadata = {
  title: "Dining",
  description:
    "A restaurant, a lounge and a bar on Lake Plav in eastern Montenegro — The Lake Room's weekly chef's menu of trout, kajmak and mountain honey, the lake terrace in summer, the all-day Fireside Lounge and the late Boathouse Bar. Reserve a table online.",
  alternates: { canonical: "/dining" },
};

export default function DiningPage() {
  return (
    <>
      <SiteNav
        cta={{ label: "Reserve", href: "#reserve" }}
        menuCta={{ label: "Reserve a table", href: "#reserve" }}
      />
      <main>
        <PageHero
          kicker="Dining"
          title={
            <>
              Dinner by <em>the lake</em>
            </>
          }
          intro="A restaurant, a lounge and a bar, and the lake terrace in summer. Trout from clear mountain water, kajmak and honey from the high pastures, and the Prokletije on the skyline."
          image={HERO_IMAGE}
          actions={
            <>
              <a href="#reserve" className={ui.btnGold}>
                Reserve a table
              </a>
              <a href="#tasting" className={ui.btnOutlineLight}>
                See the chef&apos;s menu
              </a>
            </>
          }
          overlap
        />
        <TableReservation />
        <DiningStatement />
        <Venues />
        <ChefsTasting />
        <DiningHours />
        <PrivateDining />
      </main>
      <SiteFooter email="dine" social />
      <DiningStickyBar />
    </>
  );
}
